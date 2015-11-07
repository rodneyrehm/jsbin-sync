
var JsbinClient = require('jsbin-client');

var defaults = require('./defaults');

module.exports = function(options) {
  if (!options) {
    options = {};
  }

  defaults(options);

  var jsbin = new JsbinClient({
    token: options.token,
    endpoint: options.endpoint,
  });

  return jsbin.list().then(function(list) {
    var map = {};
    list.forEach(function(entry) {
      map[entry.url] = entry;
    });
    return map;
  });
};
