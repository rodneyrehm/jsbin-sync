
var path = require('path');
var program = require('commander');
var chalk = require('chalk');

var pkg = require('../package.json');
var synchronizeFiles = require('./index');

program
  .version(pkg.version)
  .description('publish files to JSBin.com')
  .usage('[options] <file ...>')
  // synchronization options
  .option('--css <selector>', 'selector for CSS container, defaults to "#jsbin-css"')
  .option('--js <selector>', 'selector for JS container, defaults to "#jsbin-javascript"')
  .option('--force', 'force upload for unchanged files')
  // output configuration
  .option('--silent', 'Do not output status messages')
  .option('--json', 'output status messages as JSON')
  // service configuration
  .option('--token <token>', 'JSBin Access Token, defaults to env.JSBIN_TOKEN')
  .option('--endpoint <endpoint>', 'JSBin API, defaults to https://jsbin.com/api/')
  .parse(process.argv);

var cwd = process.cwd();
var files = program.args.map(function(file) {
  return path.resolve(cwd, file);
});

var options = {
  css: program.css,
  js: program.js,
  force: program.force,
  token: program.token || process.env.JSBIN_TOKEN,
  endpoint: program.endpoint,
};

synchronizeFiles(files, options)
  .then(handleOutput)
  .catch(handleError);

function handleOutput(map) {
  if (program.silent) {
    return;
  }

  if (program.json) {
    console.log(JSON.stringify(map, null, 2));
    return;
  }

  Object.keys(map).forEach(function(file) {
    var _file = path.relative(cwd, file);
    var state = map[file];
    var colors = {
      'missing': chalk.red,
      'skipped': chalk.yellow,
      'created': chalk.green,
      'modified': chalk.cyan,
      'unmodified': chalk.blue,
    };

    if (state.status === 'missing' || state.status === 'skipped') {
      console.log(
        _file,
        colors[state.status](state.status),
        state.message
      );
    } else {
      console.log(
        _file,
        colors[state.status](state.status),
        'as', chalk.magenta(state.url),
        'at snapshot', chalk.magenta(state.snapshot)
      );
    }
  });
}

function handleError(error) {
  console.error(error.stack);
  process.exit(1);
}
