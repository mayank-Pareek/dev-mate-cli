import 'dotenv/config';
import program from './program';
import { initializeConnection } from './ai';

//setup connection with OpenAI API
initializeConnection();
//parse commander program to setup command line
program.parse();
