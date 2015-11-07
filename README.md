# JSBin Sync

This is an (unofficial) implementation for synchronizing files to [JSBin.com](https://jsbin.com) via its [API](https://jsbin.com/help/experimental-features#api).

While JSBin currently allows maintaining a bin's content in a [gist](http://jsbin.com/help/import-gists) and [dropbox](http://jsbin.com/help/dropbox), there is no built-in way to maintain documents anywhere else. Using this tool, a bin's content can be maintained *anywhere* (e.g. a git repository) and simply be "deployed" to to JSBin for "production use".

`jsbin-sync` started out as a utility to *upload* local files to JSBin.com, but has since grown into a full featured interface covering upload, download, backup, listing and deleting of bins.


## Documentation

* [JavaScript API](./docs/api.md)
* [Command Line Interface](./docs/cli.md)
* [Upload File Structure](./docs/upload-file-structure.md)


## Changelog

### 0.3.0 (November 7th 2015) ###

* moving `src/sync.js` to `src/upload.js`
* package returning map of functions, rather than `upload`
* moving CLI code to `/bin`
* switching CLI pattern to sub-commands
* adding option `concurrency` to throttle number of parallel requests
* adding command `backup` to download all bins
* adding command `list` to print all known remote bins
* adding command `remove` to delete remote bins

### 0.2.1 (November 6th 2015) ###

* adding shebang to cli.js

### 0.2.0 (November 6th 2015) ###

* changing returned data structure
* adding command line interface

### 0.1.0 (November 5th 2015) ###

* initial release


## License

jsbin-sync is published under the [MIT License](http://opensource.org/licenses/mit-license).
