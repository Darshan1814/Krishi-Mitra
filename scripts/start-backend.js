const { spawn } = require('child_process');
const path = require('path');

// Start backend server
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit'
});

backend.on('error', (error) => {
  console.error('Backend error:', error);
});

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

console.log('Starting backend server...');