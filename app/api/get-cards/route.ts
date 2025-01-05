// app/api/generate-card/route.ts
import { NextResponse } from 'next/server';
import { MemeCardGenerator } from '@/app/lib/memeCardGenerator';

// Initialize the generator with your API keys
const generator = new MemeCardGenerator(
  process.env.OPENAI_API_KEY!,
  process.env.REPLICATE_API_KEY!
);

export async function POST(req: Request) {
  try {
    // Verify the request
    const { wallet_address } = await req.json();
    
    // Here you would verify SOL payment
    // Add your payment verification logic
    
    // Generate the card
    const card = await generator.generateCard();
    
    // Here you would mint the NFT
    // Add your NFT minting logic
    
    return NextResponse.json({ 
      success: true, 
      card: card 
    });
    
  } catch (error) {
    console.error('Error generating card:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}