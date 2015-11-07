
# jsbin-sync: Command Line Interface

When installed globally (`npm install -g jsbin-sync`), a CLI is made available:

```
➜  jsbin-sync

  Usage: jsbin-sync [options] [command]


  Commands:

    list              list all bins on JSBin.com
    remove <bin...>   delete bins from JSBin.com
    backup <target>   download all bins to target directory
    upload <file...>  synchronize local files to JSBin.com
    help [cmd]        display help for [cmd]

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
    --silent                     Do not output result
    --json                       Output result as JSON
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
    --silent                     Do not output result
    --json                       Output result as JSON
```


## CLI: List

```
➜  bin/jsbin-sync list --help

  Usage: jsbin-sync-list [options]

  list all bins on JSBin.com

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    --token <token>        JSBin access token
    --endpoint <endpoint>  JSBin API endpoint
    --json                 Output result as JSON
```


## CLI: Remove

```
➜  bin/jsbin-sync remove --help

  Usage: jsbin-sync-remove <bin...>

  delete bins from JSBin.com

  <bin> can be specified as
    "<url>"                       alias for "<url>:latest"
    "<url>:latest"                to remove the latest snapshot of the bin
    "<url>:all"                   to remove the latest snapshot of the bin
    "<url>:<snapshot>"            to remove a single snapshot of the bin
    "<url>:<snapshot>,<snapshot>" to remove multiple snapshots of the bin

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    --token <token>        JSBin access token
    --endpoint <endpoint>  JSBin API endpoint
    --json                 Output result as JSON
```
