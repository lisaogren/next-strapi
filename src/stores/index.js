// Externals
import { observable, action, computed } from 'mobx';

// Utils
import isServer from '../utils/isServer';

// Create common mobx store instance holder
let store = null;

/**
 * Core application mobx store
 * Will be provided to all pages and child components through custom Next.js <App /> component props
 *
 * @class CoreStore
 */
class CoreStore {
  // -----------------------
  // Observable data
  // -----------------------

  @observable loading = true

  // -----------------------
  // Computed data getters
  // -----------------------

  @computed get isLoading () {
    return this.loading;
  }

  // -----------------------
  // Actions
  // -----------------------

  @action setLoading (loading = true) {
    this.loading = loading;
  }
}

/**
 * CoreStore factory method.
 *
 * On server-side a new CoreStore instance will be generated each time the factory is called
 * to sandbox store between requests.
 *
 * On client-side the CoreStore is instantiated once so it can persist through the application
 * and will be returned on subsequent calls.
 *
 * @export
 * @param {Object} initialState Object or CoreStore instance provided by pages `getInitialProps()`
 *
 * @returns {CoreStore} CoreStore instance
 */
export function initializeStore (initialState) {
  if (isServer()) {
    return new CoreStore(initialState);
  } else {
    if (store === null) {
      store = new CoreStore(initialState);
    }

    return store;
  }
}
