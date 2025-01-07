"use client";

import React, { useState, useEffect } from 'react';
import { Sword, Shield, Timer, Trophy } from 'lucide-react';
import MemeCard from '@/app/components/MemeCard';
import type { Card } from '@/app/types/cards';
import Header from "../components/header";

interface Player {
  deck: Card[];
  hand: Card[];
  activeCard: Card | null;
  health: number;
  mana: number;
}

const BattlePage = () => {
  const [player1, setPlayer1] = useState<Player>({
    deck: [],
    hand: [],
    activeCard: null,
    health: 20,
    mana: 3
  });
  
  const [player2, setPlayer2] = useState<Player>({
    deck: [],
    hand: [],
    activeCard: null,
    health: 20,
    mana: 3
  });

  const [turn, setTurn] = useState<1 | 2>(1);
  const [phase, setPhase] = useState<'draw' | 'main' | 'battle' | 'end'>('draw');
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const addToLog = (message: string) => {
    setGameLog(prev => [...prev, message]);
  };

  const playCard = (card: Card) => {
    const currentPlayer = turn === 1 ? player1 : player2;
    const setCurrentPlayer = turn === 1 ? setPlayer1 : setPlayer2;

    if (card.stats.cost <= currentPlayer.mana) {
      setCurrentPlayer(prev => ({
        ...prev,
        hand: prev.hand.filter(c => c !== card),
        activeCard: card,
        mana: prev.mana - card.stats.cost
      }));
      addToLog(`Player ${turn} played ${card.name}`);
    }
  };

  const attack = () => {
    if (!player1.activeCard || !player2.activeCard) return;

    const p1Damage = Math.max(0, player1.activeCard.stats.attack - player2.activeCard.stats.defense);
    const p2Damage = Math.max(0, player2.activeCard.stats.attack - player1.activeCard.stats.defense);

    setPlayer1(prev => ({ ...prev, health: prev.health - p2Damage }));
    setPlayer2(prev => ({ ...prev, health: prev.health - p1Damage }));

    addToLog(`Battle Result: Player 1 deals ${p1Damage} damage, Player 2 deals ${p2Damage} damage`);
  };

  const endTurn = () => {
    setTurn(turn === 1 ? 2 : 1);
    setPhase('draw');
    const setCurrentPlayer = turn === 1 ? setPlayer1 : setPlayer2;
    setCurrentPlayer(prev => ({
      ...prev,
      mana: Math.min(10, prev.mana + 1)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Game Header */}
        <Header />
        <div className="flex justify-between items-center mb-8">
          <div className="text-white">
            <h2>Player 1</h2>
            <div className="flex gap-4">
              <span>❤️ {player1.health}</span>
              <span>💧 {player1.mana}</span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Battle Arena</h1>
            <div className="text-purple-400">Turn {turn} • {phase} Phase</div>
          </div>
          <div className="text-white text-right">
            <h2>Player 2</h2>
            <div className="flex gap-4 justify-end">
              <span>❤️ {player2.health}</span>
              <span>💧 {player2.mana}</span>
            </div>
          </div>
        </div>

        {/* Battlefield */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Player 1 Field */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-white mb-4">Player 1 Field</h3>
            <div className="flex justify-center">
              {player1.activeCard && <MemeCard card={player1.activeCard} />}
            </div>
          </div>

          {/* Player 2 Field */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-white mb-4">Player 2 Field</h3>
            <div className="flex justify-center">
              {player2.activeCard && <MemeCard card={player2.activeCard} />}
            </div>
          </div>
        </div>

        {/* Battle Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={attack}
            disabled={!player1.activeCard || !player2.activeCard}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-500 flex items-center gap-2"
          >
            <Sword className="w-5 h-5" />
            Battle!
          </button>
          <button
            onClick={endTurn}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
          >
            <Timer className="w-5 h-5" />
            End Turn
          </button>
        </div>

        {/* Hand */}
        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-white mb-4">Your Hand</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {(turn === 1 ? player1.hand : player2.hand).map((card, index) => (
              <div
                key={index}
                onClick={() => playCard(card)}
                className="cursor-pointer transform hover:scale-105 transition-transform"
              >
                <MemeCard card={card} />
              </div>
            ))}
          </div>
        </div>

        {/* Game Log */}
        <div className="mt-8 bg-white/5 rounded-xl p-6">
          <h3 className="text-white mb-4">Battle Log</h3>
          <div className="h-40 overflow-y-auto text-gray-300">
            {gameLog.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattlePage;