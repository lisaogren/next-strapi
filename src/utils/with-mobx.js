// Externals
import { Component } from 'react';

// Mobx stores
import { initializeStore } from '../stores';

// Utils
import log from './log';
import isServer from './isServer';

// Global expose key
const __NEXT_MOBX_STORE__ = '__NEXT_MOBX_STORE__';

/**
 * Store factory
 *
 * @param {Object} initialState
 *
 * @returns {Object} Store instance
 */
function getOrCreateStore (initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer()) {
    return initializeStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_MOBX_STORE__]) {
    window[__NEXT_MOBX_STORE__] = initializeStore(initialState);
  }
  return window[__NEXT_MOBX_STORE__];
}

/**
 * Wrap a custom Next.js app instance to provide a mobx store tree
 *
 * @export
 *
 * @param {App} App Custom Next.js app instance
 *
 * @returns {Component} Wrapped app instance
 */
export default function withMobx (App) {
  class AppWithMobx extends Component {
    static async getInitialProps (appContext) {
      const { pathname } = appContext.ctx;

      log.debug('[withMobx] getInitialProps', { pathname });

      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const store = getOrCreateStore();

      // Provide the store to getInitialProps of pages
      appContext.ctx.store = store;

      // Execute `App.getInitialProps()` method
      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        // Fix: Generates a circular dependency error when converting to JSON on server
        // initialState: store,
        ...appProps,
        pathname
      };
    }

    constructor (props) {
      super(props);

      const { store } = props;

      log.debug('[withMobx] constructor', { store });

      this.store = getOrCreateStore(props);
    }

    render () {
      return (
        <App {...this.props} store={this.store} />
      );
    }
  }

  return AppWithMobx;
}
