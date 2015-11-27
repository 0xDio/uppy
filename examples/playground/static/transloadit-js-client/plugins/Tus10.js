(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TransloaditPlugin = (function () {
  // This contains boilerplate that all TransloaditPlugins share - and should not be used
  // directly. It also shows which methods final plugins should implement/override,
  // this deciding on structure.

  function TransloaditPlugin(core, opts) {
    _classCallCheck(this, TransloaditPlugin);

    this.core = core;
    this.opts = opts;
    this.name = this.constructor.name;
  }

  _createClass(TransloaditPlugin, [{
    key: "run",
    value: function run(files) {
      return files;
    }
  }]);

  return TransloaditPlugin;
})();

exports["default"] = TransloaditPlugin;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _TransloaditPlugin2 = require('./TransloaditPlugin');

var _TransloaditPlugin3 = _interopRequireDefault(_TransloaditPlugin2);

var Tus10 = (function (_TransloaditPlugin) {
  _inherits(Tus10, _TransloaditPlugin);

  function Tus10(core, opts) {
    _classCallCheck(this, Tus10);

    _get(Object.getPrototypeOf(Tus10.prototype), 'constructor', this).call(this, core, opts);
    this.type = 'uploader';
  }

  _createClass(Tus10, [{
    key: 'run',
    value: function run(files) {
      this.core.setProgress(this, 0);
      var uploaded = [];
      for (var i in files) {
        var file = files[i];
        this.core.setProgress(this, i * 1 + 1);
        uploaded[i] = file;
        uploaded[i].url = this.opts.endpoint + '/uploaded/' + file.name;
      }
      this.core.setProgress(this, 100);

      return uploaded;
    }
  }]);

  return Tus10;
})(_TransloaditPlugin3['default']);

exports['default'] = Tus10;
module.exports = exports['default'];

},{"./TransloaditPlugin":1}]},{},[2]);
