
var JsbinClient = require('jsbin-client');
var sync = require('./sync');

module.exports = function(files, options) {
  if (!options) {
    options = {};
  }

  var jsbin = new JsbinClient({
    token: options.token || process.env.JSBIN_TOKEN,
    endpoint: options.endpoint,
  });

  return Promise.all(files.map(file => sync(file, jsbin, options))).then(function(urls) {
    var map = {};
    urls.forEach(function(url, index) {
      if (!url) {
        return;
      }

      var file = files[index];
      map[file] = url;
    });
    
    return map;
  });
};
