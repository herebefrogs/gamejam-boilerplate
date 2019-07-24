const child_process = require('child_process');
const fs = require('fs');
const htmlmin = require('htmlmin');
const rollup = require('rollup');
const terser = require('terser');
const dataurl = require('./rollup-plugin-dataurl');
const browserSync = require('browser-sync').create();


const devMode = process.argv.length === 3 && (process.argv[2] === '-w' || process.argv[2] === '--watch')

// bundle and optimize JS code
const inputOptions = {
  // bundle all imported modules together, discarding unused code
  input: 'src/js/game.js',
  plugins: [
    // embed images into source files as data URI
    dataurl(),
  ],
};
const outputOptions = {
  file: 'dist/game.js',
  // wrap global variables/functions into in IIFE so uglify will rename them
  format: 'iife',
  // allow the use of onresize=onrotate=... and other space saver hacks
  strict: false,
  // generate sourcemaps (development mode only)
  sourcemap: devMode,
};

const compile = async () => {
  if (devMode) {
    // watch for changes in source files
    const watcher = rollup.watch({
      ...inputOptions,
      output: [ outputOptions ],
      watch: {
        include: 'src/**'
      },
    });

    watcher.on('event', event => {
      switch (event.code) {
        case 'START':
          console.log('Building JS...');
          break;
        case 'BUNDLE_END':
          console.log(`${event.input} (${event.duration}ms)`);
          break;
        // when all bundles are done
        case 'END':
          if (inlineMinified(devMode)) {
            livereload();
            zipReport();
          }
          break;
        case 'ERROR':
        case 'FATAL':
          console.error(JSON.stringify(event));
      }
    });
  } else {
    console.log('Building JS...');
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);

    if (inlineMinified(devMode)) {
      zipReport();
    }
  }
}

const inlineMinified = (devMode) => {
  const options = {
    compress: {
      passes: 4,
      unsafe: true,
      unsafe_arrows: true,
      unsafe_comps: true,
      unsafe_math: true,
    },
    ecma: 8,
    mangle: true,
    module: true,
    sourceMap: devMode ? {
      content: fs.readFileSync('dist/game.js.map', 'utf8'),
      url: 'minified.js.map'
    } : false,
  };

  // optimize JS bundle
  console.log('Minifying JS...');
  const code = fs.readFileSync('dist/game.js').toString();
  const result = terser.minify(code, options);

  if (result.error) {
    console.error('Minification failed: ', result.error);
    return false;
  }
  // save the minified source map
  if (result.map) {
    fs.writeFileSync('dist/minified.js.map', result.map, 'utf8');
  }

  // optimize HTML template
  console.log('Optimizing HTML...');
  const html = htmlmin(fs.readFileSync('src/index.html').toString());
  // inline optimized JS bundle into HTML template
  console.log('Inlining JS...');
  // NOTE:prepend <body> so browsersync can insert its livereload script (development mode only)
  fs.writeFileSync('dist/index.html', `${devMode ? '<body>' : ''}${html}<script>${result.code}</script>`);

  return true;
};

const zipReport = () => {
  // zip HTML-with-inlined-JS file for game jam submission
  console.log('Zipping...');
  child_process.execSync('zip -jqX9 dist/game.zip dist/index.html');
  console.log('Optimizing ZIP...')
  // optimize zip (requires AdvanceCOMP tools --- on Mac, brew install advancecomp)
  child_process.execSync('advzip -z -4 dist/game.zip');


  // report zip size and remaining bytes
  const size = fs.statSync('dist/game.zip').size;
  const limit = 1024 * 13;
  const remaining = limit - size;
  const percentage = Math.round((remaining / limit) * 100 * 100) / 100;
  console.log('\n-------------');
  console.log(`USED: ${size} BYTES`);
  console.log(`REMAINING: ${remaining} BYTES (${percentage}% of 13k budget)`);
  console.log('-------------\n');
};

let livereload = () => {
  // on first run, start a web server
  browserSync.init({
    server: ['dist', 'src']
  });

  // on future runs, reload the browser
  livereload = () => {
    browserSync.reload('dist/index.html');
  }
};

compile();
