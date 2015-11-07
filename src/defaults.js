
var defaults = {
  // service configuration
  token: process.env.JSBIN_TOKEN,
  endpoint: process.env.JSBIN_ENDPOINT || 'https://jsbin.com/api/',
  concurrency: 5,
  concurrent: function(value) {
    var val = parseInt(value, 10);
    return val && !isNaN(val) ? val : defaults.concurrency;
  },
  // bin document configuration
  css: '#jsbin-css',
  js: '#jsbin-javascript',
};

function applyDefaults(options) {
  Object.keys(defaults).forEach(function(key) {
    if (options[key] === undefined) {
      options[key] = defaults[key];
    }
  });

  return options;
};

// load default values onto the function object for static access
applyDefaults(applyDefaults);

module.exports = applyDefaults;
