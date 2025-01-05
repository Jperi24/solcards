// types/cards.ts

export type ElementType = 'WHOLESOME' | 'TOXIC' | 'DANK' | 'CURSED';
export type RarityType = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'GOD_TIER';

export interface CardStats {
  attack: number;
  defense: number;
  cost: number;
  element: ElementType;
  rarity: RarityType;
  ability_name: string;
  ability_description: string;
}

export interface Card {
  name: string;
  stats: CardStats;
  image_path: string;
  flavor_text: string;
}