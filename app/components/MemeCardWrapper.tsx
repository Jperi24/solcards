import React from 'react';
import MemeCard from './MemeCard';

// Define the interface for the card data
interface CardData {
  name: string;
  stats: {
    attack: number;
    defense: number;
    cost: number;
    element: string;
    rarity: string;
    ability_name: string;
    ability_description: string;
  };
  image_path: string; // Ensure this is a string
  flavor_text: string;
}

const MemeCardWrapper: React.FC<{ rawCardData: CardData | string }> = ({ rawCardData }) => {
  console.log('Received raw card data:', rawCardData);

  // Function to clean and format the card data
  const formatCardData = (raw: CardData | string) => {
    try {
      // If the data is a string, parse it
      let data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      
      console.log('Processing data:', data);

      // Handle the case where the card might be nested in a 'card' property
      if (data.card) {
        data = data.card;
      }

      // Validate required fields
      if (!data) {
        throw new Error('No card data provided');
      }

      if (!data.stats) {
        console.error('Missing stats in card data:', data);
        throw new Error('Card stats are missing');
      }

      // Create the formatted card with default values for missing fields
      return {
        name: data.name || 'Unnamed Card',
        stats: {
          attack: Number(data.stats.attack) || 0,
          defense: Number(data.stats.defense) || 0,
          cost: Number(data.stats.cost) || 0,
          element: data.stats.element || 'CURSED',
          rarity: data.stats.rarity || 'COMMON',
          ability_name: data.stats.ability_name || 'No Ability',
          ability_description: data.stats.ability_description || 'No description available'
        },
        image_path: typeof data.image_path === 'function' 
          ? '/images/placeholder.jpg' 
          : (data.image_path || '/images/placeholder.jpg'),
        flavor_text: data.flavor_text || 'No flavor text available'
      };
    } catch (error) {
      console.error('Error formatting card data:', error);
      console.error('Raw data received:', raw);
      
      // Return a default card instead of null
      return {
        name: 'Error Card',
        stats: {
          attack: 0,
          defense: 0,
          cost: 0,
          element: 'CURSED',
          rarity: 'COMMON',
          ability_name: 'Error',
          ability_description: 'This card failed to load properly'
        },
        image_path: '/images/placeholder.jpg',
        flavor_text: 'Error loading card data'
      };
    }
  };

  const formattedCard = formatCardData(rawCardData);

  // Always render a card, even if it's an error card
  return <MemeCard card={formattedCard} />;
};

export default MemeCardWrapper;