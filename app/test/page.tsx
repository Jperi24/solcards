"use client";

import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import MemeCard from '@/app/components/MemeCard';
import type { Card, RarityType } from '@/app/types/cards';

const TestInterface = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateBase64 = (str: string) => {
    try {
      // Remove data URL prefix if present
      const base64String = str.includes('base64,') 
        ? str.split('base64,')[1] 
        : str;
      
      // Test if it's a valid base64 string
      return btoa(atob(base64String)) === base64String;
    } catch (e) {
      return false;
    }
  };

  const cleanupBase64ImagePath = (imagePath: string): string => {
    if (!imagePath) return '/api/placeholder/400/400';

    // If it's already a data URL, validate it
    if (imagePath.startsWith('data:image')) {
      return validateBase64(imagePath) ? imagePath : '/api/placeholder/400/400';
    }

    // If it's a bare base64 string
    if (validateBase64(imagePath)) {
      return `data:image/png;base64,${imagePath}`;
    }

    // If it's a URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    return '/api/placeholder/400/400';
  };

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
      
      // Get the raw text and try to parse it
      const rawText = await response.text();
      console.log('Raw response length:', rawText.length);

      let data;
      try {
        data = JSON.parse(rawText);
        console.log('Parsed data received');

        // Clean up the card data
        const cleanedCard: Card = {
          name: data.name.replace(/^"|"$/g, ''),
          stats: {
            attack: Number(data.stats.attack),
            defense: Number(data.stats.defense),
            cost: Number(data.stats.cost),
            element: data.stats.element,
            rarity: data.stats.rarity,
            ability_name: data.stats.ability_name,
            ability_description: data.stats.ability_description
          },
          image_path: cleanupBase64ImagePath(data.image_path),
          flavor_text: data.flavor_text.replace(/^"|"$/g, '')
        };

        console.log('Card prepared with image path length:', cleanedCard.image_path.length);
        setGeneratedCards(prev => [cleanedCard, ...prev]);
      } catch (e) {
        console.error('Error parsing or processing card data:', e);
        throw new Error(`Failed to process card data: ${e}`);
      }
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
            <div key={index} className="flex justify-center">
              <MemeCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestInterface;