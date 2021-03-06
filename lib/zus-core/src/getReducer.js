"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getReducer;

var _handleActions = _interopRequireDefault(require("./handleActions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getReducer(reducers, state, handleActions) {
  // Support reducer enhancer
  // e.g. reducers: [realReducers, enhancer]
  if (Array.isArray(reducers)) {
    return reducers[1]((handleActions || _handleActions["default"])(reducers[0], state));
  }

  return (handleActions || _handleActions["default"])(reducers || {}, state);
}