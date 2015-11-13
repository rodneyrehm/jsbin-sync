
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

  var results = {};
  var returnResults = () => results;

  var pooledUpload = function(data) {
    var generatePromiseForPool = function() {
      if (!data.length) {
        return null;
      }

      var entry = data.shift();
      var collectResult = function(res) {
        results[entry] = res;
      };

      return fileToBin(entry, jsbin, options)
        .then(collectResult);
    };

    var pool = new PromisePool(generatePromiseForPool, options.concurrency);
    return pool.start().then(returnResults);
  };

  return pooledUpload(files.slice(0))
    .then(returnResults);
};
