
var path = require('path');

var fs = require('fs');
var denodeify = require('es6-denodeify')(Promise);
var writeFile = denodeify(fs.writeFile);
var mkdirp = denodeify(require('mkdirp'));

var binToFile = require('bin-to-file');
//var document = require('./document');

module.exports = function(target, url, snapshot, jsbin, options) {
  var directory = target;
  var basename = url + '.html';

  if (options.includeSnapshots) {
    directory = path.resolve(target, url);
    basename = url + '.' + snapshot + '.html';
  }

  var file = path.resolve(directory, basename);
  var _bin;

  var downloadBin = function() {
    return jsbin.read(url, snapshot);
  };

  function writeBinToFile(bin) {
    _bin = bin;

    // bin-to-file does things differently
    bin.revision = bin.snapshot;

    var html = binToFile(bin);
    return writeFile(file, html);
  };

  var returnResult = function() {
    return {
      url: url,
      snapshot: snapshot,
      file: file,
    };
  };

  return mkdirp(directory)
    .then(downloadBin)
    .then(writeBinToFile)
    .then(returnResult);
};
