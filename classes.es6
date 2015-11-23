'use strict';

// file: core/Transloadit.js
class Transloadit {
  constructor(opts) {
    // Dictates in what order different plugin types are ran:
    this.types = [ 'presetter', 'selecter', 'uploader' ];

    // Container for different types of plugins
    this.plugins = {};
  }

  use(Plugin, opts) {
    // Instantiate
    var plugin = new Plugin(this, opts);

    // Save in plugin container
    if (!this.plugins[plugin.type]) {
      this.plugins[plugin.type] = [];
    }
    this.plugins[plugin.type].push(plugin);

    return this;
  }

  setProgress(plugin, percentage) {
    // Any plugin can call this via `this.core.setProgress(this, precentage)`
    console.log(plugin.type + ' plugin ' + plugin.name + ' set the progress to ' + percentage);

    return this;
  }

  run() {
    // Walk over plugins in the order as defined by this.types.
    var files = []
    for (var j in this.types) {
      var type = this.types[j];
      // Walk over all plugins of this type, passing & modifying the files array as we go
      for (var i in this.plugins[type]) {
        var plugin = this.plugins[type][i];
        console.log('--> Now running ' + plugin.type + ' plugin ' + plugin.name + ': ');
        files = plugin.run(files);
        console.dir(files);
        console.log('');
      }
    }

    // core.run is the final step and retuns the results (vs every other method, returning `this`)
    // for chainability
    return files;
  }
}

// file: plugins/TransloaditPlugin.js
class TransloaditPlugin {
  // This contains boilerplate that all TransloaditPlugins share - and should not be used
  // directly. It also shows which methods final plugins should implement/override,
  // this deciding on structure.
  constructor(core, opts) {
    this.core = core;
    this.opts = opts;
    this.name = this.constructor.name;
  }

  run(files) {
    return files;
  }
}

// file: presets/TransloaditBasic.js
class TransloaditBasic extends TransloaditPlugin {
  constructor(core, opts) {
    super(core, opts);
    this.type = 'presetter';
    this.core
      .use(DragDrop, {modal: true, wait: true})
      .use(Tus10, {endpoint: 'http://master.tus.io:8080'})
  }
}

// file: plugins/DragDrop.js
class DragDrop extends TransloaditPlugin {
  constructor(core, opts) {
    super(core, opts);
    this.type = 'selecter';
  }

  run(files) {
    this.core.setProgress(this, 0);
    var selected = [ {name: 'lolcat.jpeg'} ]
    this.core.setProgress(this, 100);

    return selected;
  }
}

// file: plugins/Tus10.js
class Tus10 extends TransloaditPlugin {
  constructor(core, opts) {
    super(core, opts);
    this.type = 'uploader';
  }

  run(files) {
    this.core.setProgress(this, 0);
    var uploaded = [];
    for (var i in files) {
      var file = files[i];
      this.core.setProgress(this, (i * 1) + 1);
      uploaded[i]     = file;
      uploaded[i].url = this.opts.endpoint + '/uploaded/' + file.name;
    }
    this.core.setProgress(this, 100);

    return uploaded;
  }
}


// file: ./examples/advanced.js
var transloadit = new Transloadit({wait: false});
var files = transloadit
  .use(DragDrop, {modal: true})
  .use(Tus10, {endpoint: 'http://master.tus.io:8080'})
  .run();

console.log('--> Finished transloadit. Final result: ');
console.dir(files);



// file: ./examples/novice.js
var transloadit = new Transloadit();
var files = transloadit
  .use(TransloaditBasic)
  .run();

var files = transloadit.run();

console.log('--> Finished transloadit. Final result: ');
console.dir(files);

// $ node classes.es6

// This outputs:

// --> Now running presetter plugin TransloaditBasic:
// []
//
// --> Now running selecter plugin DragDrop:
// selecter plugin DragDrop set the progress to 0
// selecter plugin DragDrop set the progress to 100
// [ { name: 'lolcat.jpeg' } ]
//
// --> Now running uploader plugin Tus10:
// uploader plugin Tus10 set the progress to 0
// uploader plugin Tus10 set the progress to 1
// uploader plugin Tus10 set the progress to 100
// [ { name: 'lolcat.jpeg',
//     url: 'http://master.tus.io:8080/uploaded/lolcat.jpeg' } ]
//
// --> Finished transloadit. Final result:
// [ { name: 'lolcat.jpeg',
//     url: 'http://master.tus.io:8080/uploaded/lolcat.jpeg' } ]
