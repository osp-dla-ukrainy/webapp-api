const { spawn } = require('child_process');

/* eslint-disable no-console */
[[], ['queue', 'workers'], ['queue', 'producers']].forEach((commandArgs) => {
  const args = ['start', 'dev'].concat(...commandArgs).join(':');

  const command = spawn('npm', ['run', args]);

  command.stdout.on('data', (data) => {
    console.log(`${data.toString()}`);
  });

  command.stderr.on('data', (data) => {
    console.log(`${data.toString()}`);
  });

  command.on('exit', (code) => {
    console.log(`child process exited with code ${code.toString()}`);
  });
});
