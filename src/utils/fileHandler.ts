import fs from 'fs/promises';

export async function processFile(
  filePath: string,
  operation: 'read' | 'write',
  data?: string | null,
): Promise<string | void> {
  try {
    if (operation === 'read') {
      return await fs.readFile(filePath, 'utf-8');
    } else if (operation === 'write' && data) {
      await fs.writeFile(filePath, data);
    }
  } catch (error) {
    console.error(
      `Error ${operation === 'read' ? 'reading from' : 'writing to'} file:`,
      error,
    );
    throw error;
  }
}
