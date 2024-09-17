import OpenAI from 'openai';
import program from './program';
import { processFile } from './utils/fileHandler';

let aiConnection: OpenAI | null = null;

//setup connection using api key and base url from .env
export const initializeConnection = () => {
  try {
    if (!(process.env.BASE_URL && process.env.API_KEY)) {
      throw new Error('Missing environment variable[s].');
    }
    aiConnection = new OpenAI({
      baseURL: process.env.BASE_URL as string,
      apiKey: process.env.API_KEY as string,
    });
  } catch (error) {
    console.error('Error connecting to OpenAI:', error);
  }
};

/**
 * Generate response from AI and write on stdout or to a file.
 * @param {string} data Data read from files passed in arguments
 */

const aiResponse = async (data: string): Promise<void> => {
  //get data from files passed in argument and generate response
  if (aiConnection)
    //check if the connection was setup
    try {
      const completion = await aiConnection.chat.completions.create({
        model: program.opts().model, //get model from arguments or use program default
        messages: [
          //define messages for system and user
          {
            role: 'system',
            content:
              'Return only the code with added comments, no explanations and without any code block delimiters (e.g., triple backticks).',
          },
          { role: 'user', content: data },
        ],
        temperature: parseFloat(program.opts().temperature), //get temp from arguments or use program default
      });
      if (program.opts().output) {
        //if output file is passed write response to file
        await processFile(
          program.opts().output,
          'write',
          completion.choices[0].message.content,
        );
        console.log(`Documented code written to ${program.opts().output}`);
      } else {
        console.log(completion.choices[0].message.content);
        //display token usage if requested
        if (program.opts().tokenUsage) {
          console.error(
            'Token Usage:\n',
            `Completion Tokens: ${completion.usage?.completion_tokens}\n`,
            `Prompt Tokens: ${completion.usage?.prompt_tokens}\n`,
            `Total Tokens: ${completion.usage?.total_tokens}\n`,
          );
        }
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
