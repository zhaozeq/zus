"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

var _logTips = _interopRequireDefault(require("log-tips"));

var _window = _interopRequireDefault(require("global/window"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = function _default(_ref) {
  var reducers = _ref.reducers,
      initialState = _ref.initialState,
      plugin = _ref.plugin,
      sagaMiddleware = _ref.sagaMiddleware,
      promiseMiddleware = _ref.promiseMiddleware,
      _ref$createOpts$setup = _ref.createOpts.setupMiddlewares,
      setupMiddlewares = _ref$createOpts$setup === void 0 ? _utils.returnSelf : _ref$createOpts$setup;
  // extra enhancers
  var extraEnhancers = plugin.get('extraEnhancers');
  (0, _logTips["default"])((0, _utils.isArray)(extraEnhancers), "[app.start] extraEnhancers should be array, but got ".concat(_typeof(extraEnhancers))); // const extraMiddlewares = plugin.get('onAction') // ===>有问题

  var middlewares = setupMiddlewares([promiseMiddleware, sagaMiddleware // ...extraMiddlewares.flat()
  ]);
  var composeEnhancers = process.env.NODE_ENV !== 'production' && _window["default"].__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? _window["default"].__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : _redux.compose;
  var enhancers = [_redux.applyMiddleware.apply(void 0, _toConsumableArray(middlewares))].concat(_toConsumableArray(extraEnhancers));
  return (0, _redux.createStore)(reducers, initialState, composeEnhancers.apply(void 0, _toConsumableArray(enhancers)));
};

exports["default"] = _default;