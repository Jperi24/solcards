import OpenAI from 'openai';
import Replicate from 'replicate';
import type { Card, ElementType, RarityType } from '@/app/types/cards';

type AbilityType = 'ENTER_BATTLEFIELD' | 'ATTACK_TRIGGER' | 'DEATH_TRIGGER' | 'PASSIVE' | 'ACTIVATED';
type EffectType = 'DAMAGE' | 'HEAL' | 'BUFF' | 'DEBUFF' | 'DRAW' | 'COPY' | 'TRANSFORM' | 'SUMMON' | 'BOUNCE' | 'MILL';
type Target = 'SELF' | 'OPPONENT' | 'ALL_CARDS' | 'OWN_CARDS' | 'OPPONENT_CARDS' | 'RANDOM_CARD' | 'CHOSEN_CARD';
type Condition = 'NONE' | 'HP_BELOW_50' | 'HAND_EMPTY' | 'BOARD_FULL' | 'ELEMENT_MATCH' | 'COMBO';

// First, define our effect template types
type EffectTemplate = 
  | { type: 'DAMAGE'; target: Target }
  | { type: 'HEAL'; target: Target }
  | { type: 'BUFF'; metadata: { stat: 'ATTACK' | 'DEFENSE' | 'BOTH'; duration: number }; target?: Target }
  | { type: 'DEBUFF'; metadata: { stat: 'ATTACK' | 'DEFENSE' | 'BOTH'; duration: number }; target?: Target }
  | { type: 'DRAW' };

interface ElementSynergyConfig {
  primaryEffects: EffectTemplate[];
  synergies: EffectTemplate[];
  conditions: Condition[];
}

// Add after your existing type definitions
interface StatEffect {
  stat: 'ATTACK' | 'DEFENSE' | 'BOTH';
  value: number;
  duration: number; // Number of turns
}

// Add to your AbilityEffect interface
interface AbilityEffect {
  type: EffectType;
  value: number;
  target: Target;
  duration?: number;
  condition?: Condition;
  metadata?: {
    stat?: 'ATTACK' | 'DEFENSE' | 'BOTH';
    duration?: number;
  };
}

interface AbilityEffect {
  type: EffectType;
  value: number;
  target: Target;
  duration?: number;
  condition?: Condition;
}

interface StructuredAbility {
  name: string;
  type: AbilityType;
  effects: AbilityEffect[];
  cost?: number;
  cooldown?: number;
  limitation: string;
  combo?: string;
}

export class MemeCardGenerator {
  private openai: OpenAI;
  private replicate: Replicate;
  private readonly REPLICATE_MODEL_VERSION = "8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f";
  private readonly elements: ElementType[] = ['WHOLESOME', 'TOXIC', 'DANK', 'CURSED'];
  private readonly rarities: RarityType[] = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'GOD_TIER'];



private readonly ELEMENT_SYNERGIES: Record<ElementType, ElementSynergyConfig> = {
    WHOLESOME: {
      primaryEffects: [
        { type: 'HEAL', target: 'SELF' },
        { type: 'BUFF', metadata: { stat: 'DEFENSE', duration: 2 }, target: 'OWN_CARDS' }
      ],
      synergies: [
        { type: 'DRAW' },
        { type: 'BUFF', metadata: { stat: 'BOTH', duration: 1 }, target: 'OWN_CARDS' }
      ],
      conditions: ['HP_BELOW_50', 'ELEMENT_MATCH']
    },
    TOXIC: {
      primaryEffects: [
        { type: 'DAMAGE', target: 'OPPONENT' },
        { type: 'DEBUFF', metadata: { stat: 'ATTACK', duration: 2 }, target: 'OPPONENT_CARDS' }
      ],
      synergies: [
        { type: 'DEBUFF', metadata: { stat: 'BOTH', duration: 1 }, target: 'OPPONENT_CARDS' },
        { type: 'DAMAGE', target: 'OPPONENT_CARDS' }
      ],
      conditions: ['BOARD_FULL', 'COMBO']
    },
    DANK: {
      primaryEffects: [
        { type: 'DAMAGE', target: 'OPPONENT' },
        { type: 'BUFF', metadata: { stat: 'ATTACK', duration: 1 }, target: 'OWN_CARDS' }
      ],
      synergies: [
        { type: 'DRAW' },
        { type: 'DAMAGE', target: 'OPPONENT_CARDS' }
      ],
      conditions: ['HAND_EMPTY', 'COMBO']
    },
    CURSED: {
      primaryEffects: [
        { type: 'DEBUFF', metadata: { stat: 'BOTH', duration: 2 }, target: 'OPPONENT_CARDS' },
        { type: 'DAMAGE', target: 'OPPONENT' }
      ],
      synergies: [
        { type: 'DEBUFF', metadata: { stat: 'DEFENSE', duration: 2 }, target: 'OPPONENT_CARDS' },
        { type: 'DAMAGE', target: 'OPPONENT_CARDS' }
      ],
      conditions: ['ELEMENT_MATCH', 'HP_BELOW_50']
    }
  } as const;



  private readonly IMAGE_MODELS = {
    BASIC: {
      model: "stability-ai/sdxl",
      version: "a00d0b7dcbb9c3fbb34ba87d2d5b46c56969c84a628bf778a7fdaec30b1b99c5",
      config: {
        width: 768,
        height: 768,
        num_inference_steps: 25,
        guidance_scale: 7.5
      }
    },
    ENHANCED: {
      model: "stability-ai/sdxl",  // Using SDXL with better settings for enhanced
      version: "a00d0b7dcbb9c3fbb34ba87d2d5b46c56969c84a628bf778a7fdaec30b1b99c5",
      config: {
        width: 1024,
        height: 1024,
        num_inference_steps: 40,
        guidance_scale: 8.5,
        negative_prompt: "blurry, low quality, text, watermark"
      }
    },
    PREMIUM: {
      model: "stability-ai/stable-diffusion-xl-base-1.0",
      version: "7ccae3a26a62f5a6c89fb3184793d8df5c6ecd9b20def186d508c69d6232502b",
      config: {
        width: 1024,
        height: 1024,
        num_inference_steps: 50,
        guidance_scale: 9.0,
        negative_prompt: "blurry, low quality, text, watermark, simple",
        scheduler: "K_EULER"
      }
    },
    DIVINE: {
      model: "stability-ai/sdxl-base-1.0",
      version: "7ccae3a26a62f5a6c89fb3184793d8df5c6ecd9b20def186d508c69d6232502b",
      config: {
        width: 1536,
        height: 1536,
        num_inference_steps: 75,
        guidance_scale: 12.0,
        negative_prompt: "blurry, low quality, text, watermark, simple, basic",
        scheduler: "DPMSolverMultistep",
        num_outputs: 1
      }
    }
  } as const;

  private readonly ABILITY_CONFIGS: Record<RarityType, {
    maxEffects: number;
    maxValue: number;
    allowedTypes: AbilityType[];
    allowedEffects: EffectType[];  // Updated to include all effect types
    allowedTargets: Target[];
    costRange: { min: number; max: number };
  }> = {
    COMMON: {
      maxEffects: 1,
      maxValue: 2,
      allowedTypes: ['ENTER_BATTLEFIELD', 'PASSIVE'],
      allowedEffects: ['DAMAGE', 'HEAL', 'BUFF', 'DEBUFF', 'DRAW'],
      allowedTargets: ['SELF', 'OPPONENT', 'OWN_CARDS', 'OPPONENT_CARDS'],
      costRange: { min: 1, max: 2 }
    },
    RARE: {
      maxEffects: 2,
      maxValue: 3,
      allowedTypes: ['ENTER_BATTLEFIELD', 'PASSIVE', 'ATTACK_TRIGGER'],
      allowedEffects: ['DAMAGE', 'HEAL', 'BUFF', 'DEBUFF', 'DRAW'],
      allowedTargets: ['SELF', 'OPPONENT', 'OWN_CARDS', 'OPPONENT_CARDS', 'RANDOM_CARD'],
      costRange: { min: 2, max: 3 }
    },
    EPIC: {
      maxEffects: 2,
      maxValue: 4,
      allowedTypes: ['ENTER_BATTLEFIELD', 'ATTACK_TRIGGER', 'DEATH_TRIGGER', 'PASSIVE'],
      allowedEffects: ['DAMAGE', 'HEAL', 'BUFF', 'DEBUFF', 'DRAW'],
      allowedTargets: ['SELF', 'OPPONENT', 'ALL_CARDS', 'OWN_CARDS', 'OPPONENT_CARDS', 'CHOSEN_CARD'],
      costRange: { min: 2, max: 4 }
    },
    LEGENDARY: {
      maxEffects: 3,
      maxValue: 5,
      allowedTypes: ['ENTER_BATTLEFIELD', 'ATTACK_TRIGGER', 'DEATH_TRIGGER', 'PASSIVE'],
      allowedEffects: ['DAMAGE', 'HEAL', 'BUFF', 'DEBUFF', 'DRAW'],
      allowedTargets: ['SELF', 'OPPONENT', 'ALL_CARDS', 'OWN_CARDS', 'OPPONENT_CARDS', 'CHOSEN_CARD'],
      costRange: { min: 3, max: 5 }
    },
    MYTHIC: {
      maxEffects: 3,
      maxValue: 6,
      allowedTypes: ['ENTER_BATTLEFIELD', 'ATTACK_TRIGGER', 'DEATH_TRIGGER', 'PASSIVE'],
      allowedEffects: ['DAMAGE', 'HEAL', 'BUFF', 'DEBUFF', 'DRAW'],
      allowedTargets: ['SELF', 'OPPONENT', 'ALL_CARDS', 'OWN_CARDS', 'OPPONENT_CARDS', 'CHOSEN_CARD'],
      costRange: { min: 4, max: 6 }
    },
    GOD_TIER: {
      maxEffects: 4,
      maxValue: 8,
      allowedTypes: ['ENTER_BATTLEFIELD', 'ATTACK_TRIGGER', 'DEATH_TRIGGER', 'PASSIVE'],
      allowedEffects: ['DAMAGE', 'HEAL', 'BUFF', 'DEBUFF', 'DRAW'],
      allowedTargets: ['SELF', 'OPPONENT', 'ALL_CARDS', 'OWN_CARDS', 'OPPONENT_CARDS', 'CHOSEN_CARD'],
      costRange: { min: 5, max: 8 }
    }
  } as const;

  constructor(openaiApiKey: string, replicateApiKey: string) {
    if (!openaiApiKey) throw new Error('OpenAI API key is required');
    if (!replicateApiKey) throw new Error('Replicate API key is required');

    this.openai = new OpenAI({ apiKey: openaiApiKey });
    this.replicate = new Replicate({ auth: replicateApiKey });
  }

  // Keep existing connection test method
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

  // Keep existing card name generation method
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

  private async generateAbility(element: ElementType, rarity: RarityType): Promise<StructuredAbility> {
    const config = this.ABILITY_CONFIGS[rarity];
    const elementConfig = this.ELEMENT_SYNERGIES[element];
    
    // Determine number of effects based on rarity
    const numEffects = Math.floor(Math.random() * config.maxEffects) + 1;
    
    // Helper function to get a random target
    const getRandomTarget = (): Target => {
      return config.allowedTargets[Math.floor(Math.random() * config.allowedTargets.length)];
    };

    // Helper function to check if effect is allowed
    const isEffectAllowed = (effectType: EffectType): boolean => {
      return config.allowedEffects.includes(effectType as any);
    };
    
    // Generate primary effect
    const primaryEffectTemplate = elementConfig.primaryEffects[
      Math.floor(Math.random() * elementConfig.primaryEffects.length)
    ];
    
    const effects: AbilityEffect[] = [{
      type: primaryEffectTemplate.type,
      value: Math.floor(Math.random() * config.maxValue) + 1,
      target: ('target' in primaryEffectTemplate && primaryEffectTemplate.target) 
        ? primaryEffectTemplate.target 
        : getRandomTarget(),
      condition: elementConfig.conditions[Math.floor(Math.random() * elementConfig.conditions.length)],
      metadata: 'metadata' in primaryEffectTemplate ? primaryEffectTemplate.metadata : undefined
    }];
    
    // Add additional effects if allowed
    for (let i = 1; i < numEffects; i++) {
      const synergyTemplate = elementConfig.synergies[
        Math.floor(Math.random() * elementConfig.synergies.length)
      ];
      
      if (isEffectAllowed(synergyTemplate.type)) {
        effects.push({
          type: synergyTemplate.type,
          value: Math.floor(Math.random() * (config.maxValue - 1)) + 1,
          target: ('target' in synergyTemplate && synergyTemplate.target) 
            ? synergyTemplate.target 
            : getRandomTarget(),
          metadata: 'metadata' in synergyTemplate ? synergyTemplate.metadata : undefined
        });
      }
    }
    
    // Rest of the function remains the same...
    
    // Calculate appropriate cost and cooldown
    const totalPower = effects.reduce((sum, effect) => sum + effect.value, 0);
    const cost = Math.max(
      config.costRange.min,
      Math.min(config.costRange.max, Math.ceil(totalPower / 2))
    );
    
    const abilityType = config.allowedTypes[Math.floor(Math.random() * config.allowedTypes.length)] as AbilityType;
    
    const ability: StructuredAbility = {
      name: await this.generateAbilityName(effects, element),
      type: abilityType,
      effects,
      cost,
      limitation: this.generateLimitation(rarity, totalPower)
    };
    
    // Add cooldown for activated abilities
    if (ability.type === 'ACTIVATED') {
      ability.cooldown = Math.ceil(totalPower / 3);
    }
    
    return ability;
}

  private async generateAbilityName(effects: AbilityEffect[], element: ElementType): Promise<string> {
    try {
      const effectTypes = effects.map(e => e.type.toLowerCase()).join(' and ');
      const prompt = `Create a meme-themed ability name that combines ${effectTypes} 
        for a ${element.toLowerCase()} card. Make it funny and reference internet culture. 
        Keep it under 4 words. Just return the name, no explanation.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a creative meme ability name generator." },
          { role: "user", content: prompt }
        ],
        max_tokens: 20,
        temperature: 0.8
      });

      return response.choices[0]?.message?.content?.trim() || "Mystery Ability";
    } catch (error) {
      console.error('Error generating ability name:', error);
      return `${element} Power`;
    }
  }

  private formatAbilityDescription(ability: StructuredAbility): string {
    const parts: string[] = [];
    
    // Add type and cost if present
    let triggerDesc = '';
    switch(ability.type) {
      case 'ENTER_BATTLEFIELD':
        triggerDesc = 'When this card enters the battlefield';
        break;
      case 'ATTACK_TRIGGER':
        triggerDesc = 'When this card attacks';
        break;
      case 'DEATH_TRIGGER':
        triggerDesc = 'When this card is destroyed';
        break;
      case 'PASSIVE':
        triggerDesc = 'Passive effect';
        break;
    }
    
    parts.push(`${triggerDesc}${ability.cost ? ` (Cost: ${ability.cost} mana)` : ''}`);
    
    // Add each effect with explicit descriptions
    ability.effects.forEach((effect) => {
      let effectDesc = '';
      
      switch(effect.type) {
        case 'DAMAGE':
          effectDesc = `Deal ${effect.value} damage to ${this.formatTarget(effect.target)}`;
          break;
        case 'HEAL':
          effectDesc = `Restore ${effect.value} HP to ${this.formatTarget(effect.target)}`;
          break;
        case 'BUFF':
          const buffStat = effect.metadata?.stat || 'BOTH';
          const buffDuration = effect.metadata?.duration || 1;
          effectDesc = `Increase ${this.formatTarget(effect.target)}'s ${this.formatStat(buffStat)} by ${effect.value} for ${buffDuration} turn${buffDuration > 1 ? 's' : ''}`;
          break;
        case 'DEBUFF':
          const debuffStat = effect.metadata?.stat || 'BOTH';
          const debuffDuration = effect.metadata?.duration || 1;
          effectDesc = `Reduce ${this.formatTarget(effect.target)}'s ${this.formatStat(debuffStat)} by ${effect.value} for ${debuffDuration} turn${debuffDuration > 1 ? 's' : ''}`;
          break;
        case 'DRAW':
          effectDesc = `Draw ${effect.value} card${effect.value > 1 ? 's' : ''}`;
          break;
      }
      
      if (effect.condition) {
        effectDesc += ` when ${this.formatCondition(effect.condition)}`;
      }
      
      parts.push(effectDesc);
    });
    
    // Add limitation and cooldown
    if (ability.cooldown) {
      parts.push(`Cooldown: ${ability.cooldown} turns`);
    }
    parts.push(ability.limitation);
    
    return parts.join('. ');
  }

  private formatTarget(target: Target): string {
    const targetDescriptions: Record<Target, string> = {
      'SELF': 'your hero',
      'OPPONENT': 'the enemy hero',
      'ALL_CARDS': 'all cards',
      'OWN_CARDS': 'your cards',
      'OPPONENT_CARDS': 'enemy cards',
      'RANDOM_CARD': 'a random card',
      'CHOSEN_CARD': 'target card'
    };
    return targetDescriptions[target];
  }

  private formatStat(stat: string): string {
    switch(stat) {
      case 'ATTACK':
        return 'Attack';
      case 'DEFENSE':
        return 'Defense';
      case 'BOTH':
        return 'Attack and Defense';
      default:
        return stat;
    }
  }

  private formatCondition(condition: Condition): string {
    const conditions: Record<Condition, string> = {
      'NONE': '',
      'HP_BELOW_50': 'HP is below 50%',
      'HAND_EMPTY': 'hand is empty',
      'BOARD_FULL': 'board is full',
      'ELEMENT_MATCH': 'another card of same element is played',
      'COMBO': 'used after another ability'
    };
    return conditions[condition];
  }

  private generateLimitation(rarity: RarityType, totalPower: number): string {
    const limitations: Record<RarityType, string[]> = {
      COMMON: ['once per turn'],
      RARE: ['once per turn', 'costs 1 mana'],
      EPIC: ['once per turn', 'costs 2 mana'],
      LEGENDARY: ['costs 2 mana', 'twice per game'],
      MYTHIC: ['once per game', 'costs 3 mana'],
      GOD_TIER: ['once per game & costs 4 mana']
    };

    const possibleLimitations = limitations[rarity];
    return possibleLimitations[Math.floor(Math.random() * possibleLimitations.length)];
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

  // Keep existing methods for image generation, flavor text, etc.
  private async generateImage(element: ElementType, rarity: RarityType, name: string): Promise<string> {
    const basePrompt = await this.generateImagePrompt(element, rarity, name);
      console.log('Generated base prompt:', basePrompt);
  
    try {
      
      // Select model based on rarity
      let modelConfig;
      switch(rarity) {
        case 'GOD_TIER':
          modelConfig = this.IMAGE_MODELS.DIVINE;
          break;
        case 'MYTHIC':
        case 'LEGENDARY':
          modelConfig = this.IMAGE_MODELS.PREMIUM;
          break;
        case 'EPIC':
        case 'RARE':
          modelConfig = this.IMAGE_MODELS.ENHANCED;
          break;
        default:
          modelConfig = this.IMAGE_MODELS.BASIC;
      }
  
      const enhancedPrompt = this.enhancePromptForRarity(basePrompt, rarity);
      const negativePrompt = this.getNegativePromptForRarity(rarity);
  
      console.log(`Using ${modelConfig.model} for ${rarity} card`);
      console.log('Enhanced prompt:', enhancedPrompt);
  
      const output = await this.replicate.run(
        `${modelConfig.model}:${modelConfig.version}`,
        {
          input: {
            prompt: enhancedPrompt,
            negative_prompt: negativePrompt,
            ...modelConfig.config
          }
        }
      ) as string | ReadableStream<any> | string[] | { url: string };

        console.log("This is the output", output);
        console.log("Type of output:", typeof output);

          // Check for specific cases
          if (output instanceof ReadableStream) {
            console.log("Output is a ReadableStream");
          } else if (Array.isArray(output)) {
            console.log("Output is an array:", output);
          } else if (typeof output === 'object' && output !== null && 'url' in output) {
            console.log("Output is an object with a URL:", output.url);
          } else if (typeof output === 'string') {
            console.log("Output is a string:", output);
          } else {
            console.log("Unknown output type:", output);
          }


      return await this.processModelOutput(output);
    } catch (error) {
      console.error('Error generating image:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);
      
      // Fallback to a simpler model if the premium one fails
      if (rarity !== 'COMMON') {
        console.log('Attempting fallback to basic model...');
        try {
          const basicConfig = this.IMAGE_MODELS.BASIC;
          const fallbackPrompt = this.enhancePromptForRarity(basePrompt, 'COMMON');
          const fallbackNegative = this.getNegativePromptForRarity('COMMON');
          
          const output = await this.replicate.run(
            `${basicConfig.model}:${basicConfig.version}`,
            {
              input: {
                prompt: fallbackPrompt,
                negative_prompt: fallbackNegative,
                ...basicConfig.config
              }
            }
          ) as string | ReadableStream<any> | string[] | { url: string };
          
          return await this.processModelOutput(output);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
      console.log("Could NOT GENERATE IMAGEEEEE")
      return '/api/placeholder/400/400';
    }
  }
  
  private enhancePromptForRarity(basePrompt: string, rarity: RarityType): string {
    const qualities = {
      COMMON: "trading card game art, digital illustration",
      RARE: "detailed digital artwork, vibrant colors",
      EPIC: "epic fantasy art, highly detailed, dramatic lighting",
      LEGENDARY: "masterful digital artwork, ultra detailed, cinematic quality",
      MYTHIC: "ethereal masterpiece, photorealistic, extraordinary detail",
      GOD_TIER: "divine masterpiece, hyperrealistic, celestial quality"
    };
  
    const style = ", perfect composition, centered, card game art style";
    return `${basePrompt}, ${qualities[rarity]}${style}, trending on artstation, award winning digital art`;
  }
  
  private getNegativePromptForRarity(rarity: RarityType): string {
    const baseNegative = "blur, noise, text, watermark, signature, low quality, deformed";
    
    if (rarity === 'GOD_TIER' || rarity === 'MYTHIC' || rarity === 'LEGENDARY') {
      return `${baseNegative}, simple, basic, amateur, cartoon`;
    }
    
    return baseNegative;
  }

  private isReadableStream(value: unknown): value is ReadableStream {
    return value instanceof Object && typeof (value as ReadableStream).getReader === 'function';
  }
  
  private async processModelOutput(output: string | ReadableStream | string[] | { url: string }): Promise<string> {
    try {
      // Handle arrays
      if (Array.isArray(output) && output.length > 0) {
        const firstOutput = output[0];
        if (this.isReadableStream(firstOutput)) {
          console.log("Processing first element of array as a ReadableStream...");
          return await this.processReadableStream(firstOutput);
        } else if (typeof firstOutput === 'string') {
          console.log("Processing first element of array as a string:", firstOutput);
          if (firstOutput.startsWith('http') || firstOutput.startsWith('data:')) {
            return firstOutput;
          }
          try {
            return `data:image/png;base64,${firstOutput}`;
          } catch {
            return '/api/placeholder/400/400';
          }
        }
      }
  
      // Handle single ReadableStream
      if (this.isReadableStream(output)) {
        console.log("Processing output as a ReadableStream...");
        return await this.processReadableStream(output);
      }
  
      // Handle strings
      if (typeof output === 'string') {
        if (output.startsWith('http') || output.startsWith('data:')) {
          return output;
        }
        try {
          return `data:image/png;base64,${output}`;
        } catch {
          return '/api/placeholder/400/400';
        }
      }
  
      // Handle objects with URL
      if (typeof output === 'object' && output !== null && 'url' in output) {
        return output.url;
      }
  
      return '/api/placeholder/400/400';
    } catch (error) {
      console.error('Error processing model output:', error);
      return '/api/placeholder/400/400';
    }
  }
  
  
  // Helper method to process a ReadableStream
  private async processReadableStream(stream: ReadableStream): Promise<string> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
      }
    }
    
    const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      concatenated.set(chunk, offset);
      offset += chunk.length;
    }
  
    return `data:image/png;base64,${Buffer.from(concatenated).toString('base64')}`;
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

  public async generateCard(): Promise<Card> {
    try {
      const rarity = this.getWeightedRarity();
      const element = this.getElementForRarity(rarity);
      const name = await this.generateCardName(element, rarity);
      const stats = this.generateStats(element, rarity);
      const ability = await this.generateAbility(element, rarity);
      const image_path = await this.generateImage(element, rarity, name);
      const flavor_text = await this.generateFlavorText(name, element);
  
      // Take the first effect as the primary effect for backwards compatibility
      const primaryEffect = ability.effects[0];
  
      return {
        name,
        stats: {
          ...stats,
          element,
          rarity,
          ability_name: ability.name,
          ability_description: this.formatAbilityDescription(ability),
          ability_type: ability.type,
          effect: primaryEffect, // Set the primary effect for backward compatibility
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

  private getWeightedRarity(): RarityType {
    const weights = {
      COMMON: 70,     // 70% chance
      RARE: 20,       // 20% chance
      EPIC: 7,        // 7% chance
      LEGENDARY: 2.89, // 2.89% chance
      MYTHIC: 0.1,    // 0.1% chance
      GOD_TIER: 0.01  // 0.01% chance
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
}