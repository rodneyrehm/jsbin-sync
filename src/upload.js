
var JsbinClient = require('jsbin-client');
var fileToBin = require('./file-to-bin');
var defaults = require('./defaults');

module.exports = function(files, options) {
  if (!options) {
    options = {};
  }

  defaults(options);

  var jsbin = new JsbinClient({
    token: options.token,
    endpoint: options.endpoint,
  });

  return Promise.all(files.map(file => fileToBin(file, jsbin, options))).then(function(states) {
    var map = {};
    states.forEach(function(state, index) {
      var file = files[index];
      map[file] = state;
    });

    return map;
  });
};
