import { NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "TEMPORARY_PRODUCTION_VAULT_HOLDER";


export async function POST(req) {
  try {
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Missing API Key configuration." }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });
    const { source, tone, formality } = await req.json();

    if (!source) {
      return NextResponse.json({ success: false, error: "Missing text payload parameters." }, { status: 400 });
    }

    const systemPrompt = `You are ExecutivePostStudio, an elite ghostwriter.
Convert the source text into three distinct brand-voiced variations:
- linkedin_long: A structured, multi-paragraph thought-leadership article.
- x_short: A single sharp tweet under 260 characters.
- x_thread: An array of 3 separate sequential sentences/tweets.

You must respond with a clean, raw JSON object string matching this exact structure:
{
  "linkedin_long": "text string...",
  "x_short": "text string...",
  "x_thread": ["tweet 1", "tweet 2", "tweet 3"]
}
CRITICAL: Do not include markdown code ticks, block quotes, or backticks like \`\`\`json. Respond with raw text braces only.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Material to distribute: "${source}"` }
      ],
      temperature: 0.7,
    });

    let rawOutput = completion.choices[0].message.content.trim();
    
    // Clean out backticks manually just in case the model returns them anyway
    if (rawOutput.startsWith("```")) {
      rawOutput = rawOutput.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsedData = JSON.parse(rawOutput);
    return NextResponse.json({ success: true, data: parsedData });

  } catch (error) {
    console.error("API ROUTE PIPELINE FAILURE:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
