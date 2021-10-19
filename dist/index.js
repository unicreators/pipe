"use strict";
// Copyright (c) 2021 yichen <d.unicreators@gmail.com>. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regex = exports.array = exports.boolean = exports.date = exports.float = exports.int = exports.string = exports.def = exports.includes = exports.maxLength = exports.minLength = exports.max = exports.min = exports.invalid = exports.tap = exports.required = exports.throwError = exports.project = exports.path = exports.all = exports.any = exports.forward = exports.pipe = exports.defaults = exports.behaviors = void 0;
/// yichen <d.unicreators@gmail.com>
///
var utils_1 = require("./utils");
;
;
/**
 * 内建行为
 *
 */
exports.behaviors = {
    Forward: function (_a) {
        var currentValue = _a.currentValue, prevValue = _a.prevValue, handlerIndex = _a.handlerIndex;
        return ({
            value: currentValue,
            next: true
        });
    },
    BreakOnNotNullOrUndefinedValue: function (_a) {
        var currentValue = _a.currentValue, prevValue = _a.prevValue, handlerIndex = _a.handlerIndex;
        var hasValue = !utils_1._isNullOrUndefined(currentValue);
        return ({
            value: hasValue ? currentValue : prevValue,
            next: !hasValue
        });
    },
    BreakOnNullOrUndefinedValue: function (_a) {
        var currentValue = _a.currentValue, prevValue = _a.prevValue, handlerIndex = _a.handlerIndex;
        var hasValue = !utils_1._isNullOrUndefined(currentValue);
        return ({
            value: currentValue,
            next: hasValue
        });
    }
};
/**
 * 缺省配置
 *
 * */
exports.defaults = {
    string: { trim: true },
    int: { tryConvert: false },
    float: { tryConvert: false },
    boolean: { tryConvert: true },
    date: { tryConvert: false },
    array: { tryConvert: false, removeNullOrUndefined: false },
    pipe: { behavior: exports.behaviors.BreakOnNullOrUndefinedValue }
};
/**
 * 组合处理函数
 *
 *
 * @template T
 *
 * @template R
 *
 * @param {({ behavior?: BehaviorFunc } | Func<T, R>)} [optsOrHanlderFn]
 * 设置项或{@link Func 处理函数}，当 {@link optsOrHanlderFn} 为 {@link Func 处理函数} 时，视为 {@link handlers} 成员项
 * 否则视为设置项
 *
 * @param {boolean} [optsOrHanlderFn.behavior]
 * 行为函数，用于控制{@link Func 处理函数}执行行为
 *
 * @param {...Array<Func<T, R>>} handlers
 * 处理函数集合
 *
 * @return {Func<T, R>}
 * 处理函数
 *
 * @example
 * ```ts
 * let result = pipe()(8);
 * expect(result).equal(8);
 *
 * result = pipe({ behavior: behaviors.Forward }, int(), def(2))('8');
 * expect(result).equal(2);
 *
 * result = pipe<any, any>({ behavior: behaviors.BreakOnNotNullOrUndefinedValue }, int(), string(), def(2))('8');
 * expect(result).equal('8');
 *
 * // custom behavior
 * result = pipe({
 *     behavior: ({ currentValue, prevValue, handlerIndex }): { value?: any, next?: boolean } => {
 *         return ({
 *             next: handlerIndex < 1,
 *             value: currentValue
 *         });
 *     }
 * }, int(), min(2), max(10))(12);
 * expect(result).equal(12);
 *
 * result = pipe(int(), min(2), max(10))(8);
 * expect(result).equal(8);
 *
 * result = pipe(int(), min(2), max(10))(11);
 * expect(result).to.be.undefined;
 *
 * // group
 * let range = pipe(min(2), max(10));
 * result = pipe(int(), range)(8);
 * expect(result).equal(8);
 * ```
 */
var pipe = function (optsOrHanlderFn) {
    var handlers = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        handlers[_i - 1] = arguments[_i];
    }
    var _behaviorFn = exports.defaults.pipe.behavior, _handlers = handlers.filter(utils_1._isFunction);
    if (utils_1._isFunction(optsOrHanlderFn))
        _handlers.unshift(optsOrHanlderFn);
    else if (utils_1._isFunction(optsOrHanlderFn === null || optsOrHanlderFn === void 0 ? void 0 : optsOrHanlderFn.behavior) || utils_1._isNullOrUndefined(_behaviorFn))
        _behaviorFn = (optsOrHanlderFn === null || optsOrHanlderFn === void 0 ? void 0 : optsOrHanlderFn.behavior) || exports.behaviors.BreakOnNullOrUndefinedValue;
    switch (_handlers.length) {
        case 0: return utils_1._identity;
        case 1: return _handlers[0];
        default: return function (value) {
            var result = { value: value };
            for (var index = 0; index < _handlers.length; index++) {
                result = _exec(_handlers[index], index, result === null || result === void 0 ? void 0 : result.value, _behaviorFn);
                if (!(result === null || result === void 0 ? void 0 : result.next))
                    break;
            }
            return result.value;
        };
    }
};
exports.pipe = pipe;
/**
 * 组合处理函数
 * - 从左向右执行{@link Func 处理函数}
 * - 组合内{@link Func 处理函数}的输入值为上一个{@link Func 处理函数}的输出值
 * - 所有{@link Func 处理函数}逐个执行直至全部执行完毕
 *
 * @template T
 *
 * @template R
 *
 * @param {...Array<Func<T, R>>} handlers
 * {@link Func 处理函数}集合
 *
 * @return {Func<T, R>}
 * 处理函数
 *
 * @example
 * ```ts
 * let result = forward(int(), def(2), (v) => v + 2)('8');
 * expect(result).equal(4);
 *
 * result = forward(int(), def(2), (v) => v + 2)(8);
 * expect(result).equal(10);
 *
 * result = forward(int(), def(2), (v) => undefined)(8);
 * expect(result).to.be.undefined;
 * ```
 */
var forward = function () {
    var handlers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        handlers[_i] = arguments[_i];
    }
    return exports.pipe.apply(void 0, __spreadArray([{ behavior: exports.behaviors.Forward }], handlers));
};
exports.forward = forward;
/**
 * 组合处理函数
 * - 从左向右执行{@link Func 处理函数}
 * - 组合内{@link Func 处理函数}的输入值各自独立
 * - 任一{@link Func 处理函数}执行结果非`null`或`undefined`时中断并返回结果值
 *
 * @template T
 *
 * @template R
 *
 * @param {...Array<Func<T, R>>} handlers
 * {@link Func 处理函数}集合
 *
 * @return {Func<T, R>}
 * 处理函数
 *
 * @example
 * ```ts
 * let result = any<any, any>(int(), (v) => `#${v}`)('8');
 * expect(result).equal('#8');
 * ```
 */
var any = function () {
    var handlers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        handlers[_i] = arguments[_i];
    }
    return exports.pipe.apply(void 0, __spreadArray([{ behavior: exports.behaviors.BreakOnNotNullOrUndefinedValue }], handlers));
};
exports.any = any;
/**
 * 组合处理函数
 * - 从左向右执行{@link Func 处理函数}
 * - 组合内{@link Func 处理函数}的输入值为上一个{@link Func 处理函数}的输出值
 * - 任一{@link Func 处理函数}执行结果`null`或`undefined`时中断并返回结果值，否则全部{@link Func 处理函数}执行完毕返回结果值
 *
 * @template T
 *
 * @template R
 *
 * @param {...Array<Func<T, R>>} handlers
 * {@link Func 处理函数}集合
 *
 * @return {Func<T, R>}
 * 处理函数
 *
 * @example
 * ```ts
 * let result = all(int(), min(1))(8);
 * expect(result).equal(8);
 *
 * result = all(int(), min(1), max(6))(8);
 * expect(result).to.be.undefined;
 * ```
 */
var all = function () {
    var handlers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        handlers[_i] = arguments[_i];
    }
    return exports.pipe.apply(void 0, __spreadArray([{ behavior: exports.behaviors.BreakOnNullOrUndefinedValue }], handlers));
};
exports.all = all;
var _build = function (validateFn, tryConvertFn, handleFn) {
    var _convertFn = utils_1._ensure(tryConvertFn, utils_1._undefined, utils_1._isFunction), _handleFn = utils_1._ensure(handleFn, utils_1._identity, utils_1._isFunction);
    return function (value) {
        var _value = validateFn(value) ? value : _convertFn(value);
        return utils_1._isNullOrUndefined(_value) ? _value : _handleFn(_value);
    };
};
var _exec = function (handler, handlerIndex, prevValue, behavior) {
    var value = handler(prevValue);
    return behavior({
        currentValue: value,
        prevValue: prevValue,
        handlerIndex: handlerIndex
    });
};
/**
 * 构建提取路径值处理函数
 *
 * @param {...Array<string>} paths
 * 路径
 *
 * @return {Func}
 *
 * @example
 * ```ts
 * let result = path('a')({ a: 1 });
 * expect(result).equal(1);
 *
 * result = path('a', 'aa', 'aaa')({ a: { aa: { aaa: 1 } } });
 * expect(result).equal(1);
 *
 * result = path('bb')({ a: 1 });
 * expect(result).to.be.undefined;
 *
 * result = path('bb', 'x')({ a: 1 });
 * expect(result).to.be.undefined;
 * ```
 */
var path = function () {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return function (value) {
        var _value = value, index = 0;
        while (index < paths.length) {
            if (utils_1._isNullOrUndefined(_value))
                return undefined;
            _value = _value[paths[index++]];
        }
        return _value;
    };
};
exports.path = path;
/**
 * 构建投影处理函数
 *
 * @param {{ [key: string]: DependFunc }} map
 * 映射
 *
 * @return {Func<object, object>}
 *
 * @example
 * ```ts
 * let result = project({
 *     a: path('prop1'),
 *     b: pipe(path('b'), int()),
 *     c: pipe(path('prop3'), int()),
 *     d: forward(path('prop6'), pipe(int(), min(8)), def(1)),
 *     e: { fn: pipe(path('prop7', 'prop8'), int()), on: (processed) => processed.a == 2 }
 * })({ prop1: 1, prop2: 's', prop3: 'v', b: 2, prop6: 6, prop7: { prop8: 100 } });
 * expect(result).deep.equal({
 *     a: 1,
 *     b: 2,
 *     c: undefined,
 *     d: 1,
 *     e: undefined
 * });
 *
 * result = project({})({ a: 1 });
 * expect(result).deep.equal({});
 *
 * result = project({})(undefined);
 * expect(result).deep.equal({});
 * ```
 */
var project = function (map) {
    var keys = Object.keys(map || {}), _items = [], _children = [];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i], item = map[key];
        if (utils_1._isFunction(item))
            item = { fn: item };
        var _a = (item || {}), fn = _a.fn, on = _a.on;
        if (!utils_1._isFunction(on)) {
            _items.push([key, fn]);
            continue;
        }
        _children.push([key, fn, on]);
    }
    return function (value) {
        var processed = _items.reduce(function (r, _a) {
            var prop = _a[0], fn = _a[1];
            r[prop] = fn(value);
            return r;
        }, {});
        return Object.assign(processed, _children.reduce(function (r, _a) {
            var prop = _a[0], fn = _a[1], on = _a[2];
            r[prop] = on(processed, value) ? fn(value) : undefined;
            return r;
        }, {}));
    };
};
exports.project = project;
/**
 * 构建值检查处理函数
 * 当 {@link match} 函数返回 `true` 时，则抛出 {@link errorOrErrorFn} 构建的异常
 *
 * @template T
 * 输入类型
 *
 * @template R
 * 输出类型
 *
 * @param {Func | any} errorOrErrorFn
 * 异常值或构建异常的函数
 *
 * @param {Func<T, boolean>} [match]
 * 匹配函数，当此函数返回 `true` 时，则抛出 {@link errorOrErrorFn} 构建的异常
 *
 * @return {Func<T, R>}
 *
 * @example
 * ```ts
 * let error = new Error();
 * let fn = throwError(error, value => value === 1);
 * expect(() => fn(1)).throw(error);
 * expect(fn(2)).equal(2);
 *
 * fn = forward(int(), throwError(error, value => value === 1));
 * expect(() => fn(1)).throw(error);
 *
 * fn = forward(int(), throwError(error))
 * expect(() => fn('s')).throw(error);
 * expect(fn(1)).equal(1);
 * ```
 */
var throwError = function (errorOrErrorFn, match) {
    if (match === void 0) { match = utils_1._isNullOrUndefined; }
    return function (value) {
        if (match(value))
            throw utils_1._ensureCall(errorOrErrorFn, value);
        return value;
    };
};
exports.throwError = throwError;
/**
 * 构建`null`或`undefined`值检查处理函数
 * 当处理值为`null`或`undefined`时，则抛出 {@link errorOrErrorFn} 构建的异常
 *
 * @template T
 * 输入类型
 *
 * @template R
 * 输出类型
 *
 * @param {(Func | any)} errorOrErrorFn
 * 异常值或构建异常的函数
 *
 * @return {Func<T, R>}
 *
 * @example
 * ```ts
 * let error = new Error();
 * // required = throwError(..., isNullOrUnedfined)
 * let fn = forward(int(), required(error))
 * expect(() => fn('s')).throw(error);
 * expect(fn(1)).equal(1);
 * ```
 */
var required = function (errorOrErrorFn) { return exports.throwError(errorOrErrorFn); };
exports.required = required;
/**
* 构建值处理窃听函数
* 窃听 {@link handler} 的输入输出值
*
* @template T
* 输入类型
*
* @template R
* 输出类型
*
* @param {Func} handler
* 值处理函数
*
* @param {(input: T, output: R) => void} tapFn
* 窃听函数，窃听 {@link handler} 的输入输出值
*
* @return {Func<T, R>}
*
* @example
* ```ts
* let input, output;
* tap(int(), (_input, _output) => {
*     input = _input; output = _output;
* })(1);
* expect(input).equal(1);
* expect(output).equal(1);
*
* tap(int(), (_input, _output) => {
*     input = _input; output = _output;
* })('s');
* expect(input).equal('s');
* expect(output).equal(undefined);
*
* tap(def(4), (_input, _output) => {
*     input = _input; output = _output;
* })(undefined);
* expect(input).equal(undefined);
* expect(output).equal(4);
*
* tap(pipe(int(), min(1), max(8)), (_input, _output) => {
*     input = _input; output = _output;
* })(9);
* expect(input).equal(9);
* expect(output).equal(undefined);
* ```
*/
var tap = function (handler, tapFn) {
    return function (value) {
        var input = value, output = handler(value);
        tapFn(input, output);
        return output;
    };
};
exports.tap = tap;
/**
 * 构建无效值窃听函数
 * 当 {@link handler} 的输入值为非`null`或`undefined`，输出值为`undefined`时，视为此值为无效值
 *
 * @template T
 * 输入类型
 *
 * @template R
 * 输出类型
 *
 * @param {Func} handler
 * 值处理函数
 *
 * @param {(value: T) => void} invalidFn
 * 当值被 {@link handler} 视为无效值时执行的函数
 *
 * @param {{emptyStringAsNull?: boolean}} [opts]
 *
 * @param {boolean} [opts.emptyStringAsNull] 是否将空字符串的输入值视为`null`，默认为`false`
 *
 * @return {Func<T, R>}
 *
 * @example
 * ```ts
 * let value = undefined;
 * invalid(int(), (_value) => {
 *     // no call
 *     value = _value;
 * })(1);
 * expect(value).equal(undefined);
 *
 * value = undefined;
 * invalid(int(), (_value) => {
 *     value = _value;
 * })('s');
 * expect(value).equal('s');
 *
 * value = undefined;
 * invalid(pipe(int(), min(1), max(8)), (_value) => {
 *     value = _value;
 * })(9);
 * expect(value).equal(9);
 *
 * value = undefined;
 * invalid(pipe(string(), minLength(1)), (_value) => {
 *     value = _value;
 * }, { emptyStringAsNull: false })('');
 * expect(value).equal('');
 *
 * value = undefined;
 * invalid(pipe(string(), minLength(1)), (_value) => {
 *     // no call
 *     value = _value;
 * }, { emptyStringAsNull: true })('');
 * expect(value).equal(undefined);
 * ```
 */
var invalid = function (handler, invalidFn, opts) {
    return exports.tap(handler, function (input, output) {
        if (utils_1._isNullOrUndefined(input))
            return;
        if ((opts === null || opts === void 0 ? void 0 : opts.emptyStringAsNull) && (input === ''))
            return;
        if (utils_1._isNullOrUndefined(output))
            invalidFn(input);
    });
};
exports.invalid = invalid;
/**
 * 构建限制最小值处理函数
 * 当值小于限制最小值 {@link minValue} 时将输出 `undefined`，否则输出原值
 *
 * @template T
 *
 * @param {T} minValue
 * 限制最小值
 *
 * @return {Func<T, T>}
 *
 * @example
 * ```ts
 * let result = min(10)(14);
 * expect(result).equal(14)
 *
 * result = min(10)(9);
 * expect(result).to.be.undefined;
 * ```
 */
var min = function (minValue) {
    return _build(function (value) { return value >= minValue; });
};
exports.min = min;
/**
 * 构建限制最大值处理函数
 * 当值大于限制最大值 {@link maxValue} 时将输出 `undefined`，否则输出原值
 *
 * @template T
 *
 * @param {T} maxValue
 * 限制最大值
 *
 * @return {Func<T, T>}
 *
 * @example
 * ```ts
 * let result = max(10)(3);
 * expect(result).equal(3);
 *
 * result = max(10)(14);
 * expect(result).to.be.undefined;
 * ```
 */
var max = function (maxValue) {
    return _build(function (value) { return value < maxValue; });
};
exports.max = max;
/**
 * 构建限制最小长度处理函数
 * 当值长度小于限制最小长度 {@link min} 时将输出 `undefined`，否则输出原值
 *
 * @template T
 *
 * @param {T} min
 * 限制最小长度
 *
 * @return {Func<T, T>}
 *
 * @example
 * ```ts
 * let result = minLength(2)('zz');
 * expect(result).equal('zz');
 *
 * result = minLength(2)([1]);
 * expect(result).to.be.undefined;
 *
 * result = minLength(2)([1, 3, 5]);
 * expect(result).deep.equal([1, 3, 5]);
 *
 * result = minLength(2)(undefined);
 * expect(result).to.be.undefined;
 * ```
 */
var minLength = function (min) {
    return _build(function (value) { var _a; return ((_a = value) === null || _a === void 0 ? void 0 : _a.length) >= min; });
};
exports.minLength = minLength;
/**
 * 构建限制最大长度处理函数
 * 当值长度大于限制最大长度 {@link max} 时将输出 `undefined`，否则输出原值
 *
 * @template T
 *
 * @param {T} max
 * 限制最大长度
 *
 * @return {Func<T, T>}
 *
 * @example
 * ```ts
 * let result = maxLength(2)('zz');
 * expect(result).equal('zz');
 *
 * result = maxLength(2)([1]);
 * expect(result).deep.equal([1]);
 *
 * result = maxLength(2)([1, 3, 5]);
 * expect(result).to.be.undefined;
 *
 * result = maxLength(2)(undefined);
 * expect(result).to.be.undefined;
 * ```
 */
var maxLength = function (max) {
    return _build(function (value) { var _a; return ((_a = value) === null || _a === void 0 ? void 0 : _a.length) <= max; });
};
exports.maxLength = maxLength;
/**
 * 构建限制值包含于指定集合处理函数
 * 当值未包含于 {@link items} 集合时将输出 `undefined`，否则输出原值
 *
 * @template T
 *
 * @param {Array<T>} items
 * 集合
 *
 * @return {Func<T, T>}
 *
 * @example
 * ```ts
 * let result = includes([1, 2, 3])(1);
 * expect(result).equal(1);
 *
 * result = includes([2, 3])(1);
 * expect(result).to.be.undefined;
 *
 * result = includes(undefined)(1);
 * expect(result).equal(1);
 * ```
 */
var includes = function (items) {
    return function (value) { return utils_1._isNullOrUndefined(items) ? value :
        items.includes(value) ? value : undefined; };
};
exports.includes = includes;
/**
 * 构建缺省值处理函数
 * 当值为 `null` 或 `undefined` 时将输出缺省值 {@link def}，否则输出原值
 *
 * @template T
 *
 * @param {T} def
 * 缺省值
 *
 * @return {Func<any, T>}
 *
 * @example
 * ```ts
 * let result = def(2)(undefined);
 * expect(result).equal(2);
 *
 * result = def(2)(1);
 * expect(result).equal(1);
 * ```
 */
var def = function (def) { return function (value) { return utils_1._ensure(value, def); }; };
exports.def = def;
/**
 * 构建字符串值处理函数
 *
 * @param {{ trim?: boolean }} [opts]
 * 设置项
 *
 * @param {boolean} [opts.trim]
 * 是否去除前后空白字符
 *
 * @return {Func<any, string>}
 * 处理函数
 *
 * @example
 * ```ts
 * let result = string()('zzz ');
 * expect(result).equal('zzz');
 *
 * result = string({ trim: false })(' xxx ');
 * expect(result).equal(' xxx ');
 *
 * result = string()(1);
 * expect(result).to.be.undefined;
 * ```
 */
var string = function (opts) {
    return _build(utils_1._isString, undefined, utils_1._ensure(opts === null || opts === void 0 ? void 0 : opts.trim, exports.defaults.string.trim) ? function (v) { return v.trim(); } : undefined);
};
exports.string = string;
/**
 * 构建整数值处理函数
 *
 * @param {{ tryConvert?: boolean }} [opts]
 * 设置项
 *
 * @param {boolean} [opts.tryConvert]
 * 是否尝试转换
 *
 * @return {Func<any, number>}
 * 处理函数
 *
 * @example
 * ```ts
 * let result = int()(1);
 * expect(result).equal(1);
 *
 * result = int({ tryConvert: true })('4');
 * expect(result).equal(4);
 *
 * result = int({ tryConvert: true })('s');
 * expect(result).to.be.undefined;
 * ```
 */
var int = function (opts) {
    return _build(Number.isInteger, utils_1._ensure(opts === null || opts === void 0 ? void 0 : opts.tryConvert, exports.defaults.int.tryConvert) ? utils_1._parseNumber(parseInt) : undefined);
};
exports.int = int;
var _fixedFn = exports.pipe(exports.int(), exports.min(0), exports.max(100));
/**
* 构建小数值处理函数
*
* @param {{ tryConvert?: boolean }} [opts]
* 设置项
*
* @param {boolean} [opts.tryConvert]
* 是否尝试转换
*s
* @param {number} [opts.fixed]
* 固定小数位
*
* @return {Func<any, number>}
* 处理函数
*
* @example
 * ```ts
* let result = float()(1.23);
* expect(result).equal(1.23);
*
* result = float({ tryConvert: true })('1.54  ');
* expect(result).equal(1.54);
*
* result = float({ tryConvert: false })('1.54');
* expect(result).to.be.undefined;
*
* result = float({ fixed: 2 })(1.233333);
* expect(result).equal(1.23);
* ```
 */
var float = function (opts) {
    var _a;
    var _fixed = (_a = _fixedFn(opts === null || opts === void 0 ? void 0 : opts.fixed)) !== null && _a !== void 0 ? _a : _fixedFn(exports.defaults.float.fixed), _handleFn = utils_1._isNumber(_fixed) ? function (v) { return parseFloat(v.toFixed(_fixed)); } : undefined;
    return _build(utils_1._isNumber, utils_1._ensure(opts === null || opts === void 0 ? void 0 : opts.tryConvert, exports.defaults.float.tryConvert) ? utils_1._parseNumber(parseFloat) : undefined, _handleFn);
};
exports.float = float;
/**
* 构建日期值处理函数
*
* @param {{ tryConvert?: boolean }} [opts]
* 设置项
*
* @param {boolean} [opts.tryConvert]
* 是否尝试转换
*
* @return {Func<any, Date>}
* 处理函数
*
* @example
 * ```ts
* let d1 = new Date();
* let result = date()(d1);
* expect(result).equal(d1);
*
* result = date()(1);
* expect(result).to.to.undefined;
*
* result = date()('');
* expect(result).to.to.undefined;
*
* result = date({ tryConvert: true })('2012-12-12T00:00:00.000Z');
* expect(result).deep.equal(new Date('2012-12-12T00:00:00.000Z'));
* ```
 */
var date = function (opts) {
    return _build(utils_1._isDate, utils_1._ensure(opts === null || opts === void 0 ? void 0 : opts.tryConvert, exports.defaults.date.tryConvert) ? utils_1._parseDate : undefined);
};
exports.date = date;
/**
* 构建布尔值处理函数
*
* @param {{ tryConvert?: boolean }} [opts]
* 设置项
*
* @param {boolean} [opts.tryConvert]
* 是否尝试转换
*
* @param {boolean} [opts.emptyStringAsUndefined]
* 是否将空字符串转换 `Undefined`，仅在 [tryConvert] 为 `true` 时有效
*
* @return {Func<any, boolean>}
* 处理函数
*
* @example
 * ```ts
* let result = boolean()(1);
* expect(result).equal(true);
*
* result = boolean()(0);
* expect(result).equal(false);
*
* result = boolean()('');
* expect(result).equal(false);
*
* result = boolean({ tryConvert: true, emptyStringAsUndefined: true })('');
* expect(result).to.be.undefined;
*
* result = boolean()('false');
* expect(result).equal(true);
*
* result = boolean({ tryConvert: false })('false');
* expect(result).to.be.undefined;
* ```
 */
var boolean = function (opts) {
    return _build(utils_1._isBoolean, utils_1._ensure(opts === null || opts === void 0 ? void 0 : opts.tryConvert, exports.defaults.boolean.tryConvert) ? function (v) { return (opts === null || opts === void 0 ? void 0 : opts.emptyStringAsUndefined) && v === '' ? undefined : !!v; } : undefined);
};
exports.boolean = boolean;
/**
* 构建数组值处理函数
*
* @template T
* 输入类型
*
* @template R
* 输出类型
*
* @param {{ tryConvert?: boolean, removeNullOrUndefined?: boolean } | Func<T, R>} [optsOrMapHanlderFn]
* 设置项或{@link Func 处理函数}
*
* 当 {@link optsOrMapHanlderFn} 为 {@link Func 处理函数} 时，视为 {@link mapHandlers} 成员项
*
* 否则视为设置项
*
* @param {boolean} [optsOrMapHanlderFn.tryConvert]
* 是否尝试转换
*
* 此设置开启时，会将非数组类型转换为数组 `value => [value]`
*
* @param {boolean} [optsOrMapHanlderFn.removeNullOrUndefined]
* 是否移除 `null` 或 `undefined` 项
*
* @param {...Array<Func<T, R>>} mapHandlers
* 数组项处理函数集合
*
* @return {Func<any, Array<R>>}
* 处理函数
*
* @example
 * ```ts
* let result = array()([]);
* expect(result).deep.equal([]);
*
* result = array({ tryConvert: true })(1);
* expect(result).deep.equal([1]);
*
* result = array({ removeNullOrUndefined: true })([1, 2, undefined, 4]);
* expect(result).deep.equal([1, 2, 4]);
*
* result = array({ removeNullOrUndefined: true }, int({ tryConvert: true }))([1, 2, undefined, 4, '5', 's', 8]);
* expect(result).deep.equal([1, 2, 4, 5, 8]);
*
* result = array({ removeNullOrUndefined: true },
*     pipe({ behavior: behaviors.Forward }, int({ tryConvert: true }), def(100)))([1, 2, undefined, 4, '5', 's', 8]);
* expect(result).deep.equal([1, 2, 100, 4, 5, 100, 8]);
*
* result = array(int())([1, 2, undefined, 4, '5', 's', 8]);
* expect(result).deep.equal([1, 2, undefined, 4, undefined, undefined, 8]);
* ```
 */
var array = function (optsOrMapHanlderFn) {
    var mapHandlers = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        mapHandlers[_i - 1] = arguments[_i];
    }
    var _opts = Object.assign({}, exports.defaults.array);
    if (utils_1._isFunction(optsOrMapHanlderFn))
        mapHandlers.unshift(optsOrMapHanlderFn);
    else
        Object.assign(_opts, optsOrMapHanlderFn);
    var mapFn = exports.pipe.apply(void 0, mapHandlers);
    return _build(Array.isArray, utils_1._ensure(_opts === null || _opts === void 0 ? void 0 : _opts.tryConvert, exports.defaults.array.tryConvert) ?
        function (v) { return utils_1._isNullOrUndefined(v) ? [] : [v]; } : undefined, exports.pipe(function (v) { return v.map(mapFn); }, utils_1._ensure(_opts === null || _opts === void 0 ? void 0 : _opts.removeNullOrUndefined, exports.defaults.array.removeNullOrUndefined) ?
        function (v) { return v.filter(utils_1._notNullOrUndefined); } : undefined));
};
exports.array = array;
/**
 * 构建正则处理函数
 *
 * @param {(RegExp | string)} pattern
 * 正则表达式或正则字符串
 *
 * @return {Func<string, string>}
 *
 * @example
 * ```ts
 * let result = regex(/^\d{2}$/)('31');
 * expect(result).equal('31');
 *
 * result = regex('^\\d{2}$')('31');
 * expect(result).equal('31');
 *
 * result = regex('^\\d{2}$')('311');
 * expect(result).to.be.undefined;
 * ```
 */
var regex = function (pattern) {
    var _pattern = pattern instanceof RegExp ? pattern : new RegExp(pattern);
    return _build(function (value) { return _pattern.test(value); });
};
exports.regex = regex;
//# sourceMappingURL=index.js.map