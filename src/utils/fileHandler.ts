import fs from 'fs/promises';
import path from 'path';

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

/**
 * Process multiple files and collect their data, recursively traversing directories.
 * @param paths Array of file paths or directories
 * @returns Concatenated data from all the files
 * @throws Error if file processing fails
 */
export async function processFilesAndCollectData(
  paths: string[],
): Promise<string> {
  let combinedData = '';

  // Function to check paths recursively
  async function processPath(p: string) {
    try {
      const stat = await fs.stat(p); // Check if it's a file or directory
      if (stat.isDirectory()) {
        const files = await fs.readdir(p); // Read directory contents
        for (const file of files) {
          const filePath = path.join(p, file);
          await processPath(filePath); // Recursively process each file or directory
        }
      } else if (stat.isFile()) {
        const data = await processFile(p, 'read'); // Process the file directly
        if (data) combinedData += data + '\n'; // Collect file data
      } else {
        console.warn(`'${p}' is neither a file nor a directory.`);
      }
    } catch (error) {
      console.error('Error processing path:', error);
    }
  }

  for (const p of paths) {
    await processPath(p); // Process each path (file or directory) provided
  }
  return combinedData.trim(); // Return concatenated file data
}
