
var PromisePool = require('es6-promise-pool')
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

  var pooledUpload = function(data) {
    var results = [];
    var returnResults = () => results;
    var collectResult = res => results.push(res);

    var generatePromiseForPool = function() {
      if (!data.length) {
        return null;
      }

      var entry = data.shift();
      return fileToBin(entry, jsbin, options)
        .then(collectResult);
    };

    var pool = new PromisePool(generatePromiseForPool, options.concurrency);
    return pool.start().then(returnResults);
  }

  return pooledUpload(files.slice(0)).then(function(states) {
    var map = {};
    states.forEach(function(state, index) {
      var file = files[index];
      map[file] = state;
    });

    return map;
  });
};
