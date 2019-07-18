// Externals
const next = require('next');
const mobxReact = require('mobx-react');
const Router = require('koa-router');

// Next.js config
const nextConfig = require('../../next.config');

// Tell mobx react that we are on server-side
mobxReact.useStaticRendering(true);

/**
 * Strapi middleware to integrate Next.js
 *
 * @param {Object} strapi Strapi global instance
 *
 * @returns {Object} Middleware definition
 */
function strapiMiddlewareNext (strapi) {
  // Create a regex to identify API routes
  // @todo: Transfer to a strapi config file
  // const startsWithApi = /^\/api.+/;

  // Check environment variables to know if Next.js should be started in development mode
  const dev = process.env.NODE_ENV !== 'production' && process.env.NODE_NEXT_ENV !== 'production';

  // Compose Next.js config object
  // @todo: Transfer to a strapi config file
  const config = {
    // Next.js code folder
    dir: './src',
    // Display server errors on client
    quiet: false,
    // Development/Production mode
    dev,
    // Next.js custom config, see `next.config.js`
    conf: nextConfig
  };

  // Initialize Next.js server
  const app = next(config);
  // Retrieve Next.js request handler
  const handle = app.getRequestHandler();

  return {
    /**
     * Initialize middleware. Executed at server startup.
     */
    async initialize () {
      // Prepare server but do not `await` it so we don't break strapi middleware boot chain
      // resolve promise with Next.js request handler
      const prepareNext = await app.prepare();

      // Create new `koa-router` instance
      const router = new Router();

      // Listen to all incoming requests
      router.get('*', async (ctx, next) => {
        // Store incoming request url before strapi messes with it
        const originalUrl = ctx.req.url;

        // Let all the other middlewares execute
        await next();

        // If the request was not matched and it is not an API request try handling it with Next.js
        // if (ctx.response.status === 404 && !startsWithApi.test(originalUrl)) {
        if (ctx.response.status === 404) {
          // Reset the `ctx.url` now that strapi messed it up
          ctx.url = originalUrl;

          // Handle request and response with Next.js
          await handle(ctx.req, ctx.res);

          // Tell strapi and other koa middlewares that the request has been handled
          delete ctx.body;
          ctx.respond = false;
          ctx.headerSent = true;
        }
      });

      // Attach Next.js app instance to global strapi instance so it can be used
      // to render components on custom routes
      strapi.next = app;

      // Bind `koa-router` instance to strapi app
      strapi.app.use(router.routes());
    }
  };
}

module.exports = strapiMiddlewareNext;
