// app/api/generate-card/route.ts
import { NextResponse } from 'next/server';
import { MemeCardGenerator } from '@/app/lib/memeCardGenerator';

// Initialize with both API keys
const generator = new MemeCardGenerator(
  process.env.OPENAI_API_KEY || '',
  process.env.REPLICATE_API_KEY || ''
);

export async function POST(req: Request) {
  try {
    console.log('Starting card generation...');
    
    const { wallet_address } = await req.json();
    console.log('Wallet address:', wallet_address);
    
    // Generate the card
    const card = await generator.generateCard();
    console.log('Generated card:', {
      ...card,
      image_path: card.image_path ? 'Image URL exists' : 'No image URL'
    });
    
    return NextResponse.json({ 
      success: true, 
      card: card 
    });
    
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}