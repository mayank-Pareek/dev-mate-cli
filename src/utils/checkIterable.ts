import type { ChatCompletionChunk } from 'openai/resources';

// Utility function to check if a response is an async iterable
export default function isAsyncIterable(
  obj: any,
): obj is AsyncIterable<ChatCompletionChunk> {
  return !!(obj && typeof obj[Symbol.asyncIterator] === 'function');
}
