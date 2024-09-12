import OpenAI from 'openai';
import program from './program';
import { processFile } from './utils/fileHandler';

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

const aiResponse = async (data: string): Promise<void> => {
  if (aiConnection)
    try {
      const completion = await aiConnection.chat.completions.create({
        model: program.opts().model,
        messages: [
          {
            role: 'system',
            content:
              'Return only the code with added comments, no explanations.',
          },
          { role: 'user', content: data },
        ],
        temperature: 1.1,
      });
      if (program.opts().output) {
        await processFile(
          program.opts().output,
          'write',
          completion.choices[0].message.content,
        );
        console.log(`Documented code written to ${program.opts().output}`);
      } else {
        console.log(completion.choices[0].message.content);
      }
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
