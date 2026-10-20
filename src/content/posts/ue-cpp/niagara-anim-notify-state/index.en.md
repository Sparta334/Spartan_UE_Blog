---
title: "Niagara as an AnimNotifyState: Effects That Follow Attack Animations, and the SetUsingAbsoluteLocation Gotcha"
published: 2026-10-20
description: "Slash and trail effects on attack animations often need to follow the weapon at first and then stay behind when they end. How to wrap Niagara in an AnimNotifyState, and the UpdateComponentToWorld gotcha I hit when stopping the follow midway."
tags: [UE5, C++, Niagara, Animation]
category: UE C++
draft: false
---

> One AnimNotifyState that spawns, follows and releases a Niagara effect during a set range of an attack animation, and also respects the character's hit-stop (TimeDilation).
> In the code below, replace `YOURMODULE_API` with your own project's module name.
> ⚠️ Everything here was implemented and tested on **UE 5.6**. Newer engine versions may behave differently.

---

## Requirements

Effects in attack animations (slashes, trails, charge-up glows) usually need to:

- Appear during a **specific range** of the animation, adjustable by dragging the Notify range on the Montage / AnimSequence
- Spawn on a **Socket**, with optional offset, rotation and scale
- Decide **separately** whether location and rotation follow the character (for example, follow location but not rotation)
- When the Notify ends, either **disappear immediately** or **stay where they are** and finish playing
- Slow down along with the character during hit-stop (when `CustomTimeDilation` drops)

The engine's built-in `Timed Niagara Effect` covers part of this, but "stop following midway" and "respect TimeDilation" have to be built yourself. So I wrote my own AnimNotifyState and exposed parameters, so teammates and combat designers can tune the effect freely.

---

## Spawn and attach

Spawn the effect attached directly to a Socket on the Mesh:

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

`KeepRelativeOffset` treats `LocationOffset` / `RotationOffset` as offsets relative to the Socket.

---

## Stop following midway: use Absolute, not Detach

When you want the effect to stop following the character, the first instinct is `DetachFromComponent`.
Here I use **Absolute Location / Rotation** instead: the component stays attached to the Mesh, it just stops inheriting location or rotation from its parent.

```cpp
NiagaraComponent->SetUsingAbsoluteLocation(true);
NiagaraComponent->SetUsingAbsoluteRotation(true);
```

The benefits:

- **Location and rotation can be controlled separately** (Detach cuts everything at once)
- The attachment doesn't change, so the component's lifetime still follows the character

---

## Gotcha: always call UpdateComponentToWorld after SetUsingAbsoluteLocation

I called only `SetUsingAbsoluteLocation(true)`, then `SetWorldLocation(...)`, and the effect ended up in the wrong place.
Every transform call after that, such as `SetWorldLocation` and `SetWorldRotation`, goes wrong.

The reason is in how `SetAbsolute` is implemented:

```cpp
void USceneComponent::SetAbsolute(bool bNewAbsoluteLocation, bool bNewAbsoluteRotation, bool bNewAbsoluteScale)
{
	SetUsingAbsoluteLocation(bNewAbsoluteLocation);
	SetUsingAbsoluteRotation(bNewAbsoluteRotation);
	SetUsingAbsoluteScale(bNewAbsoluteScale);

	UpdateComponentToWorld();
}
```

After changing the flags, `SetAbsolute` **calls `UpdateComponentToWorld()` internally**.
Calling `SetUsingAbsoluteLocation` / `SetUsingAbsoluteRotation` on their own **does not**.

So when you use them on their own, add the call yourself:

```cpp
NiagaraComponent->SetUsingAbsoluteLocation(true);
NiagaraComponent->UpdateComponentToWorld(); // Must run once, or later SetWorldLocation calls go wrong
NiagaraComponent->SetWorldLocation(WorldLocation);
```

> My understanding (a guess): the flag changes, but the component's cached ComponentToWorld is still the old one, so later transform math is built on stale data.

If you're setting location, rotation and scale all at once, `SetAbsolute` is simplest.
To change just one of them, pass the current values for the other two:

```cpp
NiagaraComponent->SetAbsolute(true, NiagaraComponent->IsUsingAbsoluteRotation(), NiagaraComponent->IsUsingAbsoluteScale());
```

---

## Making the effect respect hit-stop TimeDilation

By default, Niagara ignores the Actor's `CustomTimeDilation`. Here's how to make it respect it:

```cpp
NiagaraComponent->SetForceSolo(true); // Force solo simulation, otherwise TimeDilation is ignored
NiagaraComponent->SetCustomTimeDilation(OwnerCharacter->CustomTimeDilation * GlobalTimeDilation);
```

- `SetForceSolo(true)`: stops this component from being batch-simulated with other instances of the same system, which is what lets `CustomTimeDilation` take effect
- The character's `CustomTimeDilation` keeps changing during hit-stop, so **sync it every frame** in `NotifyTick`
- In `NotifyEnd`, set TimeDilation back to `1.0`, so an effect left behind to finish playing doesn't stay in slow motion

---

## Editor preview

When previewing in the animation editor, `World->IsPreviewWorld()` is true.
In that case it just spawns the effect so artists can check its placement, and skips TimeDilation and state tracking, so it doesn't break when the preview world has no character or related data.

---

## Full source

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

	/** Whether location follows the Socket after spawning */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	bool bAttachedLocation = true;

	/** Whether rotation follows the Socket after spawning */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	bool bAttachedRotation = true;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	FName SocketName;

	/** Destroy the effect immediately when the Notify ends */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	bool DestroyImmediately = false;

	/** Stop following location when the Notify ends (finish playing in place) */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	bool bDetachLocation = true;

	/** Stop following rotation when the Notify ends */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Niagara")
	bool bDetachRotation = true;

	virtual void NotifyBegin(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation, float TotalDuration,
	                         const FAnimNotifyEventReference& EventReference) override;
	virtual void NotifyTick(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation, float FrameDeltaTime,
	                        const FAnimNotifyEventReference& EventReference) override;
	virtual void NotifyEnd(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
	                       const FAnimNotifyEventReference& EventReference) override;

private:
	/** The effect spawned this time; used by NotifyTick / NotifyEnd */
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
	// In the preview world, only play the Niagara effect and don't track state
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
		NiagaraComponent->UpdateComponentToWorld(); // Required after SetUsingAbsoluteLocation
		NiagaraComponent->SetWorldLocation(InitWorldLocation);
	}
	if (!bAttachedRotation)
	{
		NiagaraComponent->SetUsingAbsoluteRotation(true);
		NiagaraComponent->UpdateComponentToWorld();
		NiagaraComponent->SetWorldRotation(InitWorldRotation);
	}

	NiagaraComponent->SetRelativeScale3D(Scale);
	NiagaraComponent->SetForceSolo(true); // Force solo simulation, otherwise TimeDilation is ignored
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

	// Following location/rotation is handled by attach + Absolute, so there's no need to update the transform by hand every frame
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
		NiagaraComponent->UpdateComponentToWorld(); // Required after SetUsingAbsoluteLocation
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

## Summary

- Make attack effects an AnimNotifyState, so animators can adjust when they appear directly on the animation
- To stop following midway, use **Absolute Location / Rotation**, which lets you control location and rotation separately
- **After calling `SetUsingAbsoluteLocation` / `SetUsingAbsoluteRotation` on their own, add `UpdateComponentToWorld()`**, or use `SetAbsolute`, which updates automatically
- To respect hit-stop, use `SetForceSolo(true)` and sync `SetCustomTimeDilation` every frame

> Reminder: all of this is UE 5.6 behavior. Check it yourself on other versions.
