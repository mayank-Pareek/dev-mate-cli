import isAsyncIterable from '../../src/utils/checkIterable';
import { ChatCompletionChunk } from 'openai/resources';

// Mock ChatCompletionChunk
const mockAsyncIterable = async function* (): AsyncIterable<ChatCompletionChunk> {
  yield { id: 'chunk1' } as ChatCompletionChunk;
  yield { id: 'chunk2' } as ChatCompletionChunk;
};

describe('isAsyncIterable', () => {
  test('should return true for an async iterable object', () => {
    const asyncIterable = mockAsyncIterable();
    expect(isAsyncIterable(asyncIterable)).toBe(true);
  });

  test('should return false for a non-async iterable object', () => {
    const nonIterable = { id: 'notIterable' };
    expect(isAsyncIterable(nonIterable)).toBe(false);
  });

  test('should return false for null or undefined', () => {
    expect(isAsyncIterable(null)).toBe(false);
    expect(isAsyncIterable(undefined)).toBe(false);
  });

  test('should return false for a regular iterable (not async)', () => {
    const iterable = [1, 2, 3];
    expect(isAsyncIterable(iterable)).toBe(false);
  });
});
