import OpenAI from 'openai';
import Replicate from 'replicate';
import type { Card, ElementType, RarityType } from '@/app/types/cards';

type AbilityType = 'ENTER_BATTLEFIELD' | 'ATTACK_TRIGGER' | 'DEATH_TRIGGER' | 'PASSIVE';
type EffectType = 'DAMAGE' | 'HEAL' | 'BUFF' | 'DEBUFF' | 'DRAW';

interface StructuredAbility {
  name: string;
  type: AbilityType;
  effect: {
    type: EffectType;
    value: number;
    target: string;
  };
  limitation: string;
}

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

  private async generateAbility(element: ElementType, rarity: RarityType): Promise<{ 
    name: string; 
    description: string;
    type: AbilityType;
    effect: {
      type: EffectType;
      value: number;
      target: string;
    };
    limitation: string;
  }> {
    const abilityStructure = await this.generateStructuredAbility(element, rarity);
    
    return {
      name: abilityStructure.name,
      description: this.formatAbilityDescription(abilityStructure),
      type: abilityStructure.type,
      effect: abilityStructure.effect,
      limitation: abilityStructure.limitation
    };
  }
  
  private async generateStructuredAbility(element: ElementType, rarity: RarityType): Promise<StructuredAbility> {
    let attempts = 0;
    let ability: StructuredAbility;
    
    do {
      const powerScale = {
        COMMON: { min: 1, max: 2, types: ['PASSIVE', 'ENTER_BATTLEFIELD'] },
        RARE: { min: 2, max: 3, types: ['PASSIVE', 'ENTER_BATTLEFIELD', 'ATTACK_TRIGGER'] },
        EPIC: { min: 3, max: 4, types: ['ENTER_BATTLEFIELD', 'ATTACK_TRIGGER', 'DEATH_TRIGGER'] },
        LEGENDARY: { min: 4, max: 5, types: ['ATTACK_TRIGGER', 'DEATH_TRIGGER', 'PASSIVE'] },
        MYTHIC: { min: 5, max: 6, types: ['ENTER_BATTLEFIELD', 'ATTACK_TRIGGER', 'DEATH_TRIGGER'] },
        GOD_TIER: { min: 6, max: 8, types: ['ENTER_BATTLEFIELD', 'ATTACK_TRIGGER', 'DEATH_TRIGGER'] }
      }[rarity];
    
      const elementEffects = {
        WHOLESOME: ['HEAL', 'BUFF'],
        TOXIC: ['DAMAGE', 'DEBUFF'],
        DANK: ['DAMAGE', 'DRAW'],
        CURSED: ['DEBUFF', 'DAMAGE']
      }[element] as EffectType[];
    
      const abilityType = powerScale.types[Math.floor(Math.random() * powerScale.types.length)] as AbilityType;
      const effectType = elementEffects[Math.floor(Math.random() * elementEffects.length)];
      const value = Math.floor(Math.random() * (powerScale.max - powerScale.min + 1)) + powerScale.min;
      const limitation = this.generateLimitation(rarity, value);
    
      const prompt = `Create a meme-themed ability name for a ${rarity} ${element} card with ${abilityType} type effect.
        The ability does ${effectType} ${value} to target.
        Keep it short and reference internet culture.
        Format: Name: [2-3 words only]`;
    
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a meme card ability name generator." },
          { role: "user", content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.7
      });
    
      ability = {
        name: response.choices[0]?.message?.content?.replace('Name: ', '').trim() || "Mystery Ability",
        type: abilityType,
        effect: {
          type: effectType,
          value,
          target: this.getAbilityTarget(effectType)
        },
        limitation
      };
      
      attempts++;
    } while (!this.validateAbilityBalance(ability, rarity) && attempts < 3);

    // If we still couldn't generate a balanced ability, force the values to be valid
    if (!this.validateAbilityBalance(ability, rarity)) {
      const maxValues = {
        DAMAGE: { COMMON: 2, RARE: 3, EPIC: 4, LEGENDARY: 5, MYTHIC: 6, GOD_TIER: 8 },
        HEAL: { COMMON: 3, RARE: 4, EPIC: 5, LEGENDARY: 6, MYTHIC: 7, GOD_TIER: 9 },
        BUFF: { COMMON: 2, RARE: 3, EPIC: 4, LEGENDARY: 5, MYTHIC: 6, GOD_TIER: 7 },
        DEBUFF: { COMMON: 2, RARE: 3, EPIC: 4, LEGENDARY: 5, MYTHIC: 6, GOD_TIER: 7 },
        DRAW: { COMMON: 1, RARE: 1, EPIC: 2, LEGENDARY: 2, MYTHIC: 3, GOD_TIER: 3 }
      };
      
      ability.effect.value = maxValues[ability.effect.type][rarity];
    }

    return ability;
  }
  
  private generateLimitation(rarity: RarityType, value: number): string {
    const limitations = {
      COMMON: 'once per turn',
      RARE: 'once per turn',
      EPIC: value > 4 ? 'once per turn' : 'costs 1 mana',
      LEGENDARY: 'costs 2 mana',
      MYTHIC: 'once per game',
      GOD_TIER: 'once per game & costs 4 mana'
    };
    return limitations[rarity];
  }
  
  private getAbilityTarget(effectType: EffectType): string {
    const targets = {
      DAMAGE: 'opponent or their card',
      HEAL: 'your cards or yourself',
      BUFF: 'your cards',
      DEBUFF: 'opponent\'s cards',
      DRAW: 'you'
    };
    return targets[effectType];
  }
  
  private formatAbilityDescription(ability: StructuredAbility): string {
    return `${ability.type}: ${ability.effect.type} ${ability.effect.value} to ${ability.effect.target}. ${ability.limitation}.`;
  }

  private validateAbilityBalance(ability: StructuredAbility, rarity: RarityType): boolean {
    const maxValues = {
      DAMAGE: { COMMON: 2, RARE: 3, EPIC: 4, LEGENDARY: 5, MYTHIC: 6, GOD_TIER: 8 },
      HEAL: { COMMON: 3, RARE: 4, EPIC: 5, LEGENDARY: 6, MYTHIC: 7, GOD_TIER: 9 },
      BUFF: { COMMON: 2, RARE: 3, EPIC: 4, LEGENDARY: 5, MYTHIC: 6, GOD_TIER: 7 },
      DEBUFF: { COMMON: 2, RARE: 3, EPIC: 4, LEGENDARY: 5, MYTHIC: 6, GOD_TIER: 7 },
      DRAW: { COMMON: 1, RARE: 1, EPIC: 2, LEGENDARY: 2, MYTHIC: 3, GOD_TIER: 3 }
    };
  
    return ability.effect.value <= maxValues[ability.effect.type][rarity];
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

      if (typeof output === 'string') {
        if (output.startsWith('http') || output.startsWith('data:')) {
          return output;
        }
        try {
          const base64Test = Buffer.from(output, 'base64').toString('base64');
          if (base64Test) {
            return `data:image/png;base64,${output}`;
          }
        } catch {
          // Not valid base64, fall through to default
        }
      }

      if (Array.isArray(output) && output.length > 0 && typeof output[0] === 'string') {
        if (output[0].startsWith('http') || output[0].startsWith('data:')) {
          return output[0];
        }
        try {
          return `data:image/png;base64,${output[0]}`;
        } catch {
          // Not valid base64, fall through to default
        }
      }

      if (typeof output === 'object' && output !== null && 'url' in output) {
        return output.url;
      }

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
        model: "gpt-3.5-turbo",messages: [
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

  private generateStats(element: ElementType, rarity: RarityType): { attack: number; defense: number; cost: number } {
    const statPoints = {
      COMMON: 8,
      RARE: 10,
      EPIC: 12,
      LEGENDARY: 14,
      MYTHIC: 16,
      GOD_TIER: 18
    }[rarity];
  
    const elementBias = {
      WHOLESOME: { attack: 0.3, defense: 0.7 },
      TOXIC: { attack: 0.6, defense: 0.4 },
      DANK: { attack: 0.7, defense: 0.3 },
      CURSED: { attack: 0.5, defense: 0.5 }
    }[element];
  
    // Base stats with element bias
    const baseAttack = Math.ceil(statPoints * elementBias.attack);
    const baseDefense = Math.ceil(statPoints * elementBias.defense);
  
    // Add small random variation but maintain total power level
    const variation = Math.floor(Math.random() * 3) - 1;
    const attack = Math.max(1, baseAttack + variation);
    const defense = Math.max(1, baseDefense - variation);
  
    // Cost calculation based on total power and rarity
    const powerLevel = attack + defense;
    const cost = Math.max(1, Math.min(10, Math.ceil(powerLevel / 3)));
  
    return { attack, defense, cost };
  }

  private getWeightedRarity(): RarityType {
    const weights = {
      COMMON: 70,     // 70% chance
      RARE: 20,       // 20% chance
      EPIC: 7,       // 7% chance
      LEGENDARY: 2.89,   // 2.89% chance
      MYTHIC: 0.1,    // 0.1% chance
      GOD_TIER: 0.01   // 0.01% chance
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
      const stats = this.generateStats(element, rarity);
      
      // Get full structured ability
      const ability = await this.generateAbility(element, rarity);
      
      const image_path = await this.generateImage(element, rarity, name);
      const flavor_text = await this.generateFlavorText(name, element);

      return {
        name,
        stats: {
          ...stats,
          element,
          rarity,
          ability_name: ability.name,
          ability_description: ability.description,
          ability_type: ability.type,
          effect: ability.effect,
          limitation: ability.limitation
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