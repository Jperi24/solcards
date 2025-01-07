"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/header";
import {
  Search,
  Filter,
  ChevronDown,
  Sparkles,
  Sword,
  Shield,
  Zap,
} from "lucide-react";

// Mock NFT data (replace with actual wallet fetch)
const mockNFTs = [
  {
    id: 1,
    name: "Flame Dragon",
    element: "Fire",
    rarity: "LEGENDARY",
    attack: 85,
    defense: 70,
    speed: 75,
    ability: "Inferno Blast",
  },
  {
    id: 2,
    name: "Water Spirit",
    element: "Water",
    rarity: "RARE",
    attack: 65,
    defense: 80,
    speed: 60,
    ability: "Tidal Wave",
  },
  // Add more mock data as needed
];

const RARITY_STYLES = {
  COMMON: {
    gradient: "from-gray-400 to-gray-500",
    border: "border-gray-400",
    glow: "",
  },
  RARE: {
    gradient: "from-blue-400 to-blue-500",
    border: "border-blue-400",
    glow: "shadow-lg shadow-blue-500/20",
  },
  LEGENDARY: {
    gradient: "from-purple-400 to-pink-500",
    border: "border-purple-400",
    glow: "shadow-lg shadow-purple-500/20",
  },
};

const NFTCard = ({ nft }) => {
  const styles = RARITY_STYLES[nft.rarity];

  return (
    <div
      className={`
        relative group
        bg-gradient-to-br ${styles.gradient} bg-opacity-10
        rounded-xl overflow-hidden
        transition-all duration-300
        hover:scale-105 hover:shadow-xl
        ${styles.glow}
        border-2 border-opacity-50 ${styles.border}
      `}
    >
      <div className="p-4 backdrop-blur-sm">
        {/* Card Header */}
        <Header />
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-white">{nft.name}</h3>
          <span className="px-2 py-1 text-xs rounded-full bg-black/30 text-white">
            {nft.rarity}
          </span>
        </div>

        {/* Card Image */}
        <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-black/30">
          <img
            src="/api/placeholder/400/400"
            alt={nft.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex justify-between text-white/90">
            <div className="flex items-center gap-1">
              <Sword className="w-4 h-4" />
              <span>{nft.attack}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>{nft.defense}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>{nft.speed}</span>
            </div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-black/30">
            <p className="text-sm text-white/80">
              <span className="font-semibold">Ability:</span> {nft.ability}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionView = () => {
  const [nfts, setNfts] = useState(mockNFTs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("RARITY");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  // Filter and sort NFTs
  const filteredNFTs = nfts
    .filter((nft) => {
      if (filter === "ALL") return true;
      return nft.rarity === filter;
    })
    .filter(
      (nft) =>
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.element.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sort) {
        case "RARITY":
          return (
            ["COMMON", "RARE", "LEGENDARY"].indexOf(b.rarity) -
            ["COMMON", "RARE", "LEGENDARY"].indexOf(a.rarity)
          );
        case "ATTACK":
          return b.attack - a.attack;
        case "DEFENSE":
          return b.defense - a.defense;
        case "SPEED":
          return b.speed - a.speed;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 p-6">
      {/* Header */}
      <Header />
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            My Collection
          </h1>
          <div className="text-white">
            <span className="text-gray-400">Total Cards:</span>{" "}
            <span className="font-bold">{nfts.length}</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Rarity Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Rarities</option>
              <option value="COMMON">Common</option>
              <option value="RARE">Rare</option>
              <option value="LEGENDARY">Legendary</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="RARITY">Sort by Rarity</option>
              <option value="ATTACK">Sort by Attack</option>
              <option value="DEFENSE">Sort by Defense</option>
              <option value="SPEED">Sort by Speed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-xl h-96 animate-pulse"
              />
            ))}
          </div>
        ) : (
          /* NFT Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No cards found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionView;
