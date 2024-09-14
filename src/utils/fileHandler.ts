import fs from 'fs/promises';

/**
 * Receive a file and process it
 * @param filePath Path of file to process
 * @param operation Operation to perform on file
 * @param data Data to write to file (only for 'write' operation)
 * @returns File content for 'read' operation, void for 'write' operation
 * @throws Error if file operations fail or if input is invalid
 */
export async function processFile(
  filePath: string,
  operation: 'read' | 'write',
  data?: string | null,
): Promise<string | void> {
  try {
    if (operation === 'read') {
      const fileData = await fs.readFile(filePath, 'utf-8');
      if (fileData.trim() === '') {
        throw new Error('File is empty');
      }
      return fileData;
    } else if (operation === 'write' && data) {
      // Check if file exists and has content
      try {
        const existingData = await fs.readFile(filePath, 'utf-8');
        if (existingData.trim() !== '') {
          console.warn(
            `Warning: File ${filePath} already contains data. New data will be appended.`,
          );
        }
      } catch (error) {
        // File doesn't exist or can't be read, which is fine for a write operation
      }
      await fs.appendFile(filePath, data);
    }
  } catch (error) {
    throw new Error(
      `Failed ${operation === 'read' ? 'reading from' : 'writing to'} file:${filePath}. ${error}`,
    );
  }
}
