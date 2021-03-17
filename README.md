Game Jam Boilerplate
====================

A small, extendable boilerplate for 2D canvas games with keyboard, mouse and touch support. It comes with a build script to watch for changes and livereload the game in your browser during development, and to package your game into a ZIP archive for gamejam submission.

Getting Started
---------------

```
npm start
-> build game, open a browser, watch source and livereload browser on changes

npm run build
-> build game for gamejam submission (no sourcemap and livereload script)
```

Assets
------
Even though the game engine is agnostic to the image types used, the build script is configured for WebP (which has better compression than PNGs and is supported by all modern browsers)


Understanding the game engine
-----------------------------
The entry point of your game is `index.html`. It contains minimal styling, a canvas, and a script tag to load the main JS game file. It's also missing a lot of HTML markup to make it a valid document, but modern browsers will add them automatically, therefore saving some bytes.

The first JS function to trigger is the `onload` even handler. It will set the document's title to your game's name, scale the canvas up to fill out the full window while preserving its aspect ratio, load the character set image (bitmap alphabet) and tile set image (all the game sprites), then fire off the main game loop with the `toggleLoop` function.

The canvas size is controlled by the 2 global variables `WIDTH` and `HEIGHT`. Change them to increase the game map and/or game resolution.

The main game loop is handled by the `loop` function and does 4 things:
- schedule the loop to be called again via the `requestAnimationFrame` function.
- render the current game state via the `render` function.
- calculate the elapsed time since the last loop
- update the current game state via the `update` function.

Both `render` and `update` use a state machine approach to do different things depending which screen the game is on. This boilerplate comes with 3 screens that you're encourage to expand to your needs:
- `TITLE_SCREEN`: display the name of your game, some credits or control instructions
- `GAME_SCREEN`: when the player actually plays your game
- `END_SCREEN`: display score and restart the game once the game is won or lost

The `update` function follows a simplified Entity-Component-System.
An entity (player, ennemies...) keeps track of their position, control input, current action (moving, standing still, dead...), sprite frame (which frame in the animation), speed and size. `update` goes through every entity in the game and update their animation frame and position based on the player's control inputs and the time elapsed since the last loop. It will then performed a simple bounding-box collision check (`testAABBCollision` function) and resolve any collision by pushing the 2 entities at their edge so they touch but don't overlap each other (`correctAABBCollision` function). It will also make sure no entity leaves the viewport (`constrainToViewport` function).

The `render` function goes through every entity and will display the proper bitmap at the entity's position in the viewport. The global variable `ATLAS` catalogs every existing entity type (hero, foe...) and their properties, like `speed` and animation frames under their action name (e.g. `move` is an array of coordinate and dimensions to find the proper entity bitmap in the `tileset` image).

The game is automatically paused if the player change browser tab (`onvisibilitychange` event handler).

Keyboard control is achieved by the `onkeydown` and `onkeyup` event handlers, which only record the direction in which the player wants to move so as no to block the event thread.
Mouse and touchscreen support is achieved by the `ontouchstart/onpointerdown`, `ontouchmove/onpointermove` and `ontouchend/onpointerup` even handlers.

The boilerplate will recognize the Konami code on the title screen. You're then free to enable any behaviour or cheat you see fit.

Understanding the build script
------------------------------
The build script starts by wiping clean the `dist` directory. That's where the game will be served from during development, and where the game's optimized ZIP will be saved for gamejam submission.

Next, it builds the JS code with `Rollup` & `Terser`. `Rollup` will follow all the JS import/require and inline them into a single IIFE. Any unused function will be removed by `Rollup`'s tree-shaking. `Terser` will then optimize the code for size. My custom `rollup-plugin-datauri` will inline any image referenced by the code as a Data URI, again to optimize for a lower number of files.
During development, sourcemaps will be enabled.

This is where things diverge a bit:
- During development:
  -  `Rollup` will watch for JS changes and rebuild the JS code into the `dist` directory.
  - `Chodikar` will watch for images changes in the `src` directory and call `Rollup` again (since the new images need to be inlined in the JS code).
  - `BrowserSync` will serve the JS file from the `dist` directory and `index.html` from the `src` directory on localhost over SSL (useful for A-Frame development). Any changes to the `dist` directory or `index.html` will livereload the new version of the game in your browser.
- For gamejam submission:
  - `html-inline` will inline any CSS or JS files referenced by a `src` attribute into `index.html` .
  - `html-minifier` will then optimize the inlined CSS and HTML markup.- At this point, all your game assets is a single file, which will then be zipped.
  - The resulting ZIP is futher optimzed by `AdvZIP` (part of the AdvanceComp suite, must be installed separately).
  - Finally, a small report will tell you how big the ZIP is and what's your size budget left if you're participating to JS13KGAMES.


Special Thanks & Credits
------------------------
- Eoin McGrath for his original build script
- [Peters](https://twitter.com/p1100i) and [flo-](https://twitter.com/fl0ptimus_prime) for their pixel font from Glitch Hunter
- [Ryan Malm](https://twitter.com/ryanmalm) for sharing his Twitter message code
- [Maxime Euziere](https://twitter.com/MaximeEuziere) for his switch/case approach to handling game screens in update/render/input handlers
- Florent Cailhol for suggesting Terser in place of UglifyJS
- [Matt](https://twitter.com/Smflyf) for pointing out the existence of `advzip-bin`
- [Frank Force](https://twitter.com/KilledByAPixel) and [Keith Clark](https://keithclark.co.uk/) for their über smoll sound & music players, [ZzFX](https://github.com/KilledByAPixel/ZzFX) and [ZzFX Music](https://github.com/keithclark/ZzFXM) respectively
