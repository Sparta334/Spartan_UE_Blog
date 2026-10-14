---
title: "UPROPERTY / UFUNCTION 常用標記速查"
published: 2026-10-13
description: "整理 UE C++ 裡最常用的 UPROPERTY 與 UFUNCTION 標記，以及 Blueprint 曝露時的差異。"
tags: [UE5, C++, Reflection]
category: UE C++
draft: false
---

## 為什麼需要反射標記

UE 的反射系統（UHT）會掃描 `UPROPERTY`、`UFUNCTION` 等巨集，產生序列化、GC、Blueprint 曝露所需的程式碼。沒加 `UPROPERTY` 的 `UObject*` 指標**不會被 GC 追蹤**，物件可能被回收而留下懸空指標。

## UPROPERTY 常用組合

```cpp title="MyCharacter.h"
UCLASS()
class MYGAME_API AMyCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	// 只能在 Class Defaults 編輯，Blueprint 可讀
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Combat")
	float MaxHealth = 100.f;

	// 場景中每個 Instance 可個別調整
	UPROPERTY(EditInstanceOnly, Category = "Combat")
	TObjectPtr<AActor> PatrolTarget;

	// 執行期狀態，Blueprint 可讀寫，不出現在 Details 面板
	UPROPERTY(Transient, BlueprintReadWrite, Category = "State")
	bool bIsStunned = false;
};
```

| 標記 | 作用 |
| --- | --- |
| `EditAnywhere` | Defaults 與 Instance 都能編輯 |
| `EditDefaultsOnly` | 只能在 Blueprint Class Defaults 編輯 |
| `VisibleAnywhere` | 只顯示、不可編輯（常用於 Component 指標） |
| `BlueprintReadOnly` / `BlueprintReadWrite` | Blueprint Graph 中的存取權限 |
| `Transient` | 不序列化，存檔與複製 Asset 時不保留 |
| `Replicated` / `ReplicatedUsing=OnRep_X` | 網路複製 |

:::tip
Component 指標通常用 `VisibleAnywhere, BlueprintReadOnly`：可以在 Details 調整 Component 內的屬性，但不會把指標本身換掉。
:::

## UFUNCTION 常用組合

```cpp
// Blueprint 可呼叫，有執行腳位
UFUNCTION(BlueprintCallable, Category = "Combat")
void ApplyDamage(float Amount);

// 純函式，無執行腳位，不應有副作用
UFUNCTION(BlueprintPure, Category = "Combat")
float GetHealthPercent() const;

// C++ 宣告、Blueprint 實作
UFUNCTION(BlueprintImplementableEvent)
void OnDeath();

// C++ 提供預設實作，Blueprint 可覆寫（實作寫在 OnHit_Implementation）
UFUNCTION(BlueprintNativeEvent)
void OnHit(const FHitResult& Hit);
```

:::warning
`BlueprintNativeEvent` 的 C++ 實作函式名稱必須是 `函式名_Implementation`。呼叫時要呼叫原名稱（介面則用 `Execute_`），不要直接呼叫 `_Implementation`，否則會跳過 Blueprint 覆寫。
:::
