import OpenAI from 'openai';
import program from './program';
import { processFile } from './utils/fileHandler';
import isAsyncIterable from './utils/checkIterable';

let aiConnection: OpenAI | null = null;

// Setup connection using API key and base URL from .env
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
  if (aiConnection) {
    try {
      const streamEnabled = program.opts().stream; // Get the streaming option

      const completion = await aiConnection.chat.completions.create({
        model: program.opts().model,
        messages: [
          {
            role: 'system',
            content:
              'Return only the code with added comments, no explanations and without any code block delimiters (e.g., triple backticks).',
          },
          { role: 'user', content: data },
        ],
        temperature: parseFloat(program.opts().temperature),
        stream: streamEnabled,
      });

      if (streamEnabled && isAsyncIterable(completion)) {
        // If streaming, iterate through the async iterable response
        let collectedChunks: string[] = [];
        for await (const chunk of completion) {
          const chunkMessage = chunk.choices?.[0].delta?.content;
          if (chunkMessage) {
            collectedChunks.push(chunkMessage);
            if (!program.opts().output) {
              // Only write to stdout if no output file is specified
              process.stdout.write(chunkMessage);
            }
          }
        }
        if (program.opts().output) {
          // if output specified, combine response and write to file
          let finalContent = collectedChunks.join('');
          await processFile(program.opts().output, 'write', finalContent);
          console.log(`Documented code written to ${program.opts().output}`);
        }
      } else {
        // Handle non-streaming response
        const messageContent = completion.choices?.[0]?.message?.content;
        if (messageContent !== undefined) {
          // Write the full response to the specified output file
          if (program.opts().output) {
            await processFile(program.opts().output, 'write', messageContent);
            console.log(`Documented code written to ${program.opts().output}`);
          } else {
            console.log(messageContent); // Write the full response to stdout only if no output file is specified
          }
        }
      }

      // Optionally display token usage
      if (program.opts().tokenUsage) {
        console.error(
          'Token Usage:\n',
          `Completion Tokens: ${completion.usage?.completion_tokens}\n`,
          `Prompt Tokens: ${completion.usage?.prompt_tokens}\n`,
          `Total Tokens: ${completion.usage?.total_tokens}\n`,
        );
      }
    } catch (error: any) {
      if (error.code === 400) {
        console.error('selected model is not available, choose another model');
      } else {
        console.error(error);
      }
    }
  }
};

export default aiResponse;
