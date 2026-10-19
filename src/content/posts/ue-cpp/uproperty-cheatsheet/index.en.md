---
title: "UPROPERTY / UFUNCTION Specifier Cheat Sheet"
published: 2026-10-13
description: "The UPROPERTY and UFUNCTION specifiers I use most in UE C++, and how they differ when exposed to Blueprint."
tags: [UE5, C++, Reflection]
category: UE C++
draft: false
---

## Why reflection specifiers matter

UE's reflection system (UHT) scans macros such as `UPROPERTY` and `UFUNCTION` and generates the code needed for serialization, garbage collection and Blueprint exposure. A `UObject*` pointer without `UPROPERTY` is **not tracked by the GC**, so the object can be collected and leave a dangling pointer.

## Common UPROPERTY combinations

```cpp title="MyCharacter.h"
UCLASS()
class MYGAME_API AMyCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	// Editable only in Class Defaults, readable from Blueprint
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Combat")
	float MaxHealth = 100.f;

	// Each instance placed in the level can be adjusted separately
	UPROPERTY(EditInstanceOnly, Category = "Combat")
	TObjectPtr<AActor> PatrolTarget;

	// Runtime state: Blueprint can read and write it, and it doesn't show in the Details panel
	UPROPERTY(Transient, BlueprintReadWrite, Category = "State")
	bool bIsStunned = false;
};
```

| Specifier | Effect |
| --- | --- |
| `EditAnywhere` | Editable in both Defaults and Instances |
| `EditDefaultsOnly` | Editable only in Blueprint Class Defaults |
| `VisibleAnywhere` | Shown but not editable (common for Component pointers) |
| `BlueprintReadOnly` / `BlueprintReadWrite` | Access level in Blueprint graphs |
| `Transient` | Not serialized; not kept when saving or duplicating the asset |
| `Replicated` / `ReplicatedUsing=OnRep_X` | Network replication |

:::tip
Component pointers usually use `VisibleAnywhere, BlueprintReadOnly`. You can still tweak the component's own properties in Details, but the pointer itself can't be swapped out.
:::

## Common UFUNCTION combinations

```cpp
// Callable from Blueprint, with execution pins
UFUNCTION(BlueprintCallable, Category = "Combat")
void ApplyDamage(float Amount);

// Pure function: no execution pins, and it shouldn't have side effects
UFUNCTION(BlueprintPure, Category = "Combat")
float GetHealthPercent() const;

// Declared in C++, implemented in Blueprint
UFUNCTION(BlueprintImplementableEvent)
void OnDeath();

// C++ provides a default implementation that Blueprint can override (write it in OnHit_Implementation)
UFUNCTION(BlueprintNativeEvent)
void OnHit(const FHitResult& Hit);
```

:::warning
The C++ implementation of a `BlueprintNativeEvent` must be named `FunctionName_Implementation`. Always call the original name (or `Execute_` for interfaces), never `_Implementation` directly, or you'll skip the Blueprint override.
:::
