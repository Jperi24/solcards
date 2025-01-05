"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Wallet, Gift, Library } from "lucide-react";
import Header from "../components/header";

const NFTRedemption = () => {
  const [connected, setConnected] = useState(false);
  const [tokens, setTokens] = useState(0);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [recentCard, setRecentCard] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock wallet connection
  const handleConnect = () => {
    setConnected(!connected);
    if (!connected) setTokens(2); // Mock tokens for demo
  };

  // Mock redemption process
  const handleRedeem = async () => {
    if (tokens > 0) {
      setIsRedeeming(true);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      setTokens((prev) => prev - 1);
      setRecentCard({
        name: "Mystic Dragon",
        rarity: "RARE",
        element: "Fire",
      });
      setIsRedeeming(false);
    }
  };

  // Create a separate component for the particles
  const BackgroundParticles = () => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/20 rounded-full w-2 h-2 animate-pulse"
            style={{
              top: mounted ? `${Math.random() * 100}%` : "0%",
              left: mounted ? `${Math.random() * 100}%` : "0%",
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950">
      {/* Only render particles after client-side mount */}

      {mounted && <BackgroundParticles />}

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto pt-16 px-4">
        {/* Header */}
        <Header />
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-20 text-purple-400" />
            Mystic Cards
            <Sparkles className="w-8 h-8 text-pink-400" />
          </h1>
          <p className="text-gray-300 text-lg">
            Redeem your tokens for unique, AI-generated trading cards
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleConnect}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
              transition-all duration-300 transform hover:-translate-y-1
              ${
                connected
                  ? "bg-red-500/20 text-red-400 border-2 border-red-500/50 hover:bg-red-500/30"
                  : "bg-purple-500/20 text-purple-400 border-2 border-purple-500/50 hover:bg-purple-500/30"
              }
            `}
          >
            <Wallet className="w-5 h-5" />
            {connected ? "Disconnect Wallet" : "Connect Wallet"}
          </button>
        </div>

        {/* Token Display */}
        {connected && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm mb-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-200 mb-2">
                Your Tokens
              </h2>
              <div className="text-4xl font-bold text-purple-400">{tokens}</div>
            </div>
          </div>
        )}

        {/* Redemption Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm mb-8">
          <div className="text-center">
            <Gift className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">
              Redeem Your Token
            </h2>
            <p className="text-gray-400 mb-6">
              Exchange your token for a unique, AI-generated trading card with
              random stats and abilities
            </p>
            <button
              onClick={handleRedeem}
              disabled={!connected || tokens === 0 || isRedeeming}
              className={`
                px-8 py-4 rounded-lg font-semibold text-lg w-full md:w-auto
                transition-all duration-300 transform hover:-translate-y-1
                ${
                  isRedeeming
                    ? "bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/50 animate-pulse cursor-wait"
                    : tokens > 0 && connected
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-2 border-purple-500/50 hover:border-pink-500/50"
                    : "bg-gray-500/20 text-gray-400 border-2 border-gray-500/50 cursor-not-allowed"
                }
              `}
            >
              {isRedeeming ? "Generating Card..." : "Redeem Token"}
            </button>
          </div>
        </div>

        {/* Recently Generated Card */}
        {recentCard && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm text-center mb-8">
            <Library className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">
              Your New Card!
            </h2>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border-2 border-purple-500/50">
              <div className="text-xl font-bold text-white mb-2">
                {recentCard.name}
              </div>
              <div className="text-sm text-purple-400 mb-1">
                {recentCard.element} Element
              </div>
              <div className="text-sm text-pink-400">{recentCard.rarity}</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm pb-8">
          <p>Powered by AI • Secured by Solana</p>
        </div>
      </div>
    </div>
  );
};

export default NFTRedemption;
