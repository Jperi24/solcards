import React from 'react';
import { Sword, Shield, Zap, Heart, Sparkles, Crown, BookOpen, Stars } from 'lucide-react';
import Header from "@/app/components/header";
import TutorialBattle from '../components/TutorialBattle';

const HowToPlayPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 p-8">
      <Header />
      <div className="max-w-4xl mx-auto pt-20">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-2">
          <Crown className="w-8 h-8 text-purple-400" />
          How to Play
        </h1>

   

        {/* Interactive Tutorial */}
        <TutorialBattle />

        {/* Basic Rules Section */}
        <div className="bg-white/5 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Basic Rules
          </h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-lg">
              <Heart className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Game Setup</h3>
                <p>Start with 20 health and 3 mana. Draw 4 cards.</p>
                <p className="text-sm text-gray-400">First player gets an extra card but skips first mana gain.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-lg">
              <Zap className="w-8 h-8 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Turn Structure</h3>
                <p>1. Draw Phase: Draw 1 card, gain 1 mana (max 10)</p>
                <p>2. Main Phase: Play cards from your hand</p>
                <p>3. Battle Phase: Attack with your cards</p>
                <p>4. End Phase: Resolve end-of-turn effects</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-lg">
              <Sword className="w-8 h-8 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Combat Rules</h3>
                <p>Cards can't attack the turn they're played ("summoning sickness")</p>
                <p>Combat damage = Attacker's Attack - Defender's Defense</p>
                <p className="text-sm text-gray-400">Both cards deal damage simultaneously in battle</p>
              </div>
            </div>
          </div>
        </div>

        {/* Elements Section */}
        <div className="bg-white/5 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Stars className="w-6 h-6 text-purple-400" />
            Elements & Advantages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-pink-500/20 border border-pink-500/30">
              <h3 className="text-xl font-bold text-pink-300 mb-2">WHOLESOME</h3>
              <div className="space-y-2">
                <p className="text-gray-300">💖 Healing and defense focused</p>
                <p className="text-green-300">Strong vs CURSED (+50% damage)</p>
                <p className="text-red-300">Weak vs TOXIC (-25% damage)</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30">
              <h3 className="text-xl font-bold text-green-300 mb-2">TOXIC</h3>
              <div className="space-y-2">
                <p className="text-gray-300">☠️ Damage over time effects</p>
                <p className="text-green-300">Strong vs WHOLESOME (+50% damage)</p>
                <p className="text-red-300">Weak vs DANK (-25% damage)</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
              <h3 className="text-xl font-bold text-yellow-300 mb-2">DANK</h3>
              <div className="space-y-2">
                <p className="text-gray-300">🔥 Burst damage and combos</p>
                <p className="text-green-300">Strong vs TOXIC (+50% damage)</p>
                <p className="text-red-300">Weak vs CURSED (-25% damage)</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <h3 className="text-xl font-bold text-purple-300 mb-2">CURSED</h3>
              <div className="space-y-2">
                <p className="text-gray-300">👻 Control and debuffs</p>
                <p className="text-green-300">Strong vs DANK (+50% damage)</p>
                <p className="text-red-300">Weak vs WHOLESOME (-25% damage)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Win Conditions Section */}
        <div className="bg-white/5 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Victory Conditions</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-bold text-red-300">Reduce HP to 0</h3>
              </div>
              <p className="text-gray-300">Deal damage to your opponent until their health points reach zero.</p>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold text-blue-300">Deck Out</h3>
              </div>
              <p className="text-gray-300">Win if your opponent cannot draw a card when required.</p>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-purple-300">Special Victory</h3>
              </div>
              <p className="text-gray-300">Some GOD_TIER cards have unique win conditions!</p>
            </div>
          </div>
        </div>

        {/* Advanced Tips */}
        <div className="bg-white/5 rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Pro Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Deck Building</h3>
                  <p className="text-gray-300">Balance your deck with different elements. Include both high and low-cost cards.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Mana Management</h3>
                  <p className="text-gray-300">Don't spend all your mana each turn. Save some for abilities and reactions.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Sword className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Combat Timing</h3>
                  <p className="text-gray-300">Consider element advantages before attacking. Sometimes waiting is better!</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Ability Usage</h3>
                  <p className="text-gray-300">Track your opponent's used abilities. Don't waste counters on weak plays.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-white/5 rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Reference</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-black/30 p-3 rounded-lg">
              <h3 className="font-bold text-purple-300 mb-2">Starting Values</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Health: 20</li>
                <li>• Initial Mana: 3</li>
                <li>• Starting Hand: 4 cards</li>
                <li>• Deck Size: 20 cards</li>
              </ul>
            </div>

            <div className="bg-black/30 p-3 rounded-lg">
              <h3 className="font-bold text-purple-300 mb-2">Turn Phases</h3>
              <ul className="text-gray-300 space-y-1">
                <li>1. Draw Phase</li>
                <li>2. Play Card Phase</li>
                <li>3. Battle Phase</li>
                <li>4. End Phase</li>
              </ul>
            </div>

            <div className="bg-black/30 p-3 rounded-lg">
              <h3 className="font-bold text-purple-300 mb-2">Card Limits</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Hand Size: 7 cards</li>
                <li>• Field Size: 5 cards</li>
                <li>• 1 attack per turn</li>
                <li>• Max Mana: 10</li>
              </ul>
            </div>

            <div className="bg-black/30 p-3 rounded-lg">
              <h3 className="font-bold text-purple-300 mb-2">Combat Math</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Base: ATK - DEF</li>
                <li>• Strong: ×1.5 damage</li>
                <li>• Weak: ×0.75 damage</li>
                <li>• Min damage: 0</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowToPlayPage;