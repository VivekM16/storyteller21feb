import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_KEY
});

// Store usage statistics
let monthlyUsage = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
  estimatedCost: 0
};

// Cost per 1K tokens (in USD)
const COST_PER_1K_TOKENS = {
  prompt: 0.0015,
  completion: 0.002
};

function calculateCost(promptTokens, completionTokens) {
  const promptCost = (promptTokens / 1000) * COST_PER_1K_TOKENS.prompt;
  const completionCost = (completionTokens / 1000) * COST_PER_1K_TOKENS.completion;
  return promptCost + completionCost;
}

// Text-to-Speech endpoint
app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    // Get the audio data as a buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    
    // Send the audio data with appropriate headers
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
    });
    
    res.send(buffer);
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error.message
    });
  }
});

app.post('/api/generate-story', async (req, res) => {
  try {
    const { age, theme, writingStyle, characters, season, storyLength, customPreferences } = req.body;
    
    if (!age || !theme || !writingStyle || !characters || !season || !storyLength) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const prompt = `Create a ${storyLength} paragraphs children's story in the style of ${writingStyle} with the following parameters:

Target age group: ${age}
Theme: ${theme}
Main characters: ${characters}
Season/Setting: ${season}
Additional context: ${customPreferences || 'None provided'}

The story should:
- Be appropriate for children aged ${age}
- Include a clear beginning, middle, and end
- Incorporate the ${theme} theme throughout
- Feature ${characters} as main characters
- Set in the ${season} season
- Include any custom context naturally within the story
- End with a subtle moral or learning point
- Strictly use language & complexity appropriate for the age group. The title should be simple, intriguing, and spark curiosity while fitting the warm and imaginative tone of a bedtime story

Please write the story now that incorporates all of the above`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a creative children's story writer who specializes in creating engaging, age-appropriate stories."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4",
    });

    if (completion.usage) {
      monthlyUsage.promptTokens += completion.usage.prompt_tokens;
      monthlyUsage.completionTokens += completion.usage.completion_tokens;
      monthlyUsage.totalTokens += completion.usage.total_tokens;
      monthlyUsage.estimatedCost += calculateCost(
        completion.usage.prompt_tokens,
        completion.usage.completion_tokens
      );
    }

    const story = completion.choices[0].message.content;
    
    res.json({
      title: `The ${theme} Adventure`,
      content: story || 'Once upon a time...',
      usage: monthlyUsage
    });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message
    });
  }
});

app.get('/api/usage-stats', (req, res) => {
  res.json(monthlyUsage);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});