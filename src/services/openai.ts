import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development - move to backend in production
});

export interface QuizGenerationParams {
  topic: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  focusAreas: string;
  numberOfQuestions: number;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
}

export async function generateQuizQuestions(
  params: QuizGenerationParams
): Promise<GeneratedQuestion[]> {
  const { topic, level, focusAreas, numberOfQuestions } = params;

  const prompt = `Generate ${numberOfQuestions} multiple-choice quiz questions about "${topic}" at ${level} level.

Focus areas: ${focusAreas}

Requirements:
- Each question should have exactly 4 options
- Mark which option is correct (0-3 index)
- Provide a brief explanation for the correct answer
- Questions should be clear and educational
- Difficulty should match ${level} level

Return the response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": 0,
    "explanation": "Explanation of why this is correct"
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text or markdown formatting.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator creating high-quality quiz questions. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Clean up response - remove markdown code blocks if present
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\n?/g, '');
    }

    const questions = JSON.parse(cleanedContent);

    // Validate response structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid response format from OpenAI');
    }

    return questions;
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
}

export async function generateLessonContent(
  topic: string,
  level: string,
  specificFocus: string
): Promise<string> {
  const prompt = `Create educational content about "${topic}" at ${level} level.

Specific focus: ${specificFocus}

Please create:
1. A comprehensive explanation (300-500 words)
2. Key concepts and definitions
3. Practical examples
4. Summary of main takeaways

Format the content in a clear, educational manner suitable for learning.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator creating clear, engaging educational content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}
