---
title: "把 Niagara 做成 AnimNotifyState：跟著攻擊動畫走的特效，以及 SetUsingAbsoluteLocation 的坑"
published: 2026-10-20
description: "攻擊動畫的刀光、拖尾特效，常常需要「前半段跟著武器、結束後留在原地」。把 Niagara 包成 AnimNotifyState 的做法，以及中途解除跟隨時踩到的 UpdateComponentToWorld 坑。"
tags: [UE5, C++, Niagara, Animation]
category: UE C++
draft: false
---

> 一個 AnimNotifyState，讓 Niagara 特效在攻擊動畫的指定區段內生成、跟隨、解除跟隨，並且吃得到角色的卡肉（TimeDilation）。
> 文中程式碼的 `YOURMODULE_API` 請換成自己專案的名稱。
> ⚠️ 以下內容是在 **UE 5.6** 上實作與驗證的，新版本的引擎行為可能有改變。

---

## 需求

攻擊動畫裡的特效（刀光、拖尾、蓄力光）通常有這些需求：

- 在動畫的**特定區段**出現，直接在 Montage / AnimSequence 上拉 Notify 範圍就能調
- 生成在某個 **Socket** 上，可以加位移、旋轉、縮放
- 位置、旋轉可以**分開決定**要不要跟著角色（例如只跟位置、不跟旋轉）
- Notify 結束時，可以選擇**立刻消失**，或是**留在原地**自然播完
- 角色被卡肉（`CustomTimeDilation` 變小）時，特效也要一起慢下來

引擎內建的 `Timed Niagara Effect` 可以處理一部分，但「中途解除跟隨」跟「吃 TimeDilation」要自己做，所以乾脆寫一個 AnimNotifyState，並開Paramter讓同事或是戰鬥企劃能靈活調整實際效果

---

## 生成並 Attach

生成時直接 Attach 在 Mesh 的 Socket 上：

```cpp
UNiagaraComponent* NiagaraComponent = UNiagaraFunctionLibrary::SpawnSystemAttached(
	NiagaraSystem,
	MeshComp,
	SocketName,
	LocationOffset,
	RotationOffset,
	EAttachLocation::KeepRelativeOffset,
	true // bAutoDestroy
);
```

`KeepRelativeOffset` 讓 `LocationOffset` / `RotationOffset` 被當成相對於 Socket 的偏移。

---

## 中途解除跟隨：不用 Detach，用 Absolute

想讓特效「不再跟著角色」時，第一直覺是 `DetachFromComponent`。
但這裡改用 **Absolute Location / Rotation**：元件仍然掛在 Mesh 底下，只是位置或旋轉不再從 Parent 繼承。

```cpp
NiagaraComponent->SetUsingAbsoluteLocation(true);
NiagaraComponent->SetUsingAbsoluteRotation(true);
```

好處是：

- **位置、旋轉可以分開控制**（Detach 是全部一起斷開）
- 元件的 Attach 關係不變，生命週期仍然跟著角色

---

## 坑：SetUsingAbsoluteLocation 之後一定要 UpdateComponentToWorld

只呼叫 `SetUsingAbsoluteLocation(true)`，接著 `SetWorldLocation(...)`，結果特效位置不對。
後續的 `SetWorldLocation`、`SetWorldRotation` 等 Transform 操作都會出問題。

原因要看 `SetAbsolute` 的實作：

```cpp
void USceneComponent::SetAbsolute(bool bNewAbsoluteLocation, bool bNewAbsoluteRotation, bool bNewAbsoluteScale)
{
	SetUsingAbsoluteLocation(bNewAbsoluteLocation);
	SetUsingAbsoluteRotation(bNewAbsoluteRotation);
	SetUsingAbsoluteScale(bNewAbsoluteScale);

	UpdateComponentToWorld();
}
```

`SetAbsolute` 在改完旗標後，**內部會呼叫 `UpdateComponentToWorld()`**；
單獨呼叫 `SetUsingAbsoluteLocation` / `SetUsingAbsoluteRotation` 則**不會**。

所以單獨使用時，要自己補上：

```cpp
NiagaraComponent->SetUsingAbsoluteLocation(true);
NiagaraComponent->UpdateComponentToWorld(); // 必須跑一次，否則後續 SetWorldLocation 會出問題
NiagaraComponent->SetWorldLocation(WorldLocation);
```

> 我的理解（推測）：旗標改了，但元件快取的 ComponentToWorld 還是舊的，後續的 Transform 計算就建立在過期的資料上。

如果位置、旋轉、縮放要一次設定，直接用 `SetAbsolute` 最省事；
只想改其中一項時，可以把其他兩項維持原值：

```cpp
NiagaraComponent->SetAbsolute(true, NiagaraComponent->IsUsingAbsoluteRotation(), NiagaraComponent->IsUsingAbsoluteScale());
```

---

## 讓特效吃到卡肉的 TimeDilation

Niagara 預設不會吃 Actor 的 `CustomTimeDilation`。做法是：

```cpp
NiagaraComponent->SetForceSolo(true); // 強制獨立模擬，否則不吃 TimeDilation
NiagaraComponent->SetCustomTimeDilation(OwnerCharacter->CustomTimeDilation * GlobalTimeDilation);
```

- `SetForceSolo(true)`：讓這個元件不和其他同系統的實例一起批次模擬，`CustomTimeDilation` 才會生效
- 卡肉期間角色的 `CustomTimeDilation` 會一直變，所以在 `NotifyTick` 裡**每幀同步**
- `NotifyEnd` 時把 TimeDilation 設回 `1.0`，避免留在原地播完的特效一直是慢動作

---

## 編輯器預覽

在動畫編輯器裡預覽時，`World->IsPreviewWorld()` 為 true。
這時只單純生成特效給美術看位置，不做 TimeDilation 和狀態記錄，避免預覽世界裡沒有角色或相關資料而出錯。

---

## 完整程式碼

### NiagaraFreezeFrame_AnimNotifyState.h

```cpp
#pragma once

#include "CoreMinimal.h"
#include "Animation/AnimNotifies/AnimNotifyState.h"
#include "NiagaraFreezeFrame_AnimNotifyState.generated.h"

class UNiagaraComponent;
class UNiagaraSystem;

UCLASS()
class YOURMODULE_API UNiagaraFreezeFrame_AnimNotifyState : public UAnimNotifyState
{
	GENERATED_BODY()

public:
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	TObjectPtr<UNiagaraSystem> NiagaraSystem;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	FVector LocationOffset;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	FRotator RotationOffset;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	FVector Scale = {1.f, 1.f, 1.f};

	/** 生成後位置是否跟著 Socket */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	bool bAttachedLocation = true;

	/** 生成後旋轉是否跟著 Socket */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	bool bAttachedRotation = true;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	FName SocketName;

	/** Notify 結束時立刻銷毀特效 */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	bool DestroyImmediately = false;

	/** Notify 結束時位置不再跟隨（留在原地播完） */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	bool bDetachLocation = true;

	/** Notify 結束時旋轉不再跟隨 */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	bool bDetachRotation = true;

	virtual void NotifyBegin(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation, float TotalDuration,
	                         const FAnimNotifyEventReference& EventReference) override;
	virtual void NotifyTick(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation, float FrameDeltaTime,
	                        const FAnimNotifyEventReference& EventReference) override;
	virtual void NotifyEnd(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
	                       const FAnimNotifyEventReference& EventReference) override;

private:
	/** 這次生成的特效，NotifyTick / NotifyEnd 會用到 */
	UPROPERTY()
	TObjectPtr<UNiagaraComponent> SpawnedNiagaraComponent = nullptr;
};
```

### NiagaraFreezeFrame_AnimNotifyState.cpp

```cpp
#include "NiagaraFreezeFrame_AnimNotifyState.h"

#include "NiagaraComponent.h"
#include "NiagaraFunctionLibrary.h"
#include "GameFramework/Character.h"
#include "Kismet/GameplayStatics.h"

void UNiagaraFreezeFrame_AnimNotifyState::NotifyBegin(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                                                      float TotalDuration,
                                                      const FAnimNotifyEventReference& EventReference)
{
	Super::NotifyBegin(MeshComp, Animation, TotalDuration, EventReference);

	if (!MeshComp || !IsValid(NiagaraSystem))
	{
		return;
	}

	const UWorld* World = MeshComp->GetWorld();
	AActor* OwnerActor = MeshComp->GetOwner();
	if (!World || !OwnerActor)
	{
		return;
	}
#if WITH_EDITOR
	// 預覽世界只播放 Niagara，不記錄狀態
	if (World->IsPreviewWorld())
	{
		UNiagaraComponent* NiagaraTemp = UNiagaraFunctionLibrary::SpawnSystemAttached(
			NiagaraSystem,
			MeshComp,
			SocketName,
			LocationOffset,
			RotationOffset,
			EAttachLocation::KeepRelativeOffset,
			true
		);
		if (NiagaraTemp)
		{
			NiagaraTemp->SetRelativeScale3D(Scale);
		}
		return;
	}
#endif // WITH_EDITOR
	const ACharacter* OwnerCharacter = Cast<ACharacter>(OwnerActor);
	if (!OwnerCharacter)
	{
		return;
	}

	UNiagaraComponent* NiagaraComponent = UNiagaraFunctionLibrary::SpawnSystemAttached(
		NiagaraSystem,
		MeshComp,
		SocketName,
		LocationOffset,
		RotationOffset,
		EAttachLocation::KeepRelativeOffset,
		true,
		true,
		ENCPoolMethod::AutoRelease
	);
	SpawnedNiagaraComponent = NiagaraComponent;
	if (!NiagaraComponent)
	{
		return;
	}

	const FTransform SpawnTransform = MeshComp->GetComponentTransform();
	const FVector InitWorldLocation = SpawnTransform.TransformPosition(LocationOffset);
	const FRotator InitWorldRotation = (SpawnTransform.GetRotation() * RotationOffset.Quaternion()).Rotator();

	if (!bAttachedLocation)
	{
		NiagaraComponent->SetUsingAbsoluteLocation(true);
		NiagaraComponent->UpdateComponentToWorld(); // SetUsingAbsoluteLocation 必須跑一次這個
		NiagaraComponent->SetWorldLocation(InitWorldLocation);
	}
	if (!bAttachedRotation)
	{
		NiagaraComponent->SetUsingAbsoluteRotation(true);
		NiagaraComponent->UpdateComponentToWorld();
		NiagaraComponent->SetWorldRotation(InitWorldRotation);
	}

	NiagaraComponent->SetRelativeScale3D(Scale);
	NiagaraComponent->SetForceSolo(true); // 強制獨立模擬，否則不吃 TimeDilation
	const float WorldBaseTime = UGameplayStatics::GetGlobalTimeDilation(World);
	NiagaraComponent->SetCustomTimeDilation(OwnerCharacter->CustomTimeDilation * WorldBaseTime);
}

void UNiagaraFreezeFrame_AnimNotifyState::NotifyTick(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                                                     float FrameDeltaTime,
                                                     const FAnimNotifyEventReference& EventReference)
{
	Super::NotifyTick(MeshComp, Animation, FrameDeltaTime, EventReference);

	UNiagaraComponent* NiagaraComponent = SpawnedNiagaraComponent;
	if (!MeshComp || !NiagaraComponent)
	{
		return;
	}

	const ACharacter* OwnerCharacter = Cast<ACharacter>(MeshComp->GetOwner());
	if (OwnerCharacter)
	{
		const float WorldBaseTime = UGameplayStatics::GetGlobalTimeDilation(MeshComp->GetWorld());
		NiagaraComponent->SetCustomTimeDilation(OwnerCharacter->CustomTimeDilation * WorldBaseTime);
	}

	// 位置/旋轉的跟隨已交給 attach + Absolute 處理，這裡不需要每幀手動更新 transform
}

void UNiagaraFreezeFrame_AnimNotifyState::NotifyEnd(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                                                    const FAnimNotifyEventReference& EventReference)
{
	Super::NotifyEnd(MeshComp, Animation, EventReference);

	UNiagaraComponent* NiagaraComponent = SpawnedNiagaraComponent;
	SpawnedNiagaraComponent = nullptr;
	if (!NiagaraComponent)
	{
		return;
	}

	NiagaraComponent->SetCustomTimeDilation(1.0f);
	if (DestroyImmediately)
	{
		NiagaraComponent->DestroyInstance();
		return;
	}

	const FVector CurrentWorldLocation = NiagaraComponent->GetComponentLocation();
	const FRotator CurrentWorldRotation = NiagaraComponent->GetComponentRotation();
	if (bDetachLocation)
	{
		NiagaraComponent->SetUsingAbsoluteLocation(true);
		NiagaraComponent->UpdateComponentToWorld(); // SetUsingAbsoluteLocation 必須跑一次這個
		NiagaraComponent->SetWorldLocation(CurrentWorldLocation);
	}
	if (bDetachRotation)
	{
		NiagaraComponent->SetUsingAbsoluteRotation(true);
		NiagaraComponent->UpdateComponentToWorld();
		NiagaraComponent->SetWorldRotation(CurrentWorldRotation);
	}
}
```

---

## 小結

- 攻擊特效做成 AnimNotifyState，動畫師可以直接在動畫上調整出現區段
- 中途解除跟隨用 **Absolute Location / Rotation**，位置與旋轉可以分開控制
- **單獨呼叫 `SetUsingAbsoluteLocation` / `SetUsingAbsoluteRotation` 後要補 `UpdateComponentToWorld()`**，或直接用會自動更新的 `SetAbsolute`
- 要吃卡肉就 `SetForceSolo(true)` ＋ 每幀同步 `SetCustomTimeDilation`

> 再次提醒：以上是 UE 5.6 的行為，其他版本請自行確認。
