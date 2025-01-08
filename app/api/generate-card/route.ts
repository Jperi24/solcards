// app/api/generate-card/route.ts
import { NextResponse } from 'next/server';
import { MemeCardGenerator } from '@/app/lib/memeCardGenerator';

export async function POST(request: Request) {
  try {
    console.log('Starting card generation...');
    
    const openaiKey = process.env.OPENAI_API_KEY;
    const replicateKey = process.env.REPLICATE_API_KEY;

    if (!openaiKey || !replicateKey) {
      return NextResponse.json(
        { error: 'Missing API keys' },
        { status: 500 }
      );
    }

    const generator = new MemeCardGenerator(openaiKey, replicateKey);
    
    // Test connections first
    const connections = await generator.testConnections();
    console.log('API connections status:', connections);

    if (!connections.openai || !connections.replicate) {
      return NextResponse.json(
        { error: 'API services not available' },
        { status: 503 }
      );
    }

    const card = await generator.generateCard();
    console.log('Generated card:', card);

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error generating card:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate card' },
      { status: 500 }
    );
  }
}