import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic text is missing.' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert social media ghostwriter. Generate exactly 5 highly engaging, distinct tweets based on the user topic. Separate each tweet with a unique delimiter string like "|||". Ensure each tweet stays strictly under 280 characters, uses strong hooks, clean formatting, and relevant hashtags.'
        },
        {
          role: 'user',
          content: `Write 5 tweets about: ${topic}`
        }
      ],
      temperature: 0.8,
    });

    // Check if the response object has the required array indexes intact
    if (!response?.choices?.[0]?.message) {
      console.error("Malformed OpenAI Response Structure:", response);
      return NextResponse.json({ error: 'OpenAI returned an empty or unreadable text package.' }, { status: 500 });
    }

    const aiText = response.choices[0].message.content || '';
    const tweetsArray = aiText.split('|||').map(tweet => tweet.trim()).filter(Boolean);

    return NextResponse.json({ tweets: tweetsArray });

  } catch (error) {
    console.error('Interceptive API Error Log:', error);
    
    // Safely parse out common account limits or incorrect setup states
    let customErrorMessage = 'Failed to communicate with OpenAI backend infrastructure.';
    if (error?.message) {
      customErrorMessage = error.message;
    }

    return NextResponse.json(
      { error: customErrorMessage }, 
      { status: 500 }
    );
  }
}
