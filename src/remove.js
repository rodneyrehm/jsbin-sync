
var PromisePool = require('es6-promise-pool')
var JsbinClient = require('jsbin-client');

var listBins = require('./list');
var defaults = require('./defaults');

module.exports = function(bins, options) {
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
  var collectResult = function(res) {
    if (!results[res.url]) {
      results[res.url] = {};
    }
    
    results[res.url][res.snapshot] = res.status;
  };

  var createRemoveList = function(map) {
    var removeBins = {};

    var addSnapshot = function(url, snapshot) {
      if (!removeBins[url]) {
        removeBins[url] = {};
      }

      removeBins[url][snapshot] = true;
    };

    var addAllSnapshots = function(bin) {
      addSnapshot(bin.url, bin.snapshot);
      bin.history.forEach(function(entry) {
        addSnapshot(entry.url, entry.snapshot);
      });
    }

    var getSnapshotsMap = function(bin) {
      var map = {};
      map[bin.snapshot] = true;
      bin.history.forEach(function(entry) {
        map[entry.snapshot] = true;
      });

      return map;
    };

    bins.forEach(function(item) {
      var parts = item.split(':');
      var url = parts[0]
      var snapshots = (parts[1] || '').split(',').filter(Boolean);
      var bin = map[url];

      if (!bin) {
        collectResult({
          url: url,
          snapshot: '*',
          status: 'not found'
        });
        return;
      }

      if (snapshots.indexOf('all') !== -1) {
        addAllSnapshots(bin);
        return;
      }

      if (!snapshots.length) {
        snapshots.push('latest');
      }

      var history = getSnapshotsMap(bin);
      snapshots.forEach(function(snapshot) {
        if (snapshot === 'latest') {
          addSnapshot(url, bin.snapshot);
          return;
        }

        if (history[snapshot]) {
          addSnapshot(url, snapshot);
          return;
        }

        collectResult({
          url: url,
          snapshot: snapshot,
          status: 'not found'
        });
      });
    });

    var queue = [];
    Object.keys(removeBins).forEach(function(url) {
      Object.keys(removeBins[url]).forEach(function(snapshot) {
        queue.push({ url: url, snapshot: snapshot });
      });      
    });

    return queue;
  };

  var pooledRemove = function(data) {
    var generatePromiseForPool = function() {
      if (!data.length) {
        return null;
      }

      var prepareResult = function(res) {
        res.status = res.deleted ? 'removed' : 'not removed';
        delete res.deleted
        return res;
      };

      var entry = data.shift();
      return jsbin.remove(entry.url, entry.snapshot)
        .then(prepareResult)
        .then(collectResult);
    };

    var pool = new PromisePool(generatePromiseForPool, options.concurrency);
    return pool.start().then(returnResults);
  }

  return listBins(options)
    .then(createRemoveList)
    .then(pooledRemove);
};
