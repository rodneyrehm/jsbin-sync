# JSBin Sync

This is an (unofficial) implementation for synchronizing files to [JSBin.com](https://jsbin.com) via its [API](https://jsbin.com/help/experimental-features#api).

While JSBin currently allows maintaining a bin's content in a [gist](http://jsbin.com/help/import-gists) and [dropbox](http://jsbin.com/help/dropbox), there is no built-in way to maintain documents anywhere else. Using this tool, a bin's content can be maintained *anywhere* (e.g. a git repository) and simply be "deployed" to to JSBin for "production" use.

While two-way synchronization is technically possible, currently only *local file to bin* upload is implemented.


## File Structure

jsbin-sync can upload html files that are structure the following way:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>{{bin_title}}</title>
  <link rel="jsbin" href="{{bin_url}}">
  <style id="jsbin-css">
    {{bin_css_content}}
  </style>
</head>
<body>

<!-- bin HTML content -->

<script id="jsbin-javascript">
  {{bin_javascript_content}}
</script>

</body>
</html>
```

Upon uploading the document to JSBin the following steps are performed:

* The contents of `<link rel="jsbin" href="">` is extracted and the `<link>` element is removed. An existing bin can be referenced by `<link rel="jsbin" href="https://jsbin.com/aabbcc/">`. If the `href` attribute is *empty*, a new bin is created and the document is updated with the URL returned by JSBin. The document is *ignored* if no `<link rel="jsbin">` can be found. The `<link rel="jsbin">` element is removed before upload.
* The contents of the `<title>` element is extracted and used as the *bin's title*.
* The contents of the selector `#example-css` is extracted, indentation is removed and is then used as the *bin's CSS*. The `<style>` element is removed from the document before upload.
* The contents of the selector `#example-js` is extracted, indentation is removed and is then used as the *bin's JavaScript*. The `<script>` element is removed from the document before upload.
* After cleaning superfluous whitespace left after removing `<link rel="jsbin">`, `<style id="example-css">` and `<script id="example-js">`, the remaining document is is used as the *bin's HTML*.
* *Before uploading* a document that already knows its bin URL, the latest bin snapshot is downloaded to test for changes in the document. If no changes are detected, no upload is performed, to avoid creating pointless snapshots.

Except for the added `<link rel="jsbin">` to remember the bin's URL, the described structure pretty much represents what JSBin's download feature produces.


## Usage


## Changelog

### 0.1.0 (November 5th 2015) ###

* initial release


## License

jsbin-sync is published under the [MIT License](http://opensource.org/licenses/mit-license).
