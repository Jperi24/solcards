"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Wallet } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const [connected, setConnected] = React.useState(false);

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xl font-bold">Mystic Cards</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg transition-all duration-200 
                ${
                  isActive("/")
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
            >
              Mint
            </Link>
            <Link
              href="/myCards"
              className={`px-4 py-2 rounded-lg transition-all duration-200 
                ${
                  isActive("/myCards")
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
            >
              My Collection
            </Link>

            {/* Wallet Button */}
            <button
              onClick={() => setConnected(!connected)}
              className={`
                ml-4 px-4 py-2 rounded-lg flex items-center space-x-2
                transition-all duration-200
                ${
                  connected
                    ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                    : "bg-purple-500/20 text-purple-400 border border-purple-500/50 hover:bg-purple-500/30"
                }
              `}
            >
              <Wallet className="w-4 h-4" />
              <span>{connected ? "Disconnect" : "Connect Wallet"}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu (can be expanded if needed) */}
    </header>
  );
};

export default Header;
