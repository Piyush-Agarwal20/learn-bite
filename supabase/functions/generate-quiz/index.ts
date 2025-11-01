// Follow this setup guide: https://supabase.com/docs/guides/functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QuizGenerationParams {
  topic: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  focusAreas: string
  numberOfQuestions: number
}

interface GeneratedQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    // Verify authentication - check for Authorization header
    const authHeader = req.headers.get('Authorization')
    console.log('Auth header present:', !!authHeader)

    if (!authHeader) {
      throw new Error('No authorization header provided')
    }

    // Create Supabase client with auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    console.log('User auth result:', { user: !!user, error: userError?.message })

    if (userError) {
      throw new Error(`Authentication failed: ${userError.message}`)
    }

    if (!user) {
      throw new Error('User not authenticated - please log in again')
    }

    console.log('User authenticated:', user.id)

    // Parse request body
    const params: QuizGenerationParams = await req.json()
    const { topic, level, focusAreas, numberOfQuestions } = params

    console.log('Received params:', { topic, level, focusAreas, numberOfQuestions })

    // Validate input (focusAreas is optional)
    if (!topic || !level || !numberOfQuestions) {
      throw new Error('Missing required parameters: topic, level, or numberOfQuestions')
    }

    // Create prompt for OpenAI
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

IMPORTANT: Return ONLY the JSON array, no additional text or markdown formatting.`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert educator creating high-quality quiz questions. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${error}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Clean up response - remove markdown code blocks if present
    let cleanedContent = content.trim()
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\n?/g, '')
    }

    const questions: GeneratedQuestion[] = JSON.parse(cleanedContent)

    // Validate response structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid response format from OpenAI')
    }

    // Return the generated questions
    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
