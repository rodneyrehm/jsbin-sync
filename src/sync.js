
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
      return response.url;
    }

    var html = document.updateBin(_content, response.url);
    return writeFile(file, html)
      .then(() => response.url);
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
      return _data.url;
    }

    return uploadFile();
  };

  var handleFile = function(content) {
    _content = content;
    _data = document.parse(content, options);

    if (!_data) {
      console.log('Skipping ' + file + ' because <link rel="jsbin"> is missing');
      return null;
    }

    if (!_data.url && !options.force) {
      return uploadFile();
    }

    return jsbin.read(_data.url).then(verifyBeforeUpload);
  }

  return readFile(file, 'utf8').then(handleFile);
}
