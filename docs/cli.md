
# jsbin-sync: Command Line Interface

When installed globally (`npm install -g jsbin-sync`), a CLI is made available:

```
➜  jsbin-sync

  Usage: jsbin-sync [options] [command]


  Commands:

    upload <files...>  synchronize local files to JSBin.com
    help [cmd]         display help for [cmd]

  client to interact with JSBin.com

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```


## Default Options

The following deault values are used unless overwritten via CLI arguments:

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

**Note:** Instead of specifying `--token <token>` and `--endpoint <endpoint>` every time, the environment variables `JSBIN_TOKEN` and `JSBIN_ENDPOINT` can be used.


## CLI: Upload

See [File Structure For `upload` command](./upload-file-structure.md) to learn how HTML files have to be structured so they can be processed by `upload`.

```
➜  jsbin-sync upload --help

  Usage: jsbin-sync-upload [options] <file ...>

  upload files to JSBin.com

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    --token <token>              JSBin access token
    --endpoint <endpoint>        JSBin API endpoint
    --concurrency <concurrency>  Number of parallel requests
    --css <selector>             Selector for CSS container
    --js <selector>              Selector for JS container
    --force                      Force upload for unchanged files
    --silent                     Do not output status messages
    --json                       Output status messages as JSON
```


## CLI: Backup

```
➜  bin/jsbin-sync backup --help

  Usage: jsbin-sync-backup [options] <target directory>

  download all bins to target directory

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    --token <token>              JSBin access token
    --endpoint <endpoint>        JSBin API endpoint
    --concurrency <concurrency>  Number of parallel requests
    --include-snapshots          Download all versions of the bins, rather than only the latest
    --silent                     Do not output status messages
    --json                       Output status messages as JSON
```
