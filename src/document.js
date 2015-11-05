
var cheerio = require('cheerio');
var redent = require('redent');

var defaults = {
  css: '#jsbin-css',
  js: '#jsbin-javascript',
};

module.exports.parse = function(source, options) {
  var page = cheerio.load(source);

  var $bin = page('link[rel="jsbin"]');
  if (!$bin.length) {
    // this file is not intended to be pushed to jsbin
    return null;
  }

  var $title = page('title');
  var title = $title.text();

  var binUrl = $bin.attr('href');
  $bin.remove();

  var $css = page(options.css || defaults.css);
  var css = $css.text();
  $css.remove();

  var $js = page(options.js || defaults.js);
  var js = $js.text();
  $js.remove();

  var html = page.html();

  return {
    title: title,
    url: binUrl && binUrl.match(/\/([^\/]+)\/?$/)[1] || undefined,
    css: css && redent(css, 0) || undefined,
    javascript: js && redent(js, 0) || undefined,
    html: html.replace(/\n(\s+\n)+/g, '\n'),
  };
};

module.exports.updateBin = function(source, url) {
  var page = cheerio.load(source);
  var $bin = page('link[rel="jsbin"]');
  $bin.attr('href', 'https://jsbin.com/' + url + '/');
  return page.html();
};

