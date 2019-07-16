const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');

// Execute the command line
module.exports = withSass(withCss({
  webpack (config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    });

    return config;
  }
}));
