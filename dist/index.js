'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var log = require('log-tips');
var log__default = _interopDefault(log);
var reactRedux = require('react-redux');
var redux = require('redux');
var createSagaMiddleware = _interopDefault(require('redux-saga'));
var window = _interopDefault(require('global/window'));
var sagaEffects = require('redux-saga/effects');

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var isArray = Array.isArray.bind(Array);
var isFunction = function isFunction(o) {
  return typeof o === 'function';
};
var returnSelf = function returnSelf(m) {
  return m;
};
var noop = function noop() {};
var findIndex = function findIndex(array, predicate) {
  for (var i = 0, length = array.length; i < length; i += 1) {
    if (predicate(array[i], i)) return i;
  }

  return -1;
};
function isPlainObject(obj) {
  if (_typeof(obj) !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

function checkModel(model, existModels) {
  var namespace = model.namespace,
      reducers = model.reducers,
      effects = model.effects,
      subscriptions = model.subscriptions; // namespace 必须被定义

  log__default(namespace, '[app.model] namespace should be defined'); // 并且是字符串

  log__default(typeof namespace === 'string', "[app.model] namespace should be string, but got ".concat(_typeof(namespace))); // 并且唯一

  log__default(!existModels.some(function (model) {
    return model.namespace === namespace;
  }), '[app.model] namespace should be unique'); // state 可以为任意值
  // reducers 可以为空，PlainObject 或者数组

  if (reducers) {
    log__default(isPlainObject(reducers) || isArray(reducers), "[app.model] reducers should be plain object or array, but got ".concat(_typeof(reducers))); // 数组的 reducers 必须是 [Object, Function] 的格式

    log__default(!isArray(reducers) || isPlainObject(reducers[0]) && isFunction(reducers[1]), '[app.model] reducers with array should be [Object, Function]');
  } // effects 可以为空，PlainObject


  if (effects) {
    log__default(isPlainObject(effects), "[app.model] effects should be plain object, but got ".concat(_typeof(effects)));
  }

  if (subscriptions) {
    // subscriptions 可以为空，PlainObject
    log__default(isPlainObject(subscriptions), "[app.model] subscriptions should be plain object, but got ".concat(_typeof(subscriptions))); // subscription 必须为函数

    log__default(isAllFunction(subscriptions), '[app.model] subscription should be function');
  }
}

function isAllFunction(obj) {
  return Object.keys(obj).every(function (key) {
    return isFunction(obj[key]);
  });
}

/* eslint-disable import/prefer-default-export */
var NAMESPACE_SEP = '/';

function prefix(obj, namespace, type) {
  return Object.keys(obj).reduce(function (memo, key) {
    log__default(key.indexOf("".concat(namespace).concat(NAMESPACE_SEP)) !== 0, "[prefixNamespace]: ".concat(type, " ").concat(key, " should not be prefixed with namespace ").concat(namespace), 'warn');
    var newKey = "".concat(namespace).concat(NAMESPACE_SEP).concat(key);
    memo[newKey] = obj[key];
    return memo;
  }, {});
}

function prefixNamespace(model) {
  var namespace = model.namespace,
      reducers = model.reducers,
      effects = model.effects;

  if (reducers) {
    if (isArray(reducers)) {
      model.reducers[0] = prefix(reducers[0], namespace, 'reducer');
    } else {
      model.reducers = prefix(reducers, namespace, 'reducer');
    }
  }

  if (effects) {
    model.effects = prefix(effects, namespace, 'effect');
  }

  return model;
}

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
      log__default(isPlainObject(plugin), 'plugin.use: plugin should be plain object');
      var hooks = this.hooks;

      for (var key in plugin) {
        if (Object.prototype.hasOwnProperty.call(plugin, key)) {
          log__default(hooks[key], "plugin.use: unknown plugin property: ".concat(key));

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
      log__default(validApplyHooks.indexOf(key) > -1, "plugin.apply: hook ".concat(key, " cannot be applied"));
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
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
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
      log__default(key in hooks, "plugin.get: hook ".concat(key, " cannot be got"));

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
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
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
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
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

var createStore = (function (_ref) {
  var reducers = _ref.reducers,
      initialState = _ref.initialState,
      plugin = _ref.plugin,
      sagaMiddleware = _ref.sagaMiddleware,
      promiseMiddleware = _ref.promiseMiddleware,
      _ref$createOpts$setup = _ref.createOpts.setupMiddlewares,
      setupMiddlewares = _ref$createOpts$setup === void 0 ? returnSelf : _ref$createOpts$setup;
  // extra enhancers
  var extraEnhancers = plugin.get('extraEnhancers');
  log__default(isArray(extraEnhancers), "[app.start] extraEnhancers should be array, but got ".concat(_typeof(extraEnhancers))); // const extraMiddlewares = plugin.get('onAction') // ===>有问题

  var middlewares = setupMiddlewares([promiseMiddleware, sagaMiddleware // ...extraMiddlewares.flat()
  ]);
  var composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : redux.compose;
  var enhancers = [redux.applyMiddleware.apply(void 0, _toConsumableArray(middlewares))].concat(_toConsumableArray(extraEnhancers));
  return redux.createStore(reducers, initialState, composeEnhancers.apply(void 0, _toConsumableArray(enhancers)));
});

function prefixType(type, model) {
  var prefixedType = "".concat(model.namespace).concat(NAMESPACE_SEP).concat(type);
  var typeWithoutAffix = prefixedType.replace(/\/@@[^/]+?$/, '');

  if (model.reducers && model.reducers[typeWithoutAffix] || model.effects && model.effects[typeWithoutAffix]) {
    return prefixedType;
  }

  return type;
}

function getSaga(effects, model, onError, onEffect) {
  return (
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var key;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.t0 = regeneratorRuntime.keys(effects);

            case 1:
              if ((_context3.t1 = _context3.t0()).done) {
                _context3.next = 7;
                break;
              }

              key = _context3.t1.value;

              if (!Object.prototype.hasOwnProperty.call(effects, key)) {
                _context3.next = 5;
                break;
              }

              return _context3.delegateYield(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2() {
                var watcher, task;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        watcher = getWatcher(key, effects[key], model, onError, onEffect);
                        _context2.next = 3;
                        return sagaEffects.fork(watcher);

                      case 3:
                        task = _context2.sent;
                        _context2.next = 6;
                        return sagaEffects.fork(
                        /*#__PURE__*/
                        regeneratorRuntime.mark(function _callee() {
                          return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.next = 2;
                                  return sagaEffects.take("".concat(model.namespace, "/@@CANCEL_EFFECTS"));

                                case 2:
                                  _context.next = 4;
                                  return sagaEffects.cancel(task);

                                case 4:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        }));

                      case 6:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              })(), "t2", 5);

            case 5:
              _context3.next = 1;
              break;

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })
  );
}

function getWatcher(key, _effect, model, onError, onEffect) {
  var _marked =
  /*#__PURE__*/
  regeneratorRuntime.mark(sagaWithCatch);

  var effect = _effect;
  var type = 'takeEvery';
  var ms;

  if (Array.isArray(_effect)) {
    effect = _effect[0];
    var opts = _effect[1];

    if (opts && opts.type) {
      type = opts.type;

      if (type === 'throttle') {
        log__default(opts.ms, 'app.start: opts.ms should be defined if type is throttle');
        ms = opts.ms;
      }
    }

    log__default(['watcher', 'takeEvery', 'takeLatest', 'throttle'].indexOf(type) > -1, 'app.start: effect type should be takeEvery, takeLatest, throttle or watcher');
  }

  function noop() {}

  function sagaWithCatch() {
    var _len,
        args,
        _key,
        _ref,
        _ref$__zus_resolve,
        resolve,
        _ref$__zus_reject,
        reject,
        ret,
        _args4 = arguments;

    return regeneratorRuntime.wrap(function sagaWithCatch$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            for (_len = _args4.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = _args4[_key];
            }

            _ref = args.length > 0 ? args[0] : {}, _ref$__zus_resolve = _ref.__zus_resolve, resolve = _ref$__zus_resolve === void 0 ? noop : _ref$__zus_resolve, _ref$__zus_reject = _ref.__zus_reject, reject = _ref$__zus_reject === void 0 ? noop : _ref$__zus_reject;
            _context4.prev = 2;
            _context4.next = 5;
            return sagaEffects.put({
              type: "".concat(key).concat(NAMESPACE_SEP, "@@start")
            });

          case 5:
            _context4.next = 7;
            return effect.apply(void 0, _toConsumableArray(args.concat(createEffects(model))));

          case 7:
            ret = _context4.sent;
            _context4.next = 10;
            return sagaEffects.put({
              type: "".concat(key).concat(NAMESPACE_SEP, "@@end")
            });

          case 10:
            resolve(ret);
            _context4.next = 17;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](2);
            onError(_context4.t0, {
              key: key,
              effectArgs: args
            });

            if (!_context4.t0._dontReject) {
              reject(_context4.t0);
            }

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _marked, null, [[2, 13]]);
  }

  var sagaWithOnEffect = applyOnEffect(onEffect, sagaWithCatch, model, key);

  switch (type) {
    case 'watcher':
      return sagaWithCatch;

    case 'takeLatest':
      return (
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee4() {
          return regeneratorRuntime.wrap(function _callee4$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return sagaEffects.takeLatest(key, sagaWithOnEffect);

                case 2:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee4);
        })
      );

    case 'throttle':
      return (
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee5() {
          return regeneratorRuntime.wrap(function _callee5$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return sagaEffects.throttle(ms, key, sagaWithOnEffect);

                case 2:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee5);
        })
      );

    default:
      return (
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee6() {
          return regeneratorRuntime.wrap(function _callee6$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return sagaEffects.takeEvery(key, sagaWithOnEffect);

                case 2:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee6);
        })
      );
  }
}

function createEffects(model) {
  function assertAction(type, name) {
    log__default(type, 'dispatch: action should be a plain Object with type');
    log__default(type.indexOf("".concat(model.namespace).concat(NAMESPACE_SEP)) !== 0, "[".concat(name, "] ").concat(type, " should not be prefixed with namespace ").concat(model.namespace), 'warn');
  }

  function put(action) {
    var type = action.type;
    assertAction(type, 'sagaEffects.put');
    return sagaEffects.put(_objectSpread({}, action, {
      type: prefixType(type, model)
    }));
  } // The operator `put` doesn't block waiting the returned promise to resolve.
  // Using `put.resolve` will wait until the promsie resolve/reject before resuming.
  // It will be helpful to organize multi-effects in order,
  // and increase the reusability by seperate the effect in stand-alone pieces.
  // https://github.com/redux-saga/redux-saga/issues/336


  function putResolve(action) {
    var type = action.type;
    assertAction(type, 'sagaEffects.put.resolve');
    return sagaEffects.put.resolve(_objectSpread({}, action, {
      type: prefixType(type, model)
    }));
  }

  put.resolve = putResolve;

  function take(type) {
    if (typeof type === 'string') {
      assertAction(type, 'sagaEffects.take');
      return sagaEffects.take(prefixType(type, model));
    } else if (Array.isArray(type)) {
      return sagaEffects.take(type.map(function (t) {
        if (typeof t === 'string') {
          assertAction(t, 'sagaEffects.take');
          return prefixType(t, model);
        }

        return t;
      }));
    }

    return sagaEffects.take(type);
  }

  return _objectSpread({}, sagaEffects, {
    put: put,
    take: take
  });
}

function applyOnEffect(fns, effect, model, key) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var fn = _step.value;
      effect = fn(effect, sagaEffects, model, key);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return effect;
}

function identify(value) {
  return value;
}

function handleAction(actionType) {
  var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identify;
  return function (state, action) {
    var type = action.type;
    log__default(type, 'dispatch: action should be a plain Object with type');

    if (actionType === type) {
      return reducer(state, action);
    }

    return state;
  };
}

function reduceReducers() {
  for (var _len = arguments.length, reducers = new Array(_len), _key = 0; _key < _len; _key++) {
    reducers[_key] = arguments[_key];
  }

  return function (previous, current) {
    return reducers.reduce(function (p, r) {
      return r(p, current);
    }, previous);
  };
}

function handleActions(handlers, defaultState) {
  var reducers = Object.keys(handlers).map(function (type) {
    return handleAction(type, handlers[type]);
  });
  var reducer = reduceReducers.apply(void 0, _toConsumableArray(reducers));
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    return reducer(state, action);
  };
}

function getReducer(reducers, state, handleActions$1) {
  // Support reducer enhancer
  // e.g. reducers: [realReducers, enhancer]
  if (Array.isArray(reducers)) {
    return reducers[1]((handleActions$1 || handleActions)(reducers[0], state));
  }

  return (handleActions$1 || handleActions)(reducers || {}, state);
}

function createPromiseMiddleware(app) {
  return function () {
    return function (next) {
      return function (action) {
        var type = action.type;

        if (isEffect(type)) {
          return new Promise(function (resolve, reject) {
            next(_objectSpread({
              __zus_resolve: resolve,
              __zus_reject: reject
            }, action));
          });
        }

        return next(action);
      };
    };
  };

  function isEffect(type) {
    if (!type || typeof type !== 'string') return false;

    var _type$split = type.split(NAMESPACE_SEP),
        _type$split2 = _slicedToArray(_type$split, 1),
        namespace = _type$split2[0];

    var model = app._models.filter(function (m) {
      return m.namespace === namespace;
    })[0];

    if (model) {
      if (model.effects && model.effects[type]) {
        return true;
      }
    }

    return false;
  }
}

function prefixedDispatch(dispatch, model) {
  return function (action) {
    var type = action.type;
    log__default(type, 'dispatch: action should be a plain Object with type');
    log__default(type.indexOf("".concat(model.namespace).concat(NAMESPACE_SEP)) !== 0, "dispatch: ".concat(type, " should not be prefixed with namespace ").concat(model.namespace), 'warn');
    return dispatch(_objectSpread({}, action, {
      type: prefixType(type, model)
    }));
  };
}

function run(subs, model, app, onError) {
  var funcs = [];
  var nonFuncs = [];

  for (var key in subs) {
    if (Object.prototype.hasOwnProperty.call(subs, key)) {
      var sub = subs[key];
      var unlistener = sub({
        dispatch: prefixedDispatch(app._store.dispatch, model),
        history: app._history
      }, onError);

      if (isFunction(unlistener)) {
        funcs.push(unlistener);
      } else {
        nonFuncs.push(key);
      }
    }
  }

  return {
    funcs: funcs,
    nonFuncs: nonFuncs
  };
}
function unlisten(unlisteners, namespace) {
  if (!unlisteners[namespace]) return;
  var _unlisteners$namespac = unlisteners[namespace],
      funcs = _unlisteners$namespac.funcs,
      nonFuncs = _unlisteners$namespac.nonFuncs;
  log__default(nonFuncs.length === 0, "[app.unmodel] subscription should return unlistener function, check these subscriptions ".concat(nonFuncs.join(', ')), 'warn');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = funcs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var unlistener = _step.value;
      unlistener();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  delete unlisteners[namespace];
}

var zusModel = {
  namespace: '@zus',
  state: 0,
  reducers: {
    UPDATE: function UPDATE(state) {
      return state + 1;
    }
  }
  /**
   * Create dva-core instance.
   *
   * @param hooksAndOpts
   * @param createOpts
   */

};
function create() {
  var hooksAndOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var createOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // 解析了createOpts => initialReducer/set upApp
  var initialReducer = createOpts.initialReducer,
      _createOpts$setupApp = createOpts.setupApp,
      setupApp = _createOpts$setupApp === void 0 ? noop : _createOpts$setupApp;
  var plugin = new Plugin();
  plugin.use(filterHooks(hooksAndOpts)); // 在定义的hooks中加入全局的配置

  var app = {
    _models: [prefixNamespace(_objectSpread({}, zusModel))],
    _store: null,
    _plugin: plugin,
    use: plugin.use.bind(plugin),
    model: model,
    start: start
  };
  return app;
  /**
   * Register model before app is started.
   *
   * @param m {Object} model to register
   */

  function model(m) {
    if (process.env.NODE_ENV !== 'production') {
      checkModel(m, app._models);
    }

    var prefixedModel = prefixNamespace(_objectSpread({}, m));

    app._models.push(prefixedModel);

    return prefixedModel;
  }
  /**
   * Inject model after app is started.
   *
   * @param createReducer
   * @param onError
   * @param unlisteners
   * @param m
   */


  function injectModel(createReducer, onError, unlisteners, m) {
    m = model(m);
    var store = app._store;
    store.asyncReducers[m.namespace] = getReducer(m.reducers, m.state, plugin._handleActions);
    store.replaceReducer(createReducer());

    if (m.effects) {
      store.runSaga(app._getSaga(m.effects, m, onError, plugin.get('onEffect')));
    }

    if (m.subscriptions) {
      unlisteners[m.namespace] = run(m.subscriptions, m, app, onError);
    }
  }
  /**
   * Unregister model.
   *
   * @param createReducer
   * @param reducers
   * @param unlisteners
   * @param namespace
   *
   * Unexpected key warn problem:
   * https://github.com/reactjs/redux/issues/1636
   */


  function unmodel(createReducer, reducers, unlisteners, namespace) {
    var store = app._store; // Delete reducers

    delete store.asyncReducers[namespace];
    delete reducers[namespace];
    store.replaceReducer(createReducer());
    store.dispatch({
      type: '@@dva/UPDATE'
    }); // Cancel effects

    store.dispatch({
      type: "".concat(namespace, "/@@CANCEL_EFFECTS")
    }); // Unlisten subscrioptions

    unlisten(unlisteners, namespace); // Delete model from app._models

    app._models = app._models.filter(function (_model) {
      return _model.namespace !== namespace;
    });
  }
  /**
   * Replace a model if it exsits, if not, add it to app
   * Attention:
   * - Only available after dva.start gets called
   * - Will not check origin m is strict equal to the new one
   * Useful for HMR
   * @param createReducer
   * @param reducers
   * @param unlisteners
   * @param onError
   * @param m
   */


  function replaceModel(createReducer, reducers, unlisteners, onError, m) {
    var store = app._store;
    var namespace = m.namespace;
    var oldModelIdx = findIndex(app._models, function (model) {
      return model.namespace === namespace;
    });

    if (oldModelIdx !== -1) {
      // Cancel effects
      store.dispatch({
        type: "".concat(namespace, "/@@CANCEL_EFFECTS")
      }); // Delete reducers

      delete store.asyncReducers[namespace];
      delete reducers[namespace]; // Unlisten subscrioptions

      unlisten(unlisteners, namespace); // Delete model from app._models

      app._models.splice(oldModelIdx, 1);
    } // add new version model to store


    app.model(m);
    store.dispatch({
      type: '@@dva/UPDATE'
    });
  }
  /**
   * Start the app.
   *
   * @returns void
   */


  function start() {
    var onError = function onError(err, extension) {
      if (err) {
        if (typeof err === 'string') err = new Error(err);

        err.preventDefault = function () {
          err._dontReject = true;
        };

        plugin.apply('onError', function (_err) {
          throw new Error(_err.stack || _err);
        })(err, app._store.dispatch, extension);
      }
    };

    var sagaMiddleware = createSagaMiddleware(); // saga 中间件

    var promiseMiddleware = createPromiseMiddleware(app); //

    app._getSaga = getSaga.bind(null);
    var sagas = [];

    var reducers = _objectSpread({}, initialReducer);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = app._models[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var m = _step.value;
        reducers[m.namespace] = getReducer(m.reducers, m.state, plugin._handleActions);
        if (m.effects) sagas.push(app._getSaga(m.effects, m, onError, plugin.get('onEffect')));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var reducerEnhancer = plugin.get('onReducer');
    var extraReducers = plugin.get('extraReducers');
    log__default(Object.keys(extraReducers).every(function (key) {
      return !(key in reducers);
    }), "[app.start] extraReducers is conflict with other reducers, reducers list: ".concat(Object.keys(reducers).join(', '))); // Create store

    var store = createStore({
      reducers: createReducer(),
      initialState: hooksAndOpts.initialState || {},
      plugin: plugin,
      createOpts: createOpts,
      sagaMiddleware: sagaMiddleware,
      promiseMiddleware: promiseMiddleware
    });
    app._store = store; // Extend store

    store.runSaga = sagaMiddleware.run;
    store.asyncReducers = {}; // Execute listeners when state is changed

    var listeners = plugin.get('onStateChange');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      var _loop = function _loop() {
        var listener = _step2.value;
        store.subscribe(function () {
          listener(store.getState());
        });
      };

      for (var _iterator2 = listeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        _loop();
      } // Run sagas

    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    sagas.forEach(sagaMiddleware.run); // Setup app => 加入路由改变监听

    setupApp(app); // Run subscriptions

    var unlisteners = {};
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this._models[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _model2 = _step3.value;

        if (_model2.subscriptions) {
          unlisteners[_model2.namespace] = run(_model2.subscriptions, _model2, app, onError);
        }
      } // Setup app.model and app.unmodel

    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    app.model = injectModel.bind(app, createReducer, onError, unlisteners);
    app.unmodel = unmodel.bind(app, createReducer, reducers, unlisteners);
    app.replaceModel = replaceModel.bind(app, createReducer, reducers, unlisteners, onError);
    /**
     * Create global reducer for redux.
     *
     * @returns {Object}
     */

    function createReducer() {
      return reducerEnhancer(redux.combineReducers(_objectSpread({}, reducers, extraReducers, app._store ? app._store.asyncReducers : {})));
    }
  }
}

function zus() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var app = create(opts, {});
  var oldAppStart = app.start;
  app.router = router;
  app.start = start;
  return app;

  function router(_router) {
    log__default(log.isFn(_router), "[app.router] router should be function, but got ".concat(_typeof(_router)));
    app._router = _router;
  }

  function start(container) {
    // 允许 container 是字符串，然后用 querySelector 找元素
    if (log.isString(container)) {
      container = document.querySelector(container);
      log__default(container, "[app.start] container ".concat(container, " not found"));
    } // 并且是 HTMLElement


    log__default(!container || log.isNode(container), '[app.start] container should be HTMLElement'); // 路由必须提前注册

    log__default(app._router, '[app.start] router must be registered before app.start()');

    if (!app._store) {
      oldAppStart.call(app);
    }

    var store = app._store;
    app._getProvider = getProvider.bind(null, store, app); // If has container, render; else, return react component

    if (container) {
      render(container, store, app, app._router);

      app._plugin.apply('onHmr')(render.bind(null, container, store, app));

      return false;
    }

    return getProvider(store, this, this._router);
  }
}

function getProvider(store, app, router) {
  var DvaRoot = function DvaRoot(extraProps) {
    return React.createElement(reactRedux.Provider, {
      store: store
    }, router(_objectSpread({
      app: app,
      history: app._history
    }, extraProps)));
  };

  return DvaRoot;
}

function render(container, store, app, router) {
  var ReactDOM = require('react-dom'); // eslint-disable-line


  ReactDOM.render(React.createElement(getProvider(store, app, router)), container);
}

module.exports = zus;