import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert social media ghostwriter. Generate exactly 3 highly engaging, distinct tweets based on the user topic. Separate each tweet with a unique delimiter string like "|||". Ensure each tweet stays strictly under 280 characters, uses strong hooks, clean formatting, and relevant hashtags.'
        },
        {
          role: 'user',
          content: `Write 5 tweets about: ${topic}`
        }
      ],
      temperature: 0.8,
    });

    const aiText = response.choices.message.content;
    const tweetsArray = aiText.split('|||').map(tweet => tweet.trim()).filter(Boolean);

    return NextResponse.json({ tweets: tweetsArray });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to communicate with OpenAI API.' }, 
      { status: 500 }
    );
  }
}
