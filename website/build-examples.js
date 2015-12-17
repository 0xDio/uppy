/**
 * build-examples.js
 * --------
 * Searches for each example's `src/js/app.js` file.
 * Creates a new watchify instance for each `app.js`.
 * Changes to Uppy's source will trigger rebundling.
 *
 * Note:
 * Since each example is dependent on Uppy's source,
 * changing one source file causes the 'file changed'
 * notification to fire multiple times. To stop this,
 * files are added to a 'muted' array that is checked
 * before announcing a changed file.  It's removed from
 * the array when it has been bundled.
 */
var createStream = require('fs').createWriteStream;
var glob = require('multi-glob').glob;
var chalk = require('chalk');
var path = require('path');
var notifier = require('node-notifier');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');

var webRoot = __dirname;
var uppyRoot = path.dirname(webRoot);

var srcPattern = webRoot + '/src/examples/**/js/app.js';
var dstPattern = webRoot + '/public/examples/**/js/app.js';

var watchifyEnabled = process.argv[2] === 'watch';
var browserifyPlugins = [];
if (watchifyEnabled) {
  browserifyPlugins.push(watchify);
}

// Find each app.js file with glob.
glob(srcPattern, function(err, files) {
  if (err) throw new Error(err);

  console.log('--> Watching examples..');
  console.log('--> Pre-building ' + files.length + ' files..')

  var muted = [];

  // Create a new watchify instance for each file.
  files.forEach(function(file) {
    var browseFy = browserify(file, {
      cache       : {},
      packageCache: {},
      plugin      : browserifyPlugins
    })

    // Aliasing for using `require('uppy')`, etc.
    browseFy
      .require(uppyRoot + '/src/index.js', { expose: 'uppy' })
      .require(uppyRoot + '/src/core/index.js', { expose: 'uppy/core' })
      .require(uppyRoot + '/src/plugins/index.js', { expose: 'uppy/plugins' })
      .transform(babelify);

    // Listeners for changes, errors, and completion.
    browseFy
      .on('update', bundle)
      .on('error', onError)
      .on('log', function(msg) {

      })
      .on('file', function(file, id, parent) {
        // When file completes, unmute it.
        muted = muted.filter(function(mutedId) {
          return id !== mutedId;
        });
      });

    // Call bundle() manually to start watch processes.
    bundle();

    /**
     * Creates bundle and writes it to static and public folders.
     * Changes to
     * @param  {[type]} ids [description]
     * @return {[type]}     [description]
     */
    function bundle(ids) {
      ids = ids || [];
      ids.forEach(function(id) {
        if (!isMuted(id, muted)) {
          console.info(chalk.cyan('change:'), id);
          muted.push(id);
        }
      });

      var exampleName = path.dirname(path.dirname(file));
      var output      = file.replace('**', exampleName);

      console.log('output: '+output);

      var bundle = browseFy.bundle()
        .on('error', onError)
        .on('file', onFile)

      bundle.pipe(createStream(output));
      // bundle.pipe(createStream(output.replace('src', 'public')));
    }
  });
});

/**
 * Logs to console and shows desktop notification on error.
 * Calls `this.emit(end)` to stop bundling.
 * @param  {object} err Error object
 */
function onError(err) {
  console.error(chalk.red('✗ error:'), chalk.red(err.message));
  notifier.notify({
    'title': 'Build failed:',
    'message': err.message
  })
  this.emit('end');
}

function onFile(file, id, parent) {
  var msg = id + '-' + parent;
  console.info(chalk.green('✓ done:'), chalk.green(file), chalk.gray.dim('(' + msg + ')'));
}

/**
 * Checks if a file has been added to muted list.
 * This stops single changes from logging multiple times.
 * @param  {string}  id   Name of changed file
 * @param  {Array<string>}  list Muted files array
 * @return {Boolean}      True if file is muted
 */
function isMuted(id, list) {
  return list.reduce(function(prev, curr) {
    return prev || (curr === id);
  }, false);
}
