"use client";

import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, Wallet } from 'lucide-react';
import MemeCard from '@/app/components/MemeCard';
import type  { Card } from '@/app/types/cards';
import Header from "../components/header";

interface ListingData {
  id: string;
  card: Card;
  price: number;
  seller: string;
}

const MarketplacePage = () => {
  const [listedCards, setListedCards] = useState<ListingData[]>([]);
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [listingPrice, setListingPrice] = useState<string>('');
  const [isListing, setIsListing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock function - Replace with actual wallet integration
  const handleBuy = async (listing: ListingData) => {
    try {
      // Add your Solana transaction logic here
      console.log('Buying card:', listing);
    } catch (error) {
      console.error('Error buying card:', error);
    }
  };

  const handleList = async () => {
    if (!selectedCard || !listingPrice) return;
    try {
      // Add your NFT listing logic here
      const newListing: ListingData = {
        id: Math.random().toString(),
        card: selectedCard,
        price: parseFloat(listingPrice),
        seller: 'Your Wallet Address' // Replace with actual wallet address
      };
      setListedCards(prev => [...prev, newListing]);
      setIsListing(false);
      setSelectedCard(null);
      setListingPrice('');
    } catch (error) {
      console.error('Error listing card:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Card Marketplace</h1>
          <button
            onClick={() => setIsListing(!isListing)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            {isListing ? 'Cancel Listing' : 'List a Card'}
          </button>
        </div>

        {/* Listing Modal */}
        {isListing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-white mb-4">List Your Card</h2>
              
              {/* Card Selection */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Select Card</label>
                <select
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  onChange={(e) => {
                    const card = ownedCards.find(c => c.name === e.target.value);
                    if (card) setSelectedCard(card);
                  }}
                >
                  <option value="">Select a card</option>
                  {ownedCards.map(card => (
                    <option key={card.name} value={card.name}>{card.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Input */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Price (SOL)</label>
                <input
                  type="number"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="Enter price in SOL"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleList}
                disabled={!selectedCard || !listingPrice}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-500"
              >
                List Card
              </button>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
          >
            <option value="all">All Cards</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
          >
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rarity">Rarity</option>
          </select>
        </div>

        {/* Listed Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listedCards.map(listing => (
            <div key={listing.id} className="relative">
              <MemeCard card={listing.card} />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/80 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">{listing.price} SOL</span>
                    <span className="text-gray-400 text-sm truncate">{listing.seller}</span>
                  </div>
                  <button
                    onClick={() => handleBuy(listing)}
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;