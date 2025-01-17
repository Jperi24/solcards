import OpenAI from 'openai';
import Replicate from 'replicate';
import type { Card, ElementType, RarityType } from '@/app/types/cards';

export class MemeCardGenerator {
  private openai: OpenAI;
  private replicate: Replicate;
  private readonly REPLICATE_MODEL_VERSION = "8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f";
  private readonly elements: ElementType[] = ['WHOLESOME', 'TOXIC', 'DANK', 'CURSED'];
  private readonly rarities: RarityType[] = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'GOD_TIER'];

  constructor(openaiApiKey: string, replicateApiKey: string) {
    if (!openaiApiKey) throw new Error('OpenAI API key is required');
    if (!replicateApiKey) throw new Error('Replicate API key is required');

    this.openai = new OpenAI({ apiKey: openaiApiKey });
    this.replicate = new Replicate({ auth: replicateApiKey });
  }

  public async testConnections(): Promise<{ openai: boolean; replicate: boolean }> {
    const results = { openai: false, replicate: false };
    
    try {
      await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "test" }],
        max_tokens: 1
      });
      results.openai = true;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
    }

    try {
      const response = await fetch('https://api.replicate.com/v1/models', {
        headers: {
          'Authorization': `Token ${this.replicate.auth}`,
          'Content-Type': 'application/json',
        },
      });
      results.replicate = response.ok;
    } catch (error) {
      console.error('Replicate connection test failed:', error);
    }

    return results;
  }

  private async generateCardName(element: ElementType, rarity: RarityType): Promise<string> {
    try {
      const prompt = `Generate a creative and funny name for a ${rarity.toLowerCase()} ${element.toLowerCase()} meme card. 
        The name should be meme-related and reference internet culture. Keep it under 4 words.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a creative meme card name generator." },
          { role: "user", content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content?.trim() || "Mysterious Meme";
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

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a creative meme card ability generator." },
          { role: "user", content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content || "";
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

  private async generateImage(element: ElementType, rarity: RarityType, name: string): Promise<string> {
    try {
      const imagePrompt = await this.generateImagePrompt(element, rarity, name);
      console.log('Generated image prompt:', imagePrompt);

      const output = await this.replicate.run(
        "ideogram-ai/ideogram-v2",
        {
          input: {
            prompt: imagePrompt,
            negative_prompt: "text, watermark, logo, low quality, blurry, distorted",
            style: "photo",
            width: 768,
            height: 768,
          }
        }
      ) as string | ReadableStream | string[] | { url: string };

      console.log('Raw Replicate output type:', typeof output);

      // Handle different response types
      if (output instanceof ReadableStream) {
        const reader = output.getReader();
        const chunks: Uint8Array[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) chunks.push(value);
        }
        
        const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
        let offset = 0;
        for (const chunk of chunks) {
          concatenated.set(chunk, offset);
          offset += chunk.length;
        }

        return `data:image/png;base64,${Buffer.from(concatenated).toString('base64')}`;
      }

      // Handle URL responses
      if (typeof output === 'string') {
        if (output.startsWith('http') || output.startsWith('data:')) {
          return output;
        }
        // If it's a string but not a URL, try to parse it as base64
        try {
          const base64Test = Buffer.from(output, 'base64').toString('base64');
          if (base64Test) {
            return `data:image/png;base64,${output}`;
          }
        } catch {
          // Not valid base64, fall through to default
        }
      }

      // Handle array responses
      if (Array.isArray(output) && output.length > 0) {
        const firstOutput = output[0];
        if (typeof firstOutput === 'string') {
          if (firstOutput.startsWith('http') || firstOutput.startsWith('data:')) {
            return firstOutput;
          }
          try {
            return `data:image/png;base64,${firstOutput}`;
          } catch {
            // Not valid base64, fall through to default
          }
        }
      }

      // Handle object with url
      if (typeof output === 'object' && output !== null && 'url' in output) {
        return output.url;
      }

      console.error('Invalid response format from Replicate:', output);
      return '/api/placeholder/400/400';
    } catch (error) {
      console.error('Error generating image:', error);
      return '/api/placeholder/400/400';
    }
  }

  private async generateImagePrompt(element: ElementType, rarity: RarityType, name: string): Promise<string> {
    const style = {
      COMMON: "simple meme style",
      RARE: "detailed meme artwork",
      EPIC: "high-quality digital art",
      LEGENDARY: "premium fantasy artwork",
      MYTHIC: "ethereal masterpiece",
      GOD_TIER: "divine cosmic artwork"
    }[rarity];

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Create a concise prompt for an AI image generator to create a ${style} trading card illustration for "${name}", a ${element} type card. Focus on clear visuals and ${rarity.toLowerCase()} quality.`
      }],
      max_tokens: 100,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || `${style} ${element} card illustration`;
  }

  private async generateFlavorText(name: string, element: ElementType): Promise<string> {
    try {
      const prompt = `Write a short, funny flavor text for a meme card named "${name}" with ${element.toLowerCase()} element.
        Make it reference internet culture and memes. Keep it under 10 words.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a creative meme card flavor text generator." },
          { role: "user", content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.8
      });

      return response.choices[0]?.message?.content?.trim() || "Much wow. Very meme.";
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

  private getWeightedRarity(): RarityType {
    // Define probability weights for each rarity
    const weights = {
      COMMON: 60,     // 60% chance
      RARE: 25,       // 25% chance
      EPIC: 10,       // 10% chance
      LEGENDARY: 4,   // 4% chance
      MYTHIC: 0.9,    // 0.9% chance
      GOD_TIER: 0.1   // 0.1% chance
    };
    
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [rarity, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        return rarity as RarityType;
      }
    }
    
    return 'COMMON'; // Fallback
  }

  private getElementForRarity(rarity: RarityType): ElementType {
    // Higher rarity cards have better chance of powerful elements
    const weights = {
      COMMON: { WHOLESOME: 40, TOXIC: 30, DANK: 20, CURSED: 10 },
      RARE: { WHOLESOME: 30, TOXIC: 30, DANK: 25, CURSED: 15 },
      EPIC: { WHOLESOME: 25, TOXIC: 25, DANK: 30, CURSED: 20 },
      LEGENDARY: { WHOLESOME: 20, TOXIC: 20, DANK: 30, CURSED: 30 },
      MYTHIC: { WHOLESOME: 15, TOXIC: 20, DANK: 30, CURSED: 35 },
      GOD_TIER: { WHOLESOME: 10, TOXIC: 20, DANK: 30, CURSED: 40 }
    };

    const elementWeights = weights[rarity];
    const totalWeight = Object.values(elementWeights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [element, weight] of Object.entries(elementWeights)) {
      random -= weight;
      if (random <= 0) {
        return element as ElementType;
      }
    }
    
    return 'WHOLESOME'; // Fallback
  }

  public async generateCard(): Promise<Card> {
    try {
      const rarity = this.getWeightedRarity();
      const element = this.getElementForRarity(rarity); 
      

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