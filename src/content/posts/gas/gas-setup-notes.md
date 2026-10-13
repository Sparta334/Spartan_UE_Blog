---
title: "GAS 入門：ASC 要放在 Pawn 還是 PlayerState？"
published: 2026-10-12
description: "Gameplay Ability System 初始化時最常遇到的選擇：AbilitySystemComponent 的擁有者放哪裡，以及 InitAbilityActorInfo 的呼叫時機。"
tags: [UE5, GAS, Multiplayer]
category: GAS
draft: false
---

## 兩種放法比較

| | 放在 Pawn | 放在 PlayerState |
| --- | --- | --- |
| 角色死亡重生 | Attribute、Effect 跟著 Pawn 消失 | 保留在 PlayerState |
| 適合 | AI 敵人、單機遊戲 | 玩家角色、多人遊戲 |
| 網路更新頻率 | 跟 Pawn 一樣 | 需要調高 PlayerState 的 `NetUpdateFrequency` |

## 放在 PlayerState 時的初始化

Owner 是 PlayerState，Avatar 是 Pawn。Server 與 Client 要在不同時機呼叫 `InitAbilityActorInfo`：

```cpp title="MyHeroCharacter.cpp"
// Server：Controller 擁有 Pawn 時
void AMyHeroCharacter::PossessedBy(AController* NewController)
{
	Super::PossessedBy(NewController);
	InitAbilitySystem();
}

// Client：PlayerState 複製下來時
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
ASC 的 Replication Mode：玩家角色常用 `Mixed`，AI 用 `Minimal`。
:::
