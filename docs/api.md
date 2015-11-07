
# jsbin-sync API

`jsbin-sync` functionality can be used programmatically:

```js
const jsbin = require('jsbin-sync');

// upload files from disk
var promise = jsbin.upload(files, options);

// download bins to disk
var promise = jsbin.backup(directory, options);
```


## Default Options

The following default values are used unless overwritten via the options object:

```js
{
  // service configuration
  token: process.env.JSBIN_TOKEN,
  endpoint: process.env.JSBIN_ENDPOINT || 'https://jsbin.com/api/',
  concurrency: 5,
  // bin document configuration
  css: '#jsbin-css',
  js: '#jsbin-javascript',
}
```


## API: Upload

See [File Structure For `upload` command](./upload-file-structure.md) to learn how HTML files have to be structured so they can be processed by `upload`.

```js
const glob = require('glob');

const options = {
  // [optional] JSBin access token
  token: process.env.JSBIN_TOKEN,
  // [optional] JSBin API endpoint
  endpoint: 'https://jsbin.com/api/',
  // [optional] Maximum number of concurrent requests
  concurrency: 5,
  // [optional] Force upload of new snapshot even when files haven't changed
  force: false,
  // [optional] Selector for CSS container element
  css: '#jsbin-css',
  // [optional] Selector for JS container element
  js: '#jsbin-javascript',
};

glob('/path/to/*.html', {realpath: true}, function(error, files) {
  jsbin.upload(files, options)
    .then(result => console.log('upload result', result))
    .catch(error => console.error(error.stack));
});
```

`jsbin.upload` resolves to the following result data structure:

```js
{
  "/path/to/alpha.html": {
    "url": "aabbcc",
    "snapshot": 10,
    "status": "unmodified"
  },
  "/path/to/bravo.html": {
    "url": "aabbcc",
    "snapshot": 6,
    "status": "modified"
  },
  "/path/to/charlie.html": {
    "url": "aabbcc",
    "snapshot": 1,
    "status": "created"
  },
  "/path/to/delta.html": {
    "url": null,
    "snapshot": null,
    "status": "skipped",
    "message": "<link rel=\"jsbin\"> not found"
  },
  "/path/to/echo.html": {
    "url": null,
    "snapshot": null,
    "status": "missing",
    "message": "ENOENT: no such file or directory, open '/path/to/echo.html'"
  }
}
```


## API: Backup

```js
const options = {
  // [optional] JSBin access token
  token: process.env.JSBIN_TOKEN,
  // [optional] JSBin API endpoint
  endpoint: 'https://jsbin.com/api/',
  // [optional] Maximum number of concurrent requests
  concurrency: 5,
  // [optional] Download all versions of the bins, rather than only the latest
  includeSnapshots: false,
};

jsbin.upload(files, options)
  .then(result => console.log('backup result', result))
  .catch(error => console.error(error.stack));
```

`jsbin.backup` resolves to the following result data structure:

```js
{
  "aabbcc": {
    "1": "/path/to/aabbcc/aabbcc.1.html",
    "2": "/path/to/aabbcc/aabbcc.2.html"
  },
  "bbccdd": {
    "1": "/path/to/bbccdd/bbccdd.1.html"
  }
}
```
