import OpenAI from 'openai';
import program from './program';
import { processFile } from './utils/fileHandler';
import isAsyncIterable from './utils/checkIterable';

let aiConnection: OpenAI | null = null;

interface AIOptions {
  model: string;
  temperature: number;
  stream?: boolean;
  output?: string;
  tokenUsage?: boolean;
}

// Function to get AI options, with fallback model and temperature
const getAIOptions = (): AIOptions => {
  return {
    model: program.opts().model || 'google/gemma-2-9b-it:free',
    temperature: program.opts().temperature
      ? parseFloat(program.opts().temperature)
      : 0.7,
    stream: program.opts().stream,
    output: program.opts().output,
    tokenUsage: program.opts().tokenUsage,
  };
};

// Setup connection using API key and base URL from .env
export const initializeConnection = (): void => {
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

// Function to handle AI responses
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const handleAIResponse = async (completion: any, options: AIOptions) => {
  let promptTokens = 0,
    completionTokens = 0,
    totalTokens = 0;
  if (options.stream && isAsyncIterable(completion)) {
    const collectedChunks: string[] = [];
    for await (const chunk of completion) {
      // PRocess chunks of response stream
      const chunkMessage = chunk.choices?.[0].delta?.content;
      if (chunkMessage) {
        collectedChunks.push(chunkMessage);
        if (!options.output) {
          process.stdout.write(chunkMessage);
        }
      }
      if (options.tokenUsage && chunk?.usage) {
        promptTokens = chunk.usage.prompt_tokens;
        completionTokens = chunk.usage.completion_tokens;
        totalTokens = chunk.usage.total_tokens;
      }
    }
    if (options.output) {
      const finalContent = collectedChunks.join('');
      await processFile(options.output, 'write', finalContent);
      console.log(`Documented code written to ${options.output}`);
    }
  } else {
    const messageContent = completion.choices?.[0]?.message?.content;
    if (messageContent !== undefined) {
      if (options.output) {
        await processFile(options.output, 'write', messageContent);
        console.log(`Documented code written to ${options.output}`);
      } else {
        console.log(messageContent);
      }
    }
    if (options.tokenUsage) {
      promptTokens = completion.usage?.completion_tokens;
      completionTokens = completion.usage?.prompt_tokens;
      totalTokens = completion.usage?.total_tokens;
    }
  }
  // Display token usage if flag passed
  if (options.tokenUsage) {
    console.error(
      '\nToken Usage:',
      `Completion Tokens: ${promptTokens},`,
      `Prompt Tokens: ${completionTokens},`,
      `Total Tokens: ${totalTokens}`,
    );
  }
};

// Generate response from AI
export const aiResponse = async (data: string): Promise<void> => {
  if (!aiConnection) return;

  try {
    const options = getAIOptions();
    const completion = await aiConnection.chat.completions.create({
      model: options.model,
      messages: [
        {
          role: 'system',
          content:
            'Return only the code with added comments, no explanations and without any code block delimiters (e.g., triple backticks).',
        },
        { role: 'user', content: data },
      ],
      temperature: options.temperature,
      stream: options.stream,
    });

    await handleAIResponse(completion, options);
  } catch (error: any) {
    if (error.code === 400) {
      console.error('selected model is not available, choose another model');
    } else {
      console.error(error);
    }
  }
};
