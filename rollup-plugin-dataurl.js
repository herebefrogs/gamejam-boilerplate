const { readFileSync } = require('fs');
// import { readFileSync } from 'fs'

module.exports = function (options) {
//export default function (options) {
  
  // load and base64 encode every image
  const assets = Object.entries(options).map(([ variable, file]) => {
    const data = readFileSync(`./${file}`);
    return [ variable, `data:image/png;base64,${data.toString('base64')}` ];
  });

  return {
    name: 'rollup-plugin-dataurl',
    // TODO could also be done on the bundle rather than individual imports, but not sure what the impact would be on the sourcemap
    transform: (source, id) => {
      // for every file imported into the bundle, try to locate the variable declaration and embed the image's dataurl
      let code = source;

      assets.forEach(([ variable, data ]) => {
         code = code.replace(new RegExp(`const ${variable} = '.*';`, 'gm'),
                            `const ${variable} = '${data}';`);
      })

      return { code, map: null };
    }
  }
}