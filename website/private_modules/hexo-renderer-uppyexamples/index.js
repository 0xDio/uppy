// We listen for hexo changes on *.es6 extensions.
// We fire our own build-examples.js and tell it which example to build -
// that script then writes temporary js files
// which we return via the callback.
var exec             = require('child_process').exec;
var path             = require('path');
var fs               = require('fs');
var webRoot          = path.dirname(path.dirname(__dirname));
var uppyRoot         = path.dirname(webRoot);
var browserifyScript = webRoot + '/build-examples.js'


hexo.extend.renderer.register('es6', 'js', function(data, options, callback) {
  if (!data || !data.path) {
    return callback(null);
  }

  if (!data.path.match(/\/examples\//)) {
    callback(null, data.text);
  }

  var slug    = data.path.replace(/[^a-zA-Z0-9\_\.]/g, '-');
  var dstPath = '/tmp/' + slug + '.js';
  var cmd     = 'node ' + browserifyScript + ' ' + data.path + ' ' + dstPath + ' --colors';
  // hexo.log.i('hexo-renderer-uppyexamples: change detected in examples. running: ' + cmd);
  exec(cmd, function(err, stdout, stderr) {
    if (err) {
      return callback(err);
    }

    hexo.log.i('hexo-renderer-uppyexamples: ' + stdout.trim());

    fs.readFile(dstPath, 'utf-8', function(err, tmpJs) {
      if (err) {
        return callback(err);
      }
      hexo.log.i('hexo-renderer-uppyexamples: read: ' + dstPath);

      callback(null, tmpJs);
    });
  });
});
