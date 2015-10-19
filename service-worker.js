(global => {
  'use strict';

  // Load the sw-tookbox library.
  importScripts('./node_modules/sw-toolbox/sw-toolbox.js');

  // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = false;

  // Set up a handler for HTTP GET requests:
  // - toolbox.networkFirst for elements that can change
  global.toolbox.router.get('index.html', global.toolbox.networkFirst);
  global.toolbox.router.get('bundle.js', global.toolbox.networkFirst);
  global.toolbox.router.get('styles.css', global.toolbox.networkFirst);

  // By default, all requests that don't match our custom handler will use the toolbox.cacheFirst
  // cache strategy, and their responses will be stored in the default cache.
  global.toolbox.router.default = global.toolbox.cacheFirst;

  // Boilerplate to ensure our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);
