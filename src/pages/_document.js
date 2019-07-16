// Externals
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

/**
 * Custom Next.js Document
 * Customizes base html structure and common meta tags
 *
 * Only rendered server-side
 *
 * @class CustomDocument
 * @extends {Document}
 */
class CustomDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render () {
    return (
      <html className='has-navbar-fixed-top'>
        <Head>
          {/* Meta tags and static assets */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default CustomDocument;
