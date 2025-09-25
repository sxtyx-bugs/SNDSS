import OpenAI from "openai";

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function manipulateText(originalContent: string): Promise<string> {
  try {
    // If no API key is available, return original content
    if (!process.env.OPENAI_API_KEY || !openai) {
      console.log('No OpenAI API key provided, skipping text manipulation');
      return originalContent;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a text manipulation assistant. Your task is to make VERY SUBTLE changes to the provided text while keeping its core meaning intact. For code, make minor changes like:
- Renaming 1-2 variables to similar but different names
- Changing some string quotes from single to double or vice versa
- Adding or removing occasional comments
- Minor spacing adjustments
- Small wording changes in comments

For regular text, make minor changes like:
- Rephrase 1-2 sentences slightly
- Change some words to synonyms
- Minor grammatical adjustments
- Occasionally add small, harmless typos

Keep changes minimal and natural. Return only the modified content, no explanations.`
        },
        {
          role: "user",
          content: originalContent
        }
      ],
      max_tokens: 4000,
    });

    const manipulatedContent = response.choices[0].message.content;
    return manipulatedContent || originalContent;
  } catch (error) {
    console.error('Error manipulating text:', error);
    // Fall back to original content if AI manipulation fails
    return originalContent;
  }
}