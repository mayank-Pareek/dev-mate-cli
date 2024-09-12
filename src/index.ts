import 'dotenv/config';
import program from './program';
import { initializeConnection } from './ai';

initializeConnection();
program.parse();
