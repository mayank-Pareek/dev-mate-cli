import OpenAI from 'openai';

let aiConnection: OpenAI | null = null;

export const initializeConnection = () => {
  try {
    aiConnection = new OpenAI({
      baseURL: process.env.BASE_URL as string,
      apiKey: process.env.API_KEY as string,
    });
  } catch (error) {
    console.error('Error connecting to OpenAI:', error);
  }
};

const aiResponse = async (data: string) => {
  if (aiConnection)
    try {
      const completion = await aiConnection.chat.completions.create({
        model: 'google/gemma-2-9b-it:free',
        messages: [{ role: 'user', content: data }],
        temperature: 1.1,
      });
      console.log(completion.choices[0].message.content);
    } catch (error: any) {
      if (error.code === 400) {
        console.error(
          'Model abc is not available, choose another model or leave blank for default',
        );
      } else {
        console.error(error);
      }
    }
};

export default aiResponse;
