// types/cards.ts

export type ElementType = 'WHOLESOME' | 'TOXIC' | 'DANK' | 'CURSED';
export type RarityType = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'GOD_TIER';
export type AbilityType = 'ENTER_BATTLEFIELD' | 'ATTACK_TRIGGER' | 'DEATH_TRIGGER' | 'PASSIVE' | 'ACTIVATED';
export type EffectType = 'DAMAGE' | 'HEAL' | 'BUFF' | 'DEBUFF' | 'DRAW' | 'COPY' | 'TRANSFORM' | 'SUMMON' | 'BOUNCE' | 'MILL';
export type Target = 'SELF' | 'OPPONENT' | 'ALL_CARDS' | 'OWN_CARDS' | 'OPPONENT_CARDS' | 'RANDOM_CARD' | 'CHOSEN_CARD';
export type Condition = 'NONE' | 'HP_BELOW_50' | 'HAND_EMPTY' | 'BOARD_FULL' | 'ELEMENT_MATCH' | 'COMBO';

export interface AbilityEffect {
  type: EffectType;
  value: number;
  target: Target;
  duration?: number;
  condition?: Condition;
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
  effect: AbilityEffect; // Keep single effect for backwards compatibility
  effects?: AbilityEffect[]; // Optional array for enhanced abilities
  limitation: string;
}

export interface Card {
  name: string;
  stats: CardStats;
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
  cooldowns?: Record<string, number>; // Track ability cooldowns
}

export interface GameState {
  player1: PlayerState;
  player2: PlayerState;
  currentTurn: 1 | 2;
  phase: 'DRAW' | 'MAIN' | 'BATTLE' | 'END';
  activeEffects?: Array<{
    cardId: string;
    effect: AbilityEffect;
    turnsRemaining: number;
  }>;
}

// Element advantage relationships
export const ELEMENT_ADVANTAGES: Record<ElementType, { strong: ElementType; weak: ElementType }> = {
  WHOLESOME: { strong: 'CURSED', weak: 'TOXIC' },
  TOXIC: { strong: 'WHOLESOME', weak: 'DANK' },
  DANK: { strong: 'TOXIC', weak: 'CURSED' },
  CURSED: { strong: 'DANK', weak: 'WHOLESOME' }
};

// Helper type for effect calculations
export interface EffectModifiers {
  elementBonus: number;
  conditionBonus: number;
  comboBonus: number;
}

// Constants for game balance
export const GAME_CONSTANTS = {
  ELEMENT_ADVANTAGE_MULTIPLIER: 1.5,
  COMBO_BONUS_MULTIPLIER: 1.2,
  CONDITION_BONUS_MULTIPLIER: 1.3,
  MAX_HAND_SIZE: 7,
  STARTING_HEALTH: 20,
  STARTING_MANA: 3,
  MAX_MANA: 10,
  MAX_FIELD_SIZE: 5
} as const;