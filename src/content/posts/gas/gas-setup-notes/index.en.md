---
title: "GAS Basics: Should the ASC Live on the Pawn or the PlayerState?"
published: 2026-10-12
description: "The most common choice when setting up the Gameplay Ability System: which actor owns the AbilitySystemComponent, and when to call InitAbilityActorInfo."
tags: [UE5, GAS, Multiplayer]
category: Gameplay
draft: false
---

## Comparing the two options

| | On the Pawn | On the PlayerState |
| --- | --- | --- |
| Character death and respawn | Attributes and Effects disappear with the Pawn | Kept on the PlayerState |
| Good for | AI enemies, single-player games | Player characters, multiplayer games |
| Network update rate | Same as the Pawn | Raise the PlayerState's `NetUpdateFrequency` |

## Initializing when the ASC is on the PlayerState

The Owner is the PlayerState and the Avatar is the Pawn. The server and the client have to call `InitAbilityActorInfo` at different times:

```cpp title="MyHeroCharacter.cpp"
// Server: when the Controller possesses the Pawn
void AMyHeroCharacter::PossessedBy(AController* NewController)
{
	Super::PossessedBy(NewController);
	InitAbilitySystem();
}

// Client: when the PlayerState is replicated
void AMyHeroCharacter::OnRep_PlayerState()
{
	Super::OnRep_PlayerState();
	InitAbilitySystem();
}

void AMyHeroCharacter::InitAbilitySystem()
{
	AMyPlayerState* PS = GetPlayerState<AMyPlayerState>();
	if (!PS) return;

	AbilitySystemComponent = PS->GetAbilitySystemComponent();
	AbilitySystemComponent->InitAbilityActorInfo(PS, this);
}
```

:::note
ASC Replication Mode: player characters usually use `Mixed`, and AI uses `Minimal`.
:::
