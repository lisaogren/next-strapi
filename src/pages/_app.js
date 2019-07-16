// Externals
import React from 'react';
import App, { Container } from 'next/app';
import Router from 'next/router';
import Head from 'next/head';
import { Provider } from 'mobx-react';
import nprogress from 'nprogress';

// Utils
import withMobx from '../utils/with-mobx';

// Styles
import '../themes/bulma/main.scss';
import 'nprogress/nprogress.css';

/**
 * Configure and bind nprogress to the next router
 */
nprogress.configure({ showSpinner: false });

Router.onRouteChangeStart = () => nprogress.start();
Router.onRouteChangeComplete = () => nprogress.done();
Router.onRouteChangeError = () => nprogress.done();

/**
 * Declare custom next/app to deliver a common layout to all pages
 *
 * @class CustomApp
 * @extends {App}
 */
class CustomApp extends App {
  render () {
    const { Component, pageProps, store } = this.props;

    return (
      <Provider store={store}>
        <Container>
          <Head>
            <title>Carl Ogren - Developer</title>
          </Head>
          <Component {...pageProps} />
        </Container>
      </Provider>
    );
  }
}

// Provide mobx state integration to custom app
export default withMobx(CustomApp);
