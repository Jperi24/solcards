// components/MemeCard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Sword, Shield, Zap, ImageOff } from 'lucide-react';

interface CardStats {
  attack: number;
  defense: number;
  cost: number;
  element: keyof typeof ELEMENT_STYLES;
  rarity: keyof typeof RARITY_STYLES;
  ability_name: string;
  ability_description: string;
}

interface Card {
  name: string;
  stats: CardStats;
  image_path: string;
  flavor_text: string;
}

interface MemeCardProps {
  card: Card;
}

const RARITY_STYLES = {
  COMMON: {
    container: "bg-gradient-to-br from-gray-200 to-gray-300",
    border: "border-gray-400",
    glow: "",
  },
  RARE: {
    container: "bg-gradient-to-br from-blue-400 to-blue-500",
    border: "border-blue-400",
    glow: "shadow-lg shadow-blue-500/50",
  },
  EPIC: {
    container: "bg-gradient-to-br from-purple-400 to-purple-500",
    border: "border-purple-400",
    glow: "shadow-lg shadow-purple-500/50",
  },
  LEGENDARY: {
    container: "bg-gradient-to-br from-yellow-400 to-orange-500",
    border: "border-yellow-400",
    glow: "shadow-xl shadow-yellow-500/50",
  },
  MYTHIC: {
    container: "bg-gradient-to-br from-pink-400 to-pink-500",
    border: "border-pink-400",
    glow: "shadow-2xl shadow-pink-500/50",
  },
  GOD_TIER: {
    container: "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200",
    border: "border-white",
    glow: "shadow-2xl shadow-white/50",
  }
} as const;

const ELEMENT_STYLES = {
  WHOLESOME: {
    bg: "bg-pink-500/20",
    text: "text-pink-300",
    icon: "💖"
  },
  TOXIC: {
    bg: "bg-green-500/20",
    text: "text-green-300",
    icon: "☢️"
  },
  DANK: {
    bg: "bg-amber-500/20",
    text: "text-amber-300",
    icon: "🔥"
  },
  CURSED: {
    bg: "bg-purple-500/20",
    text: "text-purple-300",
    icon: "👻"
  }
} as const;
const MemeCard: React.FC<MemeCardProps> = ({ card }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const rarityStyle = RARITY_STYLES[card.stats.rarity];
  const elementStyle = ELEMENT_STYLES[card.stats.element];

  useEffect(() => {
    // Reset states when card changes
    setImageError(false);
    setImageLoading(true);
    console.log('Card image path:', card.image_path);
  }, [card]);

  const handleImageError = () => {
    console.error('Failed to load image:', card.image_path);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageLoading(false);
  };

  return (
    <div 
      className={`
        relative group w-72 h-196 rounded-xl overflow-hidden
        transition-all duration-300 hover:scale-105
        ${rarityStyle.container} ${rarityStyle.glow}
        border-2 ${rarityStyle.border}
      `}
    >
      {/* Animated Background Effect for higher rarities */}
      {card.stats.rarity !== 'COMMON' && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/20 to-transparent" />
          {card.stats.rarity === 'GOD_TIER' && (
            <div className="absolute inset-0 animate-spin-slow bg-gradient-to-br from-white/20 to-transparent" />
          )}
        </div>
      )}

      <div className="relative p-4">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white truncate flex-1 mr-2">
            {card.name}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs ${elementStyle.bg} ${elementStyle.text}`}>
            {elementStyle.icon} {card.stats.element}
          </span>
        </div>

        {/* Card Image */}
        <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-black/30">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          
          {!imageError ? (
            <img
              src={card.image_path}
              alt={card.name}
              className={`
                w-full h-full object-cover transition-transform duration-300 group-hover:scale-110
                ${imageLoading ? 'opacity-0' : 'opacity-100'}
              `}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/40">
              <ImageOff className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-xs text-gray-400">Image not available</span>
            </div>
          )}

          {/* Rarity Badge */}
          <div className={`
            absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold
            ${rarityStyle.container} text-white/90 border ${rarityStyle.border}
          `}>
            {card.stats.rarity}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className={`flex items-center justify-center p-2 rounded-lg ${elementStyle.bg}`}>
              <Sword className="w-4 h-4 mr-1 text-white" />
              <span className="text-white">{card.stats.attack}</span>
            </div>
            <div className={`flex items-center justify-center p-2 rounded-lg ${elementStyle.bg}`}>
              <Shield className="w-4 h-4 mr-1 text-white" />
              <span className="text-white">{card.stats.defense}</span>
            </div>
            <div className={`flex items-center justify-center p-2 rounded-lg ${elementStyle.bg}`}>
              <Zap className="w-4 h-4 mr-1 text-white" />
              <span className="text-white">{card.stats.cost}</span>
            </div>
          </div>

          {/* Ability */}
          <div className={`p-2 rounded-lg ${elementStyle.bg}`}>
            <p className="text-white text-sm">
              <span className="font-bold">{card.stats.ability_name}</span>
              <br />
              <span className="text-white/80 text-xs">{card.stats.ability_description}</span>
            </p>
          </div>

          {/* Flavor Text */}
          <div className="text-xs text-white/60 italic px-1">
            {card.flavor_text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeCard;