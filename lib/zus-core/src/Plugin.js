"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterHooks = filterHooks;
exports["default"] = void 0;

var _logTips = _interopRequireDefault(require("log-tips"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var hooks = ['onError', 'onStateChange', 'onAction', 'onHmr', 'onReducer', 'onEffect', 'extraReducers', 'extraEnhancers', '_handleActions'];

function filterHooks(obj) {
  return Object.keys(obj).reduce(function (memo, key) {
    if (hooks.indexOf(key) > -1) {
      memo[key] = obj[key];
    }

    return memo;
  }, {});
}

var Plugin =
/*#__PURE__*/
function () {
  function Plugin() {
    _classCallCheck(this, Plugin);

    this._handleActions = null;
    this.hooks = hooks.reduce(function (memo, key) {
      memo[key] = [];
      return memo;
    }, {});
  }

  _createClass(Plugin, [{
    key: "use",
    value: function use(plugin) {
      (0, _logTips["default"])((0, _utils.isPlainObject)(plugin), 'plugin.use: plugin should be plain object');
      var hooks = this.hooks;

      for (var key in plugin) {
        if (Object.prototype.hasOwnProperty.call(plugin, key)) {
          (0, _logTips["default"])(hooks[key], "plugin.use: unknown plugin property: ".concat(key));

          if (key === '_handleActions') {
            this._handleActions = plugin[key];
          } else if (key === 'extraEnhancers') {
            hooks[key] = plugin[key];
          } else {
            hooks[key].push(plugin[key]);
          }
        }
      }
    }
  }, {
    key: "apply",
    value: function apply(key, defaultHandler) {
      var hooks = this.hooks;
      var validApplyHooks = ['onError', 'onHmr'];
      (0, _logTips["default"])(validApplyHooks.indexOf(key) > -1, "plugin.apply: hook ".concat(key, " cannot be applied"));
      var fns = hooks[key];
      return function () {
        if (fns.length) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = fns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var fn = _step.value;
              fn.apply(void 0, arguments);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else if (defaultHandler) {
          defaultHandler.apply(void 0, arguments);
        }
      };
    }
  }, {
    key: "get",
    value: function get(key) {
      var hooks = this.hooks;
      (0, _logTips["default"])(key in hooks, "plugin.get: hook ".concat(key, " cannot be got"));

      if (key === 'extraReducers') {
        return getExtraReducers(hooks[key]);
      } else if (key === 'onReducer') {
        return getOnReducer(hooks[key]);
      }

      return hooks[key];
    }
  }]);

  return Plugin;
}();

exports["default"] = Plugin;

function getExtraReducers(hook) {
  var ret = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = hook[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var reducerObj = _step2.value;
      ret = _objectSpread({}, ret, reducerObj);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return ret;
}

function getOnReducer(hook) {
  return function (reducer) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = hook[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var reducerEnhancer = _step3.value;
        reducer = reducerEnhancer(reducer);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return reducer;
  };
}