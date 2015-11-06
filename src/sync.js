
var fs = require('fs');
var denodeify = require('es6-denodeify')(Promise);
var readFile = denodeify(fs.readFile);
var writeFile = denodeify(fs.writeFile);

var document = require('./document');

module.exports = function(file, jsbin, options) {
  var _data;
  var _content;

  var updateFile = function(response) {
    if (!response) {
      return response;
    }

    if (_data.url === response.url) {
      return {
        url: _data.url,
        snapshot: response.snapshot,
        status: 'modified',
      };
    }

    var html = document.updateBin(_content, response.url);
    return writeFile(file, html).then(function() {
      return {
        url: response.url,
        snapshot: response.snapshot,
        status: 'created',
      };
    });
  };

  var uploadFile = function() {
    return jsbin.save(_data).then(updateFile);
  };

  var verifyBeforeUpload = function(bin) {
    var hasChanges = !bin.settings
      || bin.settings.title !== _data.title
      || bin.html !== _data.html
      || bin.css !== _data.css
      || bin.javascript !== _data.javascript;

    if (!hasChanges) {
      return {
        url: _data.url,
        snapshot: bin.snapshot,
        status: 'unmodified',
      };
    }

    return uploadFile();
  };

  var handleFile = function(content) {
    _content = content;
    _data = document.parse(content, options);

    if (!_data) {
      return {
        url: null,
        snapshot: null,
        status: 'skipped',
        message: '<link rel="jsbin"> not found',
      };
    }

    if (!_data.url && !options.force) {
      return uploadFile();
    }

    return jsbin.read(_data.url).then(verifyBeforeUpload);
  }

  return readFile(file, 'utf8').then(handleFile, function(error) {
    return {
      url: null,
      snapshot: null,
      status: 'missing',
      message: error.message,
    }
  });
}
