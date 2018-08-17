Game Jam Boilerplate
====================

Getting Started
---------------

```
npm start
-> build game, open a browser, watch source and livereload browser on changes

npm run build
-> build game for gamejam submission (no sourcemap and livereload script)

npm run tinify-pngs
-> optimize any new/modified PNG images staged for commit using TinyPNG (API key must be configured, see next section)
```

Configuring tinify-pngs
-----------------------

First register at https://tinypng.com/developers to get an API key (free under 500 compression/month). Then create a JSON file named `keys.json` at the root of the repo with the following content:

```
{
  "TINIFY_API_KEY": "<your API key here>"
}
```

This file is ignored and never committed in the repo, keeping your API key private and secure. If this file or the API key missing, the script will abort silently.

To automatically optimize any PNG images you commit, create a file named `.git/hooks/pre-commit` with the following content:

```
#!/bin/sh

if [ -f 'package.json' ]; then
  npm run tinify-pngs
fi
```

Then make the file executable by running the following command `chmod a+x .git/hooks/pre-commit`

Special Thanks
--------------
- Eoin McGrath for his original build script
- [Peters](https://twitter.com/p1100i) and [flo-](https://twitter.com/fl0ptimus_prime) for their pixel font from Glitch Hunter
- [Ryan Malm](https://twitter.com/ryanmalm) for sharing his Twitter message code
- [Maxime Euziere](https://twitter.com/MaximeEuziere) for his switch/case approach to handling game screens in update/render/input handlers
- Florent Cailhol for suggesting Terser in place of UglifyJS
