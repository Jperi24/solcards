// types/cards.ts

export type ElementType = 'WHOLESOME' | 'TOXIC' | 'DANK' | 'CURSED';
export type RarityType = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'GOD_TIER';
export type AbilityType = 'ENTER_BATTLEFIELD' | 'ATTACK_TRIGGER' | 'DEATH_TRIGGER' | 'PASSIVE';
export type EffectType = 'DAMAGE' | 'HEAL' | 'BUFF' | 'DEBUFF' | 'DRAW';

export interface AbilityEffect {
  type: EffectType;
  value: number;
  target: string;
}

export interface CardStats {
  attack: number;
  defense: number;
  cost: number;
  element: ElementType;
  rarity: RarityType;
  ability_name: string;
  ability_description: string;
  ability_type: AbilityType;
  effect: AbilityEffect;
  limitation: string;
}

export interface Card {
  name: string;
  stats: {
    attack: number;
    defense: number;
    cost: number;
    element: ElementType;
    rarity: RarityType;
    ability_name: string;
    ability_description: string;
    ability_type: AbilityType;
    effect: AbilityEffect;
    limitation: string;
  };
  image_path: string;
  flavor_text: string;
}

// Define the interface for particles
export interface Particle {
  id: number;
  style: {
    top: string;
    left: string;
    animationDuration: string;
    animationDelay: string;
    transform: string;
    opacity: number;
  };
}

// Helper types for game state
export interface PlayerState {
  health: number;
  mana: number;
  deck: Card[];
  hand: Card[];
  field: Card[];
  usedAbilities: Set<string>;
}

export interface GameState {
  player1: PlayerState;
  player2: PlayerState;
  currentTurn: 1 | 2;
  phase: 'DRAW' | 'MAIN' | 'BATTLE' | 'END';
}

// Element advantage relationships
export const ELEMENT_ADVANTAGES: Record<ElementType, { strong: ElementType; weak: ElementType }> = {
  WHOLESOME: { strong: 'CURSED', weak: 'TOXIC' },
  TOXIC: { strong: 'WHOLESOME', weak: 'DANK' },
  DANK: { strong: 'TOXIC', weak: 'CURSED' },
  CURSED: { strong: 'DANK', weak: 'WHOLESOME' }
};