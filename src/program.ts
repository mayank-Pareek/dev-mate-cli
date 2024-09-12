import { Command } from 'commander';
const program = new Command();

program
  .name('cli-tool')
  .description('CLI for code utilities')
  .version('0.0.1', '-v, --vers', 'output the current version');


export default program;
