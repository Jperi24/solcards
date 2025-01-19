"use client";

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, Zap, Shield, Sword } from 'lucide-react';
import MemeCard from '@/app/components/MemeCard';
import type { Card, ElementType, RarityType, AbilityType, EffectType } from '@/app/types/cards';

const TutorialBattle = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [damage1, setDamage1] = useState(0);
  const [damage2, setDamage2] = useState(0);

  // Example cards for tutorial with proper typing
  
  const card1: Card = {
    name: "Tutorial Doge",
    stats: {
      attack: 5,
      defense: 3,
      cost: 3,
      element: "DANK" as ElementType,
      rarity: "COMMON" as RarityType,
      ability_name: "Much Attack",
      ability_description: "ATTACK_TRIGGER: DAMAGE 2 to opponent. once per turn.",
      ability_type: "ATTACK_TRIGGER" as AbilityType,
      effect: {
        type: "DAMAGE" as EffectType,
        value: 2,
        target: "OPPONENT"
      },
      limitation: "once per turn"
    },
    image_path: "/card-images/Tutorial-Doge.png",
    flavor_text: "Such tutorial, much learning"
  };
 

  const card2: Card = {
    name: "Practice Cat",
    stats: {
      attack: 4,
      defense: 4,
      cost: 3,
      element: "WHOLESOME" as ElementType,
      rarity: "COMMON" as RarityType,
      ability_name: "Healing Purr",
      ability_description: "PASSIVE: HEAL 1 to your cards. once per turn.",
      ability_type: "PASSIVE" as AbilityType,
      effect: {
        type: "HEAL" as EffectType,
        value: 1,
        target: "SELF"
      },
      limitation: "once per turn"
    },
    image_path: "/card-images/Tutorial-Cat.png",
    flavor_text: "A purrfect practice partner"
  };

  const tutorialSteps = [
    {
      title: "Playing Cards",
      description: "Cards cost mana to play. You can't play a card if you don't have enough mana.",
      animation: "card-play"
    },
    {
      title: "Basic Combat",
      description: "Cards deal damage equal to their attack minus the defender's defense.",
      animation: "combat"
    },
    {
      title: "Element Advantages",
      description: "Elements strong against others deal 50% more damage!",
      animation: "elements"
    },
    {
      title: "Using Abilities",
      description: "Cards have powerful abilities that can turn the tide of battle!",
      animation: "ability"
    }
  ];

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setDamage1(0);
    setDamage2(0);
    setIsPlaying(false);
  };

  const renderAnimation = () => {
    switch (tutorialSteps[step].animation) {
      case "card-play":
        return (
          <div className="relative flex items-center justify-center gap-8">
            <div className={`transform transition-all duration-500 ${isPlaying ? 'translate-y-[-50px]' : ''}`}>
              <MemeCard card={card1} />
            </div>
            <div className="absolute top-[-30px] transform translate-y-[-50%]">
              {isPlaying && <Zap className="w-8 h-8 text-yellow-400 animate-bounce" />}
              <span className="text-yellow-400 font-bold">3 Mana</span>
            </div>
          </div>
        );
      case "combat":
        return (
          <div className="flex items-center justify-between gap-8">
            <div className="relative">
              <MemeCard card={card1} />
              {damage1 > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 rounded-full p-2 animate-bounce">
                  -{damage1}
                </div>
              )}
            </div>
            <Sword className={`w-8 h-8 text-red-400 ${isPlaying ? 'animate-pulse' : ''}`} />
            <div className="relative">
              <MemeCard card={card2} />
              {damage2 > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 rounded-full p-2 animate-bounce">
                  -{damage2}
                </div>
              )}
            </div>
          </div>
        );
      case "elements":
        return (
          <div className="flex items-center justify-between gap-8">
            <MemeCard card={card1} />
            <div className="text-center">
              <div className="text-purple-400 font-bold mb-2">DANK vs WHOLESOME</div>
              <div className={`text-gray-300 ${isPlaying ? 'animate-pulse' : ''}`}>
                Normal Damage
              </div>
            </div>
            <MemeCard card={card2} />
          </div>
        );
      case "ability":
        return (
          <div className="flex items-center justify-between gap-8">
            <MemeCard card={card1} />
            <div className={`p-4 rounded-lg bg-purple-500/20 ${isPlaying ? 'animate-pulse' : ''}`}>
              <div className="text-purple-400 font-bold mb-2">Ability Effect</div>
              <div className="text-gray-300">
                {card1.stats.ability_description}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 mb-6">
      <h2 className="text-2xl font-bold text-white mb-3">Interactive Tutorial</h2>
      
      {/* Tutorial Controls */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl text-purple-400">{tutorialSteps[step].title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tutorial Description */}
      <p className="text-gray-300 mb-8">{tutorialSteps[step].description}</p>

      {/* Animation Area */}
      <div className="min-h-[400px] flex items-center justify-center bg-black/20 rounded-lg p-4 mb-4">
        {renderAnimation()}
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={step === 0}
          className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex gap-2">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === step ? 'bg-purple-400' : 'bg-purple-400/20'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={step === tutorialSteps.length - 1}
          className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TutorialBattle;