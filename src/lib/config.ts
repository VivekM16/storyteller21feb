interface Config {
  openaiApiKey: string;
}

export function getConfig(): Config {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please check your .env file and ensure VITE_OPENAI_API_KEY is set.');
  }

  return {
    openaiApiKey: apiKey,
  };
}

// Validate config on app initialization
export function validateConfig(): boolean {
  try {
    getConfig();
    return true;
  } catch (error) {
    console.error('Configuration error:', error);
    return false;
  }
}