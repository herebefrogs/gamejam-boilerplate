const { execFileSync } = require('child_process');
const ect = require('ect-bin');

// recompress the zip in place at max effort, replacing advzip
execFileSync(ect, ['-zip', '-9', '-strip', process.argv[2]], { stdio: 'inherit' });
