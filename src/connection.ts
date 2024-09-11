import OpenAI from 'openai';

let aiConnection: OpenAI | null = null;
try {
  aiConnection = new OpenAI({
    baseURL: process.env.BASE_URL as string,
    apiKey: process.env.API_KEY as string,
  });
} catch (error) {
  console.error('Error connecting to OpenAI:', error);
}

export default aiConnection;
