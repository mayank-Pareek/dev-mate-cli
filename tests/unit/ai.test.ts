import { OpenAI } from 'openai';
import { aiResponse, initializeConnection } from '../../src/ai';

jest.mock('openai');
jest.mock('commander', () => ({
  Command: jest.fn().mockImplementation(() => ({
    opts: () => ({
      model: 'google/gemma-2-9b-it:free',
      temperature: '0.7',
      stream: false,
      output: null,
      tokenUsage: false,
    }),
    option: jest.fn().mockReturnThis(),
    action: jest.fn().mockReturnThis(),
    parse: jest.fn().mockReturnThis(),
    name: jest.fn().mockReturnThis(),
    description: jest.fn().mockReturnThis(),
    version: jest.fn().mockReturnThis(),
    argument: jest.fn().mockReturnThis(),
  })),
}));

describe('AI Response Tests', () => {
  // Captured JSON response for mock
  const mockResponseData = {
    id: 'gen-1731118485-Xh26Bn7UDuYaaSTzWH47',
    provider: 'DeepInfra',
    model: 'google/gemma-2-9b-it',
    object: 'chat.completion',
    created: 1731118485,
    choices: [
      {
        logprobs: null,
        finish_reason: 'stop',
        index: 0,
        message: {
          content: '// This is a mock response\nconst mockCode = true;',
          role: 'assistant',
        },
      },
    ],
    usage: {
      prompt_tokens: 18,
      completion_tokens: 16,
      total_tokens: 34,
    },
  };

  beforeEach(() => {
    // Setup environment variables
    process.env.BASE_URL = 'https://api.openrouter.ai/api/v1';
    process.env.API_KEY = 'test-key';

    jest.clearAllMocks();

    initializeConnection();

    // Mock OpenAI chat.completions.create
    (OpenAI as jest.MockedClass<typeof OpenAI>).prototype.chat = {
      completions: {
        create: jest.fn().mockResolvedValue(mockResponseData),
      },
    } as any;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should handle basic AI response', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await aiResponse('const testCode = true;');

    expect(consoleSpy).toHaveBeenCalledWith(
      mockResponseData.choices[0].message.content,
    );
  });

  it('should handle API errors', async () => {
    // Mock OpenAI error response
    (OpenAI as jest.MockedClass<typeof OpenAI>).prototype.chat = {
      completions: {
        create: jest.fn().mockRejectedValue({ code: 400 }),
      },
    } as any;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await aiResponse('const testCode = true;');
    expect(consoleSpy).toHaveBeenCalledWith(
      'selected model is not available, choose another model',
    );
  });

  it('should handle missing environment variables', async () => {
    // Clear environment variables
    delete process.env.BASE_URL;
    delete process.env.API_KEY;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    initializeConnection();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error connecting to OpenAI:',
      new Error('Missing environment variable[s].'),
    );
  });
});
