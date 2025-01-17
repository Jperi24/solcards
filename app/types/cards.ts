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
  stats: {
    attack: number;
    defense: number;
    cost: number;
    element: ElementType;
    rarity: RarityType;
    ability_name: string;
    ability_description: string;
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