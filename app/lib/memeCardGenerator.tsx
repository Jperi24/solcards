// lib/memeCardGenerator.ts
import OpenAI from 'openai';
import  Replicate from 'replicate';
import type { Card, ElementType, RarityType } from '@/app/types/cards';

export class MemeCardGenerator {
  private openai: OpenAI;
  private replicate: Replicate;
  private readonly elements: ElementType[] = ['WHOLESOME', 'TOXIC', 'DANK', 'CURSED'];
  private readonly rarities: RarityType[] = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'GOD_TIER'];

  constructor(openaiApiKey: string, replicateApiKey: string) {
    this.openai = new OpenAI({ apiKey: openaiApiKey });
    this.replicate = new Replicate({ auth: replicateApiKey });
  }

  private async generateCardName(element: ElementType, rarity: RarityType): Promise<string> {
    try {
      const prompt = `Generate a creative and funny name for a ${rarity.toLowerCase()} ${element.toLowerCase()} meme card. 
        The name should be meme-related and reference internet culture. Keep it under 4 words.`;

      const response = await this.openai.completions.create({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 50,
        temperature: 0.7
      });

      return response.choices[0].text?.trim() || "Mysterious Meme";
    } catch (error) {
      console.error('Error generating card name:', error);
      return `${element} ${rarity} Meme`;
    }
  }

  private async generateAbility(element: ElementType, rarity: RarityType): Promise<{ name: string; description: string }> {
    try {
      const powerLevel = {
        COMMON: "basic",
        RARE: "moderate",
        EPIC: "powerful",
        LEGENDARY: "very powerful",
        MYTHIC: "extremely powerful",
        GOD_TIER: "game-changing"
      }[rarity];

      const prompt = `Create a ${powerLevel} ability for a ${element.toLowerCase()} meme-themed trading card.
        Format:
        Name: [short, catchy name]
        Description: [brief ability description, max 15 words]
        
        Make it meme-related and reference internet culture.`;

      const response = await this.openai.completions.create({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.7
      });

      const content = response.choices[0].text || "";
      const name = content.match(/Name: (.*)/)?.[1] || "Mystery Ability";
      const description = content.match(/Description: (.*)/)?.[1] || "Does something mysterious";

      return { name, description };
    } catch (error) {
      console.error('Error generating ability:', error);
      return {
        name: "Basic Ability",
        description: `${element} power of ${rarity} strength`
      };
    }
  }

  // lib/memeCardGenerator.ts (only the image generation part)

private async generateImage(element: ElementType, rarity: RarityType, name: string): Promise<string> {
  try {
    const style = {
      COMMON: "simple meme style, clean digital art",
      RARE: "detailed meme artwork, vibrant colors",
      EPIC: "high-quality digital art with special effects, dynamic lighting",
      LEGENDARY: "premium fantasy artwork with spectacular effects, cinematic quality",
      MYTHIC: "ethereal digital masterpiece with cosmic effects, otherworldly",
      GOD_TIER: "divine cosmic artwork, ultra-realistic, mind-bending quality"
    }[rarity];

    // Generate a more specific image prompt
    const promptResponse = await this.openai.completions.create({
      model: "text-davinci-003",
      prompt: `Create a detailed, artistic prompt for an AI image generator to create a meme-themed trading card illustration.
        Card Name: "${name}"
        Element Type: ${element}
        Style: ${style}
        
        Focus on:
        - Modern meme culture and internet references
        - Trading card game art style
        - Clear central figure or subject
        - Appropriate mood for the element type
        - ${rarity} level of detail and effects
        
        Keep it detailed but under 100 words.`,
      max_tokens: 200,
      temperature: 0.7
    });

    const imagePrompt = promptResponse.choices[0].text?.trim() || "";
    console.log('Generated image prompt:', imagePrompt); // Debug log

    // Use Replicate's SDXL for image generation
    const prediction = await this.replicate.run(
      "stability-ai/sdxl:d830ba5dabf8090ec0db6c10fc862c6eb1c929e1a194a5411852d25fd954ac82",
      {
        input: {
          prompt: imagePrompt,
          negative_prompt: "text, watermark, logo, low quality, blurry, distorted, anime, cartoon, duplicate, multiple images",
          num_outputs: 1,
          guidance_scale: rarity === 'GOD_TIER' ? 9.5 : rarity === 'MYTHIC' ? 8.5 : 7.5,
          num_inference_steps: rarity === 'GOD_TIER' ? 70 : rarity === 'MYTHIC' ? 60 : 50,
          width: 768,
          height: 768,
          refine: "expert_ensemble_refiner",
          scheduler: "K_EULER",
          apply_watermark: false
        }
      }
    );

    console.log('Replicate response:', prediction); // Debug log

    if (Array.isArray(prediction) && prediction[0]) {
      // Store or process the image URL if needed
      const imageUrl = prediction[0];
      console.log('Generated image URL:', imageUrl);
      return imageUrl;
    }

    console.log('Falling back to placeholder image');
    return '/api/placeholder/400/400';
  } catch (error) {
    console.error('Error generating image:', error);
    return '/api/placeholder/400/400';
  }
}
  private async generateFlavorText(name: string, element: ElementType): Promise<string> {
    try {
      const prompt = `Write a short, funny flavor text for a meme card named "${name}" with ${element.toLowerCase()} element.
        Make it reference internet culture and memes. Keep it under 10 words.`;

      const response = await this.openai.completions.create({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 50,
        temperature: 0.8
      });

      return response.choices[0].text?.trim() || "Much wow. Very meme.";
    } catch (error) {
      console.error('Error generating flavor text:', error);
      return "Such meme, much wow!";
    }
  }

  private generateStats(rarity: RarityType): { attack: number; defense: number; cost: number } {
    const baseStats = {
      COMMON: { min: 1, max: 5 },
      RARE: { min: 3, max: 7 },
      EPIC: { min: 5, max: 8 },
      LEGENDARY: { min: 7, max: 9 },
      MYTHIC: { min: 8, max: 10 },
      GOD_TIER: { min: 9, max: 12 }
    }[rarity];

    return {
      attack: Math.floor(Math.random() * (baseStats.max - baseStats.min + 1)) + baseStats.min,
      defense: Math.floor(Math.random() * (baseStats.max - baseStats.min + 1)) + baseStats.min,
      cost: Math.floor((baseStats.min + baseStats.max) / 3)
    };
  }

  public async generateCard(): Promise<Card> {
    try {
      // Generate basic properties
      const element = this.elements[Math.floor(Math.random() * this.elements.length)];
      const rarity = this.rarities[Math.floor(Math.random() * this.rarities.length)];

      // Generate card content with error handling for each step
      const name = await this.generateCardName(element, rarity);
      const ability = await this.generateAbility(element, rarity);
      const stats = this.generateStats(rarity);
      const image_path = await this.generateImage(element, rarity, name);
      const flavor_text = await this.generateFlavorText(name, element);

      return {
        name,
        stats: {
          ...stats,
          element,
          rarity,
          ability_name: ability.name,
          ability_description: ability.description
        },
        image_path,
        flavor_text
      };
    } catch (error) {
      console.error('Error in card generation:', error);
      throw error;
    }
  }
}