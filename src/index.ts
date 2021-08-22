// Copyright (c) 2021 yichen <d.unicreators@gmail.com>. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

/// yichen <d.unicreators@gmail.com>
///

import {
    _ensure, _ensureCall, _identity, _isBoolean, _isDate, _isFunction,
    _isNullOrUndefined, _isNumber, _isString,
    _notNullOrUndefined, _parseDate, _parseNumber, _undefined
} from './utils'

/**
 * 值处理函数
 *
 * @template T 
 * 输入类型
 * @template R
 * 输出类型
 * @param {T} value
 * 输入值
 * @return {R | undefined} 
 * 输出值
 */
export type Func<T = any, R = any> = (value: T) => R | undefined;

/**
 * 行为上下文
 * 
 */
export interface BehaviorContext {

    /**
     * 当前值
     *
     * @type {*}
     * @memberof BehaviorContext
     */
    currentValue?: any,

    /**
     * 前一个值
     * 
     * @type {*}
     * @memberof BehaviorContext
     */
    prevValue?: any,

    /**
     * 处理器索引
     * 
     * @type {number}
     * @memberof BehaviorContext
     */
    handlerIndex: number
};


/**
 * 行为结果
 *
 * @export
 * @interface BehaviorResult
 */
export interface BehaviorResult {
    /**
     * 结果值
     * 
     * @type {*}
     * @memberof BehaviorResult
     */
    value?: any,

    /**
     * 是否执行下一个处理函数
     * 
     * @type {boolean}
     * @memberof BehaviorResult
     */
    next?: boolean
};

/**
 * 行为函数
 * 
 * @description 
 * 用于控制{@link Func 处理函数}执行行为 
 * 
 * @function BehaviorFunc
 */
export type BehaviorFunc = (context: BehaviorContext) => BehaviorResult;


/**
 * 内建行为
 * 
 */
export const PipeBehaviors: {
    /**
     * - 从左向右执行{@link Func 处理函数}
     * - 所有{@link Func 处理函数}都将执行
     *
     * @type {BehaviorFunc}
     */
    Forward: BehaviorFunc,

    /**
     * - 从左向右执行{@link Func 处理函数}
     * - 任一{@link Func 处理函数}执行结果非`null`或`undefined`时中断
     *      
     * @type {BehaviorFunc}
     */
    BreakOnNotNullOrUndefinedValue: BehaviorFunc,

    /**
     * - 从左向右执行{@link Func 处理函数}
     * - 任一{@link Func 处理函数}执行结果为`null`或`undefined`时中断
     * 
     * @type {BehaviorFunc}
     * @label BreakOnNullOrUndefinedValue
     */
    BreakOnNullOrUndefinedValue: BehaviorFunc
} = {
    Forward: ({ currentValue, prevValue, handlerIndex }): BehaviorResult => {
        return ({
            value: currentValue,
            next: true
        });
    },
    BreakOnNotNullOrUndefinedValue: ({ currentValue, prevValue, handlerIndex }): BehaviorResult => {
        let hasValue = !_isNullOrUndefined(currentValue);
        return ({
            value: hasValue ? currentValue : prevValue,
            next: !hasValue
        });
    },
    BreakOnNullOrUndefinedValue: ({ currentValue, prevValue, handlerIndex }): BehaviorResult => {
        let hasValue = !_isNullOrUndefined(currentValue);
        return ({
            value: currentValue,
            next: hasValue
        });
    }
}


/** 
 * 缺省配置
 * 
 * */
export const defaults: {
    string: {
        /** 
         * 是否去除前后空白字符
         * @type {boolean}
         * @default true
         * */
        trim: boolean
    },
    int: {
        /** 
         * 是否尝试转换
         * @type {boolean}
         * @default false
         * */
        tryConvert: boolean
    },
    float: {
        /** 
         * 是否尝试转换
         * @type {boolean}
         * @default false
         * */
        tryConvert: boolean,

        /** 
         * 固定小数位
         * @type {number}}         
         * */
        fixed?: number
    },
    boolean: {
        /** 
         * 是否尝试转换
         * @type {boolean}
         * @default true
         * */
        tryConvert: boolean
    },
    date: {
        /** 
         * 是否尝试转换
         * @type {boolean}
         * @default false
         * */
        tryConvert: boolean
    },
    array: {
        /** 
         * 是否尝试转换
         * @type {boolean}
         * @default false
         * */
        tryConvert: boolean,

        /** 
         * 是否移除 `null` 或 `undefined` 项
         * @type {boolean}
         * @default false
         * */
        removeNullOrUndefined: boolean
    },
    pipe: {
        /** 
         * 执行行为
         * @type {BehaviorFunc}
         * @default {@link PipeBehaviors.BreakOnNullOrUndefinedValue}
         * */
        behavior?: BehaviorFunc
    }
} = {
    string: { trim: true },
    int: { tryConvert: false },
    float: { tryConvert: false },
    boolean: { tryConvert: true },
    date: { tryConvert: false },
    array: { tryConvert: false, removeNullOrUndefined: false },
    pipe: { behavior: PipeBehaviors.BreakOnNullOrUndefinedValue }
};



/**
 * 组合处理函数
 *
 * @template T
 * 
 * @template R
 * 
 * @param {({ behavior?: BehaviorFunc } | Func<T, R>)} [optsOrHanlderFn]
 * 设置项或{@link Func 处理函数}
 *
 * 当 {@link optsOrHanlderFn} 为 {@link Func 处理函数} 时，视为 {@link handlers} 成员项
 *
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
 * let result = pipe()(8);
 * expect(result).equal(8);
 *
 * result = pipe({ behavior: PipeBehaviors.Forward }, int(), def(2))('8');
 * expect(result).equal(2);
 *
 * result = pipe<any, any>({ behavior: PipeBehaviors.BreakOnNotNullOrUndefinedValue }, int(), string(), def(2))('8');
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
 */
export const pipe = <T = any, R = any>(optsOrHanlderFn?: { behavior?: BehaviorFunc } | Func<T, R>,
    ...handlers: Array<Func<T, R>>): Func<T, R> => {
    let _behaviorFn = defaults.pipe.behavior,
        _handlers = handlers.filter(_isFunction);

    if (_isFunction(optsOrHanlderFn))
        _handlers.unshift(optsOrHanlderFn);
    else if (_isFunction(optsOrHanlderFn?.behavior) || _isNullOrUndefined(_behaviorFn))
        _behaviorFn = optsOrHanlderFn?.behavior || PipeBehaviors.BreakOnNullOrUndefinedValue;

    switch (_handlers.length) {
        case 0: return _identity;
        case 1: return _handlers[0];
        default: return (value: T): R => {
            let result: BehaviorResult = { value };
            for (let index = 0; index < _handlers.length; index++) {
                result = _exec(_handlers[index], index, result?.value, _behaviorFn);
                if (!result?.next) break;
            }
            return result.value;
        };
    }
}


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
 * let result = forward(int(), def(2), (v) => v + 2)('8');
 * expect(result).equal(4);
 *
 * result = forward(int(), def(2), (v) => v + 2)(8);
 * expect(result).equal(10);
 *
 * result = forward(int(), def(2), (v) => undefined)(8);
 * expect(result).to.be.undefined;
 */
export const forward = <T = any, R = any>(...handlers: Array<Func<T, R>>): Func<T, R> =>
    pipe({ behavior: PipeBehaviors.Forward }, ...handlers);

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
 * let result = any<any, any>(int(), (v) => `#${v}`)('8');
 * expect(result).equal('#8');
 */
export const any = <T = any, R = any>(...handlers: Array<Func<T, R>>): Func<T, R> =>
    pipe({ behavior: PipeBehaviors.BreakOnNotNullOrUndefinedValue }, ...handlers);

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
 * let result = all(int(), min(1))(8);
 * expect(result).equal(8);
 *
 * result = all(int(), min(1), max(6))(8);
 * expect(result).to.be.undefined;
 */
export const all = pipe;



const _build = <T = any, R = any>(
    validateFn: Func<T, boolean>,
    tryConvertFn?: Func<T, R>,
    handleFn?: Func<R, R>): Func<T, R> => {
    let _convertFn = _ensure(tryConvertFn, _undefined, _isFunction),
        _handleFn = _ensure(handleFn, _identity, _isFunction);
    return (value: T): R => {
        let _value: any = validateFn(value) ? value : _convertFn(value);
        return _isNullOrUndefined(_value) ? _value : _handleFn(_value);
    };
}

const _exec = <T = any, R = any>(handler: Func<T, R>, handlerIndex: number, prevValue: T,
    behavior: BehaviorFunc): BehaviorResult => {
    let value = handler(prevValue);
    return behavior({
        currentValue: value,
        prevValue,
        handlerIndex
    });
};


export const throwError = <T = any, R = any>(errorOrErrorFn: Func | any,
    ...handlers: Array<Func<T, R>>): Func<T, R> =>
    pipe(...handlers, (value: T): R => {
        if (_isNullOrUndefined(value))
            throw _ensureCall(errorOrErrorFn, value);
        return value as any;
    });

export const required = <T = any, R = any>(errorOrErrorFn: Func | any,
    ...handlers: Array<Func<T, R>>): Func<T, R> =>
    pipe((value: T): R => {
        if (_isNullOrUndefined(value))
            throw _ensureCall(errorOrErrorFn, value);
        return value as any;
    }, ...handlers);


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
 * let result = min(10)(14);
 * expect(result).equal(14)
 *
 * result = min(10)(9);
 * expect(result).to.be.undefined;
 */
export const min = <T = number | Date>(minValue: T): Func<T, T> =>
    _build((value: T) => value >= minValue);

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
 * let result = max(10)(3);
 * expect(result).equal(3);
 *
 * result = max(10)(14);
 * expect(result).to.be.undefined;
 */
export const max = <T = number | Date>(maxValue: T): Func<T, T> =>
    _build((value: T) => value < maxValue);

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
 */
export const minLength = <T = string | Array<any>>(min: number): Func<T, T> =>
    _build((value: T) => (value as any)?.length >= min);

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
 */
export const maxLength = <T = string | Array<any>>(max: number): Func<T, T> =>
    _build((value: T) => (value as any)?.length <= max);

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
 * let result = def(2)(undefined);
 * expect(result).equal(2);
 *
 * result = def(2)(1);
 * expect(result).equal(1);
 */
export const def = <T = any>(def: T): Func<any, T> => (value: T) => _ensure(value, def);

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
 * let result = string()('zzz ');
 * expect(result).equal('zzz');
 *
 * result = string({ trim: false })(' xxx ');
 * expect(result).equal(' xxx ');
 *
 * result = string()(1);
 * expect(result).to.be.undefined;
 */
export const string = (opts?: { trim?: boolean }): Func<any, string> =>
    _build<any, string>(_isString, undefined,
        _ensure(opts?.trim, defaults.string.trim) ? (v: string) => v.trim() : undefined);

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
 * let result = int()(1);
 * expect(result).equal(1);
 *
 * result = int({ tryConvert: true })('4');
 * expect(result).equal(4);
 *
 * result = int({ tryConvert: true })('s');
 * expect(result).to.be.undefined;
 */
export const int = (opts?: { tryConvert?: boolean }): Func<any, number> =>
    _build<any, number>(Number.isInteger,
        _ensure(opts?.tryConvert, defaults.int.tryConvert) ? _parseNumber(parseInt) : undefined);



const _fixedFn = pipe(int(), min(0), max(100));


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
*/
export const float = (opts?: { tryConvert?: boolean, fixed?: number }): Func<any, number> => {
    let _fixed = _fixedFn(opts?.fixed) ?? _fixedFn(defaults.float.fixed),
        _handleFn = _isNumber(_fixed) ? (v: number) => parseFloat(v.toFixed(_fixed)) : undefined;
    return _build<any, number>(_isNumber,
        _ensure(opts?.tryConvert, defaults.float.tryConvert) ? _parseNumber(parseFloat) : undefined,
        _handleFn);
}

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
*/
export const date = (opts?: { tryConvert?: boolean }): Func<any, Date> =>
    _build<any, Date>(_isDate,
        _ensure(opts?.tryConvert, defaults.date.tryConvert) ? _parseDate : undefined);

/**
* 构建布尔值处理函数
*
* @param {{ tryConvert?: boolean }} [opts] 
* 设置项
* 
* @param {boolean} [opts.tryConvert]
* 是否尝试转换
*
* @return {Func<any, boolean>}  
* 处理函数
* 
* @example 
* let result = boolean()(1);
* expect(result).equal(true);
*
* result = boolean()(0);
* expect(result).equal(false);
*
* result = boolean()('');
* expect(result).equal(false);
*
* result = boolean()('false');
* expect(result).equal(true);
*
* result = boolean({ tryConvert: false })('false');
* expect(result).to.be.undefined;
*/
export const boolean = (opts?: { tryConvert?: boolean }): Func<any, boolean> =>
    _build<any, boolean>(_isBoolean,
        _ensure(opts?.tryConvert, defaults.boolean.tryConvert) ? (v: any) => !!v : undefined);

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
*     pipe({ behavior: PipeBehaviors.Forward }, int({ tryConvert: true }), def(100)))([1, 2, undefined, 4, '5', 's', 8]);
* expect(result).deep.equal([1, 2, 100, 4, 5, 100, 8]);
*
* result = array(int())([1, 2, undefined, 4, '5', 's', 8]);
* expect(result).deep.equal([1, 2, undefined, 4, undefined, undefined, 8]);
*/
export const array = <T = any, R = any>(optsOrMapHanlderFn?: { tryConvert?: boolean, removeNullOrUndefined?: boolean } | Func<T, R>,
    ...mapHandlers: Array<Func<T, R>>): Func<any, Array<R>> => {
    let _opts = Object.assign({}, defaults.array);
    if (_isFunction(optsOrMapHanlderFn))
        mapHandlers.unshift(optsOrMapHanlderFn);
    else
        Object.assign(_opts, optsOrMapHanlderFn);

    let mapFn: Func<any, R> = pipe(...mapHandlers);
    return _build<any, Array<R>>(Array.isArray,
        _ensure(_opts?.tryConvert, defaults.array.tryConvert) ?
            (v: any) => _isNullOrUndefined(v) ? [] : [v as any] : undefined,
        pipe((v: Array<any>) => v.map(mapFn),
            _ensure(_opts?.removeNullOrUndefined, defaults.array.removeNullOrUndefined) ?
                (v: Array<any>) => v.filter(_notNullOrUndefined) : undefined));
}

/**
 * 构建正则处理函数
 *
 * @param {(RegExp | string)} pattern
 * 正则表达式或正则字符串
 * 
 * @return {Func<string, string>}
 * 
 * @example 
 * let result = regex(/^\d{2}$/)('31');
 * expect(result).equal('31');
 *
 * result = regex('^\\d{2}$')('31');
 * expect(result).equal('31');
 *
 * result = regex('^\\d{2}$')('311');
 * expect(result).to.be.undefined;
 */
export const regex = (pattern: RegExp | string): Func<string, string> => {
    let _pattern = pattern instanceof RegExp ? pattern : new RegExp(pattern);
    return _build((value: any) => _pattern.test(value));
}









