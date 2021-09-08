/**
 * 值处理函数
 *
 * @template T
 * 输入类型
 *
 * @template R
 * 输出类型
 *
 * @param {T} value
 * 输入值
 *
 * @return {R | undefined}
 * 输出值
 */
export interface Func<T = any, R = any> {
    (value: T): R | undefined;
}
/**
 * 行为上下文
 *
 */
export interface BehaviorContext {
    /**
     * 当前值
     *
     * @type {*}
     * @property
     * @memberof BehaviorContext
     */
    currentValue?: any;
    /**
     * 前一个值
     *
     * @type {*}
     * @property
     * @memberof BehaviorContext
     */
    prevValue?: any;
    /**
     * 处理器索引
     *
     * @type {number}
     * @property
     * @memberof BehaviorContext
     */
    handlerIndex: number;
}
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
     * @property
     * @memberof BehaviorResult
     */
    value?: any;
    /**
     * 是否执行下一个处理函数
     *
     * @type {boolean}
     * @property
     * @memberof BehaviorResult
     */
    next?: boolean;
}
/**
 * 行为函数
 *
 * 用于控制{@link Func 处理函数}执行行为
 *
 * @function BehaviorFunc
 *
 * @param {BehaviorContext} context
 * 上下文
 *
 * @return {BehaviorResult}
 *
 */
export interface BehaviorFunc {
    (context: BehaviorContext): BehaviorResult;
}
/**
 * 内建行为
 *
 */
export declare const behaviors: {
    /**
     * - 从左向右执行{@link Func 处理函数}
     * - 所有{@link Func 处理函数}都将执行
     *
     * @type {BehaviorFunc}
     */
    Forward: BehaviorFunc;
    /**
     * - 从左向右执行{@link Func 处理函数}
     * - 任一{@link Func 处理函数}执行结果非`null`或`undefined`时中断
     *
     * @type {BehaviorFunc}
     */
    BreakOnNotNullOrUndefinedValue: BehaviorFunc;
    /**
     * - 从左向右执行{@link Func 处理函数}
     * - 任一{@link Func 处理函数}执行结果为`null`或`undefined`时中断
     *
     * @type {BehaviorFunc}
     */
    BreakOnNullOrUndefinedValue: BehaviorFunc;
};
/**
 * 缺省配置
 *
 * */
export declare const defaults: {
    /**
     * 字符串处理函数缺省配置
     * @type {trim: boolean}
     */
    string: {
        /**
         * 是否去除前后空白字符
         * @type {boolean}
         * @default true
         * */
        trim: boolean;
    };
    /**
     * 整数处理函数缺省配置
     * @type {tryConvert: boolean}
     */
    int: {
        /**
         * 是否尝试转换
         * @type {boolean}
         * @default false
         * */
        tryConvert: boolean;
    };
    /**
     * 小数处理函数缺省配置
     * @type {tryConvert: boolean, fixed?: number}
     */
    float: {
        /**
         * 是否尝试转换
         * @type {boolean}
         * @default false
         * */
        tryConvert: boolean;
        /**
         * 固定小数位
         * @type {number}}
         * */
        fixed?: number;
    };
    /**
     * 布尔处理函数缺省配置
     * @type {tryConvert: boolean}
     */
    boolean: {
        /**
         * 是否尝试转换
         * @type {boolean}
         * @default true
         * */
        tryConvert: boolean;
    };
    /**
     * 日期处理函数缺省配置
     * @type {tryConvert: boolean}
     */
    date: {
        /**
         * 是否尝试转换
         * @type {boolean}
         * @default false
         * */
        tryConvert: boolean;
    };
    /**
     * 数组处理函数缺省配置
     * @type { tryConvert: boolean, removeNullOrUndefined: boolean }
     */
    array: {
        /**
         * 是否尝试转换
         * @type {boolean}
         * @default false
         * */
        tryConvert: boolean;
        /**
         * 是否移除 `null` 或 `undefined` 项
         * @type {boolean}
         * @default false
         * */
        removeNullOrUndefined: boolean;
    };
    /**
     * 组合函数缺省配置
     * @type {behavior?: BehaviorFunc}
     */
    pipe: {
        /**
         * 执行行为
         * @type {BehaviorFunc}
         * @default {@link behaviors.BreakOnNullOrUndefinedValue}
         * */
        behavior?: BehaviorFunc;
    };
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
export declare const pipe: <T = any, R = any>(optsOrHanlderFn?: {
    behavior?: BehaviorFunc;
} | Func<T, R>, ...handlers: Func<T, R>[]) => Func<T, R>;
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
export declare const forward: <T = any, R = any>(...handlers: Func<T, R>[]) => Func<T, R>;
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
export declare const any: <T = any, R = any>(...handlers: Func<T, R>[]) => Func<T, R>;
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
export declare const all: <T = any, R = any>(...handlers: Func<T, R>[]) => Func<T, R>;
/**
 * 构建提取路径值处理函数
 *
 * @param {...Array<string>} paths
 * 路径
 *
 * @return {Func<object, any>}
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
export declare const path: (...paths: Array<string>) => (value: any) => any;
/**
 * 构建投影处理函数
 *
 * @param {{ [key: string]: Func | string | Array<any> }} map
 * 映射
 *
 * @return {Func<object, object>}
 *
 * @example
 * ```ts
 * let result = project({
 *     a: ['prop1', int()],
 *     b: int(),
 *     c: ['prop3'],
 *     d: ['prop2', pipe(int(), min(4))],
 *     e: 'prop4'
 * })({ prop1: 1, prop2: 's', prop3: 'v', b: 2 });
 * expect(result).deep.equal({
 *     a: 1,
 *     b: 2,
 *     c: 'v',
 *     d: undefined,
 *     e: undefined
 * });
 *
 * result = project({})({ a: 1 });
 * expect(result).deep.equal({});
 *
 * result = project({})(undefined);
 * expect(result).to.be.undefined;
 * ```
 */
export declare const project: (map: {
    [key: string]: string | any[] | Func<any, any>;
}) => Func;
/**
 * 构建值检查处理函数
 * 当 {@link match match} 函数返回 `true` 时，则抛出 {@link errorOrErrorFn errorOrErrorFn} 构建的异常
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
 * 匹配函数，当此函数返回 `true` 时，则抛出 {@link errorOrErrorFn errorOrErrorFn} 构建的异常
 *
 * @return {Func<T, R>}
 */
export declare const throwError: <T = any, R = any>(errorOrErrorFn: Func | any, match?: Func<T, boolean>) => Func<T, R>;
/**
 * 构建`null`或`undefined`值检查处理函数
 * 当处理值为`null`或`undefined`时，则抛出 {@link errorOrErrorFn errorOrErrorFn} 构建的异常
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
 */
export declare const required: <T = any, R = any>(errorOrErrorFn: Func | any) => Func<T, R>;
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
export declare const min: <T = number | Date>(minValue: T) => Func<T, T>;
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
export declare const max: <T = number | Date>(maxValue: T) => Func<T, T>;
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
export declare const minLength: <T = string | any[]>(min: number) => Func<T, T>;
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
export declare const maxLength: <T = string | any[]>(max: number) => Func<T, T>;
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
export declare const def: <T = any>(def: T) => Func<any, T>;
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
export declare const string: (opts?: {
    trim?: boolean;
}) => Func<any, string>;
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
export declare const int: (opts?: {
    tryConvert?: boolean;
}) => Func<any, number>;
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
export declare const float: (opts?: {
    tryConvert?: boolean;
    fixed?: number;
}) => Func<any, number>;
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
export declare const date: (opts?: {
    tryConvert?: boolean;
}) => Func<any, Date>;
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
* result = boolean()('false');
* expect(result).equal(true);
*
* result = boolean({ tryConvert: false })('false');
* expect(result).to.be.undefined;
* ```
 */
export declare const boolean: (opts?: {
    tryConvert?: boolean;
}) => Func<any, boolean>;
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
export declare const array: <T = any, R = any>(optsOrMapHanlderFn?: {
    /**
     * 是否尝试转换
     *
     * @type {boolean}
     */
    tryConvert?: boolean;
    removeNullOrUndefined?: boolean;
} | Func<T, R>, ...mapHandlers: Func<T, R>[]) => Func<any, R[]>;
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
export declare const regex: (pattern: RegExp | string) => Func<string, string>;