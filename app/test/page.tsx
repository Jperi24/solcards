"use client";

import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import MemeCard from '@/app/components/MemeCard';
import type { Card, RarityType } from '@/app/types/cards';

const TestInterface = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateCard = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      console.log('Sending request to generate card...');

      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: 'test-wallet'
        }),
      });

      console.log('Response status:', response.status);
      
      // Log the raw response for debugging
      const rawText = await response.text();
      console.log('Raw response:', rawText);

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error(`Failed to parse JSON response: ${rawText.substring(0, 100)}...`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate card');
      }

      setGeneratedCards(prev => [data.card as Card, ...prev]);

    } catch (error) {
      console.error('Error details:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Control Panel */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Test Controls</h2>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={generateCard}
              disabled={isGenerating}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-500"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </span>
              ) : (
                'Generate Card'
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}
        </div>

        {/* Generated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {generatedCards.map((card, index) => (
            <MemeCard key={index} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestInterface;