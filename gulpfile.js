const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const Browser = require('browser-sync');

function runWebpack() {
  return new Promise(res => {
    webpack(webpackConfig).run(res);
  });
}

gulp.task('server', () => {
  const browser = Browser.create();
  browser.init({
    server: 'dist',
    port: 5000,
  });

  runWebpack().then();

  gulp.watch('src/**/*').on('change', () => {
    runWebpack().then(browser.reload);
  });
});
