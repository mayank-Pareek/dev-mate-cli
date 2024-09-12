import { promises as fs } from 'fs';

export const openFile = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const writeData = async (file: string, data: string) => {
  try {
    await fs.writeFile(file, data);
  } catch (error) {
    console.error('can not write data', error);
  }
};


