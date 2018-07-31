const fs = require('fs');
const htmlmin = require('htmlmin');
const yazl = require('yazl');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const dataurl = require('./rollup-plugin-dataurl');
const uglify = require('rollup-plugin-uglify');
const browserSync = require('browser-sync').create();


const devMode = process.argv.length === 3 && (process.argv[2] === '-w' || process.argv[2] === '--watch')

// bundle and optimize JS code
const inputOptions = {
  // bundle all imported modules together, discarding unused code
  input: 'src/js/game.js',
  plugins: [
    // embed images into source files as data URI
    dataurl({
      charset: 'src/img/charset.png',
      tileset: 'src/img/tileset.png',
     }),
    // transpile ES6 to ES5 for maximum browser compatibility
    babel({
      presets: [
        [ 'env', { modules: false } ]
      ]
    }),
    // strip indentation and shrink variable names (ES5 only)
    uglify()
  ]
};
const outputOptions = {
  file: 'dist/game.js',
  // wrap global variables/functions into in IIFE so uglify will rename them
  format: 'iife',
  // allow the use of onresize=onrotate=... and other space saver hacks
  strict: false,
  // generate sourcemaps (development mode only)
  sourcemap: devMode
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
          console.log('Building...');
          break;
        case 'BUNDLE_END':
          console.log(`${event.input} -> ${event.output[0]} (${event.duration}ms)`);
          break;
        // when all bundles are done
        case 'END':
          package(devMode);
          // NOTE: these 2 run in parallel
          report();
          livereload();
          break;
      }
    });
  } else {
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);

    package(devMode);
    report();
  }
}

const package = (devMode) => {
  // optimize HTML template
  const html = htmlmin(
    fs.readFileSync('src/index.html').toString()
  );

  // inline optimized JS bundle into HTML template
  const code = fs.readFileSync('dist/game.js').toString();
  // prepend <body> so browsersync can insert its livereload script (development mode only)
  const header = devMode ? '<body>' : '';
  fs.writeFileSync('dist/index.html', `${header}${html}<script>${code}</script>`);
};

const report = () => {
  // zip HTML-with-inlined-JS file for game jam submission
  const zip = new yazl.ZipFile();
  zip.addFile('dist/index.html', 'index.html');
  zip.outputStream.pipe(fs.createWriteStream('dist/game.zip')).on('close', function() {
    // report zip size and remaining bytes
    console.log('dist/index.html -> dist/game.zip');
    const size = fs.statSync('dist/game.zip').size;
    const limit = 1024 * 13;
    const remaining = limit - size;
    const percentage = Math.round((remaining / limit) * 100 * 100) / 100;
    console.log('\n-------------');
    console.log(`USED: ${size} BYTES`);
    console.log(`REMAINING: ${remaining} BYTES (${percentage}% of 13k budget)`);
    console.log('-------------\n');
  });
  zip.end();
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
