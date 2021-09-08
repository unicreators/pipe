"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._ensureCall = exports._ensure = exports._parseDate = exports._parseNumber = exports._undefined = exports._identity = exports._notNullOrUndefined = exports._isNullOrUndefined = exports._isObject = exports._isBoolean = exports._isDate = exports._isString = exports._isNumber = exports._isFunction = void 0;
////////////
// utils
var _isFunction = function (value) { return typeof value === 'function'; };
exports._isFunction = _isFunction;
var _isNumber = function (value) { return typeof value === 'number'; };
exports._isNumber = _isNumber;
var _isString = function (value) { return typeof value === 'string'; };
exports._isString = _isString;
var _isDate = function (value) { return value instanceof Date && !isNaN(value.getTime()); };
exports._isDate = _isDate;
var _isBoolean = function (value) { return typeof value === 'boolean'; };
exports._isBoolean = _isBoolean;
var _isObject = function (value) { return !exports._isNullOrUndefined(value) && typeof value === 'object' && Array.isArray(value) === false; };
exports._isObject = _isObject;
var _isNullOrUndefined = function (value) { return value === null || value === undefined; };
exports._isNullOrUndefined = _isNullOrUndefined;
var _notNullOrUndefined = function (value) { return value !== null && value !== undefined; };
exports._notNullOrUndefined = _notNullOrUndefined;
var _identity = function (value) { return value; };
exports._identity = _identity;
var _undefined = function (value) { return undefined; };
exports._undefined = _undefined;
var _parseNumber = function (parseFn) { return function (value, def) {
    if (def === void 0) { def = undefined; }
    var _value = parseFn(value);
    return isNaN(_value) ? def : _value;
}; };
exports._parseNumber = _parseNumber;
var _parseDate = function (value, def) {
    if (def === void 0) { def = undefined; }
    var _value = new Date(value);
    return isNaN(_value.getTime()) ? def : _value;
};
exports._parseDate = _parseDate;
var _ensure = function (value, def, validate) {
    if (validate === void 0) { validate = exports._notNullOrUndefined; }
    return validate(value) ? value : def;
};
exports._ensure = _ensure;
var _ensureCall = function (fnOrValue) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return exports._isFunction(fnOrValue) ? fnOrValue.call.apply(fnOrValue, __spreadArray([undefined], args)) : fnOrValue;
};
exports._ensureCall = _ensureCall;
//# sourceMappingURL=utils.js.map