"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, Wallet, Info, Library, Wand2, Stars, Zap, Sword, Dices } from "lucide-react";
import Header from "./components/header";
import MemeCard from '@/app/components/MemeCard';
import type { Card, ElementType, RarityType } from '@/app/types/cards';

const NFTRedemption = () => {
  const [connected, setConnected] = useState(false);
  const [tokens, setTokens] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<Card | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; style: any }>>([]);
  const [magicBurst, setMagicBurst] = useState(false);
  const [summoningPhase, setSummoningPhase] = useState<'idle' | 'charging' | 'summoning' | 'revealing'>('idle');
  const [portalIntensity, setPortalIntensity] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Portal intensity animation
  useEffect(() => {
    if (showPortal) {
      const interval = setInterval(() => {
        setPortalIntensity(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showPortal]);

  // Dynamic particle system
  useEffect(() => {
    if (showPortal) {
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${2 + Math.random() * 3}s`,
          animationDelay: `${Math.random()}s`,
          transform: `scale(${0.5 + Math.random()})`,
          opacity: 0.1 + Math.random() * 0.9
        }
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [showPortal]);

  const handleTestGenerate = async () => {
    try {
      setIsGenerating(true);
      setSummoningPhase('charging');
      setShowPortal(true);

      // Phase 1: Charging
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSummoningPhase('summoning');
      
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: 'test-wallet' }),
      });

      const rawText = await response.text();
      const data = JSON.parse(rawText);
      
      const cleanedCard: Card = {
        name: data.name.replace(/^"|"$/g, ''),
        stats: {
          attack: Number(data.stats.attack),
          defense: Number(data.stats.defense),
          cost: Number(data.stats.cost),
          element: data.stats.element as ElementType,
          rarity: data.stats.rarity as RarityType,
          ability_name: data.stats.ability_name,
          ability_description: data.stats.ability_description,
          ability_type: data.stats.ability_type,
          effect: data.stats.effect,
          limitation: data.stats.limitation
        },
        image_path: data.image_path,
        flavor_text: data.flavor_text.replace(/^"|"$/g, '')
      };

      // Phase 2: Summoning Effect
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSummoningPhase('revealing');
      setMagicBurst(true);

      // Phase 3: Reveal
      await new Promise(resolve => setTimeout(resolve, 500));
      setGeneratedCard(cleanedCard);

    } catch (error) {
      console.error('Error generating card:', error);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setShowPortal(false);
        setSummoningPhase('idle');
        setMagicBurst(false);
      }, 1000);
    }
  };

  // Mystical Background Elements
  const MysticalBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-indigo-950/50 to-purple-950/50 animate-gradient" />
      
      {/* Floating runes */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`rune-${i}`}
          className="absolute text-purple-500/20 text-4xl font-mystical animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`
          }}
        >
          ⚡️✨💫
        </div>
      ))}

      {/* Energy waves */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={`wave-${i}`}
            className="absolute inset-0 border-2 border-purple-500/20 rounded-full animate-ripple"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>

      {/* Ambient particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute bg-white/30 rounded-full w-1 h-1 animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 overflow-hidden">
      <MysticalBackground />

      <div className="relative z-10 max-w-4xl mx-auto pt-16 px-4">
        <Header />
        
        {/* Beta Banner with enhanced effects */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-purple-500/20 border-2 border-purple-500/50 rounded-lg p-4 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 text-purple-300">
              <Info className="w-5 h-5" />
              <span className="font-semibold">Beta Testing Phase</span>
            </div>
            <p className="text-gray-300 text-sm mt-2">
              Try our card generation system for free! No wallet required during beta.
            </p>
          </div>
        </div>

        {/* Main Title with Magical Effects */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          </div>
          <h1 className="relative text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-x mb-4">
            Summon Your Card
          </h1>
          <p className="relative text-gray-300 text-lg">
            Redeem your tokens for unique, AI-generated trading cards
          </p>
        </div>

        {/* Generation Section with Enhanced Effects */}
        <div className="relative mb-16">
          {/* Magical Portal */}
          {showPortal && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem]">
              {/* Portal Rings */}
              <div className={`absolute inset-0 transition-transform duration-1000 ${summoningPhase === 'summoning' ? 'scale-110' : 'scale-100'}`}>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={`ring-${i}`}
                    className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-spin-slow"
                    style={{
                      animationDuration: `${20 - i * 2}s`,
                      transform: `scale(${1 - i * 0.1})`,
                      borderWidth: `${4 - i}px`,
                      opacity: 0.3 + (portalIntensity / 200)
                    }}
                  />
                ))}
              </div>

              {/* Energy Beams */}
              {summoningPhase === 'summoning' && (
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={`beam-${i}`}
                      className="absolute top-1/2 left-1/2 w-2 h-[200%] bg-gradient-to-t from-transparent via-purple-500/50 to-transparent animate-spin-slow origin-bottom"
                      style={{
                        transform: `rotate(${(i * 45)}deg) translateY(-50%)`,
                        animationDuration: '3s',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Floating Runes and Symbols */}
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className="absolute animate-float text-purple-400/80"
                  style={{
                    ...particle.style,
                    transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
                  }}
                >
                  {['✨', '⚡️', '💫', '🌟'][Math.floor(Math.random() * 4)]}
                </div>
              ))}
            </div>
          )}

          {/* Generation Button */}
          <div className="flex justify-center">
            <button
              onClick={handleTestGenerate}
              disabled={isGenerating}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl
                       border-2 border-purple-500/50 hover:border-pink-500/50 text-white
                       transform hover:-translate-y-1 transition-all duration-300"
            >
              {/* Button Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
              
              {/* Button Content */}
              <div className="relative flex items-center gap-3">
                {isGenerating ? (
                  <>
                    {summoningPhase === 'charging' && (
                      <>
                        <Zap className="w-5 h-5 animate-pulse" />
                        <span>Charging Magic...</span>
                      </>
                    )}
                    {summoningPhase === 'summoning' && (
                      <>
                        <Sword className="w-5 h-5 animate-spin" />
                        <span>Summoning Card...</span>
                      </>
                    )}
                    {summoningPhase === 'revealing' && (
                      <>
                        <Stars className="w-5 h-5 animate-pulse" />
                        <span>Revealing...</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 group-hover:animate-bounce" />
                    <span>Generate Magical Card</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Generated Card Display with Enhanced Effects */}
        {generatedCard && (
          <div className="relative">
            {/* Card Container with Magical Frame */}
            <div className="relative bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm mb-8 animate-fade-in-up overflow-hidden">
              {/* Magical Aura */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent animate-wave" />
              </div>

              {/* Card Content */}
              <div className="relative">
                <div className="relative mb-6">
                  <Library className="w-12 h-12 text-purple-400 mx-auto animate-bounce-slow" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                </div>

                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-x mb-6">
                  Your Magical Creation
                </h2>

                {/* Card Display with Effects */}
                <div className="relative flex justify-center">
                  {/* Magical Frame */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-pink-500/0 animate-pulse rounded-xl" />
                  
                  {/* Floating Effects */}
                  {[...Array(8)].map((_, i) => (
                    <Sparkles
                      key={i}
                      className="absolute text-yellow-300/50 animate-float"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: '16px',
                        height: '16px',
                        animationDelay: `${i * 0.5}s`,
                        transform: `rotate(${Math.random() * 360}deg)`
                      }}
                    />
                  ))}
                  
                  {/* Magic Circle Effects */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full animate-spin-slow" />
                    <div className="absolute inset-4 border-2 border-pink-500/20 rounded-full animate-spin-reverse-slow" />
                    <div className="absolute inset-8 border-2 border-purple-500/20 rounded-full animate-spin-slow" />
                  </div>

                  {/* Card Component with Transform Effects */}
                  <div className="transform hover:scale-105 transition-all duration-500 hover:rotate-1">
                    <div className="relative group">
                      {/* Hover Glow Effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                      
                      {/* Card with Magical Border */}
                      <div className="relative">
                        <MemeCard card={generatedCard} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Stats Display */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="bg-purple-500/10 rounded-lg p-4 backdrop-blur-sm border border-purple-500/20">
                    <div className="text-purple-300 text-sm mb-1">Attack</div>
                    <div className="text-2xl font-bold text-white">{generatedCard.stats.attack}</div>
                  </div>
                  <div className="bg-pink-500/10 rounded-lg p-4 backdrop-blur-sm border border-pink-500/20">
                    <div className="text-pink-300 text-sm mb-1">Defense</div>
                    <div className="text-2xl font-bold text-white">{generatedCard.stats.defense}</div>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4 backdrop-blur-sm border border-purple-500/20">
                    <div className="text-purple-300 text-sm mb-1">Cost</div>
                    <div className="text-2xl font-bold text-white">{generatedCard.stats.cost}</div>
                  </div>
                </div>

                {/* Magical Rarity Badge */}
                <div className="mt-6">
                  <div className="inline-block relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full blur opacity-30 animate-pulse" />
                    <div className="relative px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/50">
                      <span className="text-white font-semibold">{generatedCard.stats.rarity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Magical Footer */}
        <div className="text-center pb-8">
          <div className="inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 animate-shine" />
              <p className="relative text-gray-400 text-sm px-4 py-2">
                Powered by AI • Secured by Solana
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTRedemption;