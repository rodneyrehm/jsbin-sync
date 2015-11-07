
var path = require('path');

var PromisePool = require('es6-promise-pool')
var JsbinClient = require('jsbin-client');

var binToFile = require('./bin-to-file');
var defaults = require('./defaults');

module.exports = function(target, options) {
  if (!options) {
    options = {};
  }

  defaults(options);

  var jsbin = new JsbinClient({
    token: options.token,
    endpoint: options.endpoint,
  });

  var _target = path.resolve(process.cwd(), target);

  var createDownloadList = function(list) {
    var sequence = list.map(function(entry) {
      var _list = [
        {url: entry.url, snapshot: entry.snapshot},
      ];

      if (!options.includeSnapshots) {
        return _list[0];
      }

      return _list.concat(entry.history.map(function(_entry) {
        return {url: _entry.url, snapshot: _entry.snapshot};
      }));
    });

    if (!options.includeSnapshots) {
      return sequence;
    }
    
    // flatten nested arrays
    return sequence.reduce((previous, current) => previous.concat(current), []);
  };

  var pooledDownload = function(data) {
    var results = {};
    var returnResults = () => results;
    var collectResult = function(res) {
      !results[res.url] && (results[res.url] = {});
      results[res.url][res.snapshot] = res.file;
    };

    var generatePromiseForPool = function() {
      if (!data.length) {
        return null;
      }

      var entry = data.shift();
      return binToFile(_target, entry.url, entry.snapshot, jsbin, options)
        .then(collectResult);
    };

    var pool = new PromisePool(generatePromiseForPool, options.concurrency);
    return pool.start().then(returnResults);
  }

  return jsbin.list()
    .then(createDownloadList)
    .then(pooledDownload);
};
