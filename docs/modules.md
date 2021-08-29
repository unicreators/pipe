[@unicreators/pipe](README.md) / Exports

# @unicreators/pipe

## Table of contents

### Interfaces

- [BehaviorContext](interfaces/BehaviorContext.md)
- [BehaviorFunc](interfaces/BehaviorFunc.md)
- [BehaviorResult](interfaces/BehaviorResult.md)
- [Func](interfaces/Func.md)

### Variables

- [behaviors](modules.md#behaviors)
- [defaults](modules.md#defaults)

### Functions

- [all](modules.md#all)
- [any](modules.md#any)
- [array](modules.md#array)
- [boolean](modules.md#boolean)
- [date](modules.md#date)
- [def](modules.md#def)
- [float](modules.md#float)
- [forward](modules.md#forward)
- [int](modules.md#int)
- [max](modules.md#max)
- [maxLength](modules.md#maxlength)
- [min](modules.md#min)
- [minLength](modules.md#minlength)
- [pipe](modules.md#pipe)
- [regex](modules.md#regex)
- [required](modules.md#required)
- [string](modules.md#string)
- [throwError](modules.md#throwerror)

## Variables

### behaviors

• `Const` **behaviors**: `Object`

内建行为

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `BreakOnNotNullOrUndefinedValue` | [`BehaviorFunc`](interfaces/BehaviorFunc.md) | - 从左向右执行[处理函数](interfaces/Func.md) - 任一[处理函数](interfaces/Func.md)执行结果非`null`或`undefined`时中断 |
| `BreakOnNullOrUndefinedValue` | [`BehaviorFunc`](interfaces/BehaviorFunc.md) | - 从左向右执行[处理函数](interfaces/Func.md) - 任一[处理函数](interfaces/Func.md)执行结果为`null`或`undefined`时中断 |
| `Forward` | [`BehaviorFunc`](interfaces/BehaviorFunc.md) | - 从左向右执行[处理函数](interfaces/Func.md) - 所有[处理函数](interfaces/Func.md)都将执行 |

___

### defaults

• `Const` **defaults**: `Object`

缺省配置

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `array` | `Object` | 数组处理函数缺省配置 |
| `array.removeNullOrUndefined` | `boolean` | 是否移除 `null` 或 `undefined` 项  **`default`** false |
| `array.tryConvert` | `boolean` | 是否尝试转换  **`default`** false |
| `boolean` | `Object` | 布尔处理函数缺省配置 |
| `boolean.tryConvert` | `boolean` | 是否尝试转换  **`default`** true |
| `date` | `Object` | 日期处理函数缺省配置 |
| `date.tryConvert` | `boolean` | 是否尝试转换  **`default`** false |
| `float` | `Object` | 小数处理函数缺省配置 |
| `float.fixed?` | `number` | 固定小数位 |
| `float.tryConvert` | `boolean` | 是否尝试转换  **`default`** false |
| `int` | `Object` | 整数处理函数缺省配置 |
| `int.tryConvert` | `boolean` | 是否尝试转换  **`default`** false |
| `pipe` | `Object` | 组合函数缺省配置 |
| `pipe.behavior?` | [`BehaviorFunc`](interfaces/BehaviorFunc.md) | 执行行为  **`default`** {@link behaviors.BreakOnNullOrUndefinedValue} |
| `string` | `Object` | 字符串处理函数缺省配置 |
| `string.trim` | `boolean` | 是否去除前后空白字符  **`default`** true |

## Functions

### all

▸ `Const` **all**<`T`, `R`\>(...`handlers`): [`Func`](interfaces/Func.md)<`T`, `R`\>

组合处理函数
- 从左向右执行[处理函数](interfaces/Func.md)
- 组合内[处理函数](interfaces/Func.md)的输入值为上一个[处理函数](interfaces/Func.md)的输出值
- 任一[处理函数](interfaces/Func.md)执行结果`null`或`undefined`时中断并返回结果值，否则全部[处理函数](interfaces/Func.md)执行完毕返回结果值

**`example`**
```ts
let result = all(int(), min(1))(8);
expect(result).equal(8);

result = all(int(), min(1), max(6))(8);
expect(result).to.be.undefined;
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...handlers` | [`Func`](interfaces/Func.md)<`T`, `R`\>[] | [处理函数](interfaces/Func.md)集合 |

#### Returns

[`Func`](interfaces/Func.md)<`T`, `R`\>

处理函数

___

### any

▸ `Const` **any**<`T`, `R`\>(...`handlers`): [`Func`](interfaces/Func.md)<`T`, `R`\>

组合处理函数
- 从左向右执行[处理函数](interfaces/Func.md)
- 组合内[处理函数](interfaces/Func.md)的输入值各自独立
- 任一[处理函数](interfaces/Func.md)执行结果非`null`或`undefined`时中断并返回结果值

**`example`**
```ts
let result = any<any, any>(int(), (v) => `#${v}`)('8');
expect(result).equal('#8');
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...handlers` | [`Func`](interfaces/Func.md)<`T`, `R`\>[] | [处理函数](interfaces/Func.md)集合 |

#### Returns

[`Func`](interfaces/Func.md)<`T`, `R`\>

处理函数

___

### array

▸ `Const` **array**<`T`, `R`\>(`optsOrMapHanlderFn?`, ...`mapHandlers`): [`Func`](interfaces/Func.md)<`any`, `R`[]\>

构建数组值处理函数

**`example`**
```ts 
let result = array()([]);
expect(result).deep.equal([]);

result = array({ tryConvert: true })(1);
expect(result).deep.equal([1]);

result = array({ removeNullOrUndefined: true })([1, 2, undefined, 4]);
expect(result).deep.equal([1, 2, 4]);

result = array({ removeNullOrUndefined: true }, int({ tryConvert: true }))([1, 2, undefined, 4, '5', 's', 8]);
expect(result).deep.equal([1, 2, 4, 5, 8]);

result = array({ removeNullOrUndefined: true },
    pipe({ behavior: behaviors.Forward }, int({ tryConvert: true }), def(100)))([1, 2, undefined, 4, '5', 's', 8]);
expect(result).deep.equal([1, 2, 100, 4, 5, 100, 8]);

result = array(int())([1, 2, undefined, 4, '5', 's', 8]);
expect(result).deep.equal([1, 2, undefined, 4, undefined, undefined, 8]);
```

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `any` | 输入类型 |
| `R` | `any` | 输出类型 |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optsOrMapHanlderFn?` | [`Func`](interfaces/Func.md)<`T`, `R`\> \| { `removeNullOrUndefined?`: `boolean` ; `tryConvert?`: `boolean`  } | - |
| `...mapHandlers` | [`Func`](interfaces/Func.md)<`T`, `R`\>[] | 数组项处理函数集合 |

#### Returns

[`Func`](interfaces/Func.md)<`any`, `R`[]\>

处理函数

___

### boolean

▸ `Const` **boolean**(`opts?`): [`Func`](interfaces/Func.md)<`any`, `boolean`\>

构建布尔值处理函数

**`example`**
```ts 
let result = boolean()(1);
expect(result).equal(true);

result = boolean()(0);
expect(result).equal(false);

result = boolean()('');
expect(result).equal(false);

result = boolean()('false');
expect(result).equal(true);

result = boolean({ tryConvert: false })('false');
expect(result).to.be.undefined;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `Object` |
| `opts.tryConvert?` | `boolean` |

#### Returns

[`Func`](interfaces/Func.md)<`any`, `boolean`\>

处理函数

___

### date

▸ `Const` **date**(`opts?`): [`Func`](interfaces/Func.md)<`any`, `Date`\>

构建日期值处理函数

**`example`**
```ts 
let d1 = new Date();
let result = date()(d1);
expect(result).equal(d1);

result = date()(1);
expect(result).to.to.undefined;

result = date()('');
expect(result).to.to.undefined;

result = date({ tryConvert: true })('2012-12-12T00:00:00.000Z');
expect(result).deep.equal(new Date('2012-12-12T00:00:00.000Z'));
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `Object` |
| `opts.tryConvert?` | `boolean` |

#### Returns

[`Func`](interfaces/Func.md)<`any`, `Date`\>

处理函数

___

### def

▸ `Const` **def**<`T`\>(`def`): [`Func`](interfaces/Func.md)<`any`, `T`\>

构建缺省值处理函数
当值为 `null` 或 `undefined` 时将输出缺省值 [def](modules.md#def)，否则输出原值

**`example`**
```ts
let result = def(2)(undefined);
expect(result).equal(2);

result = def(2)(1);
expect(result).equal(1);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | `T` | 缺省值 |

#### Returns

[`Func`](interfaces/Func.md)<`any`, `T`\>

___

### float

▸ `Const` **float**(`opts?`): [`Func`](interfaces/Func.md)<`any`, `number`\>

构建小数值处理函数

**`example`**
```ts 
let result = float()(1.23);
expect(result).equal(1.23);

result = float({ tryConvert: true })('1.54  ');
expect(result).equal(1.54);

result = float({ tryConvert: false })('1.54');
expect(result).to.be.undefined;

result = float({ fixed: 2 })(1.233333);
expect(result).equal(1.23);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `Object` |
| `opts.fixed?` | `number` |
| `opts.tryConvert?` | `boolean` |

#### Returns

[`Func`](interfaces/Func.md)<`any`, `number`\>

处理函数

___

### forward

▸ `Const` **forward**<`T`, `R`\>(...`handlers`): [`Func`](interfaces/Func.md)<`T`, `R`\>

组合处理函数
- 从左向右执行[处理函数](interfaces/Func.md)
- 组合内[处理函数](interfaces/Func.md)的输入值为上一个[处理函数](interfaces/Func.md)的输出值
- 所有[处理函数](interfaces/Func.md)逐个执行直至全部执行完毕

**`example`**
```ts
let result = forward(int(), def(2), (v) => v + 2)('8');
expect(result).equal(4);

result = forward(int(), def(2), (v) => v + 2)(8);
expect(result).equal(10);

result = forward(int(), def(2), (v) => undefined)(8);
expect(result).to.be.undefined;
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...handlers` | [`Func`](interfaces/Func.md)<`T`, `R`\>[] | [处理函数](interfaces/Func.md)集合 |

#### Returns

[`Func`](interfaces/Func.md)<`T`, `R`\>

处理函数

___

### int

▸ `Const` **int**(`opts?`): [`Func`](interfaces/Func.md)<`any`, `number`\>

构建整数值处理函数

**`example`**
```ts 
let result = int()(1);
expect(result).equal(1);

result = int({ tryConvert: true })('4');
expect(result).equal(4);

result = int({ tryConvert: true })('s');
expect(result).to.be.undefined;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `Object` |
| `opts.tryConvert?` | `boolean` |

#### Returns

[`Func`](interfaces/Func.md)<`any`, `number`\>

处理函数

___

### max

▸ `Const` **max**<`T`\>(`maxValue`): [`Func`](interfaces/Func.md)<`T`, `T`\>

构建限制最大值处理函数
当值大于限制最大值 {@link maxValue} 时将输出 `undefined`，否则输出原值

**`example`**
```ts
let result = max(10)(3);
expect(result).equal(3);

result = max(10)(14);
expect(result).to.be.undefined;
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `number` \| `Date` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maxValue` | `T` | 限制最大值 |

#### Returns

[`Func`](interfaces/Func.md)<`T`, `T`\>

___

### maxLength

▸ `Const` **maxLength**<`T`\>(`max`): [`Func`](interfaces/Func.md)<`T`, `T`\>

构建限制最大长度处理函数
当值长度大于限制最大长度 [max](modules.md#max) 时将输出 `undefined`，否则输出原值

**`example`**
```ts 
let result = maxLength(2)('zz');
expect(result).equal('zz');

result = maxLength(2)([1]);
expect(result).deep.equal([1]);

result = maxLength(2)([1, 3, 5]);
expect(result).to.be.undefined;

result = maxLength(2)(undefined);
expect(result).to.be.undefined;
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` \| `any`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `max` | `number` | 限制最大长度 |

#### Returns

[`Func`](interfaces/Func.md)<`T`, `T`\>

___

### min

▸ `Const` **min**<`T`\>(`minValue`): [`Func`](interfaces/Func.md)<`T`, `T`\>

构建限制最小值处理函数
当值小于限制最小值 {@link minValue} 时将输出 `undefined`，否则输出原值

**`example`**
```ts
let result = min(10)(14);
expect(result).equal(14)

result = min(10)(9);
expect(result).to.be.undefined;
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `number` \| `Date` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `minValue` | `T` | 限制最小值 |

#### Returns

[`Func`](interfaces/Func.md)<`T`, `T`\>

___

### minLength

▸ `Const` **minLength**<`T`\>(`min`): [`Func`](interfaces/Func.md)<`T`, `T`\>

构建限制最小长度处理函数
当值长度小于限制最小长度 [min](modules.md#min) 时将输出 `undefined`，否则输出原值

**`example`**
```ts
let result = minLength(2)('zz');
expect(result).equal('zz');

result = minLength(2)([1]);
expect(result).to.be.undefined;

result = minLength(2)([1, 3, 5]);
expect(result).deep.equal([1, 3, 5]);

result = minLength(2)(undefined);
expect(result).to.be.undefined;
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` \| `any`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | `number` | 限制最小长度 |

#### Returns

[`Func`](interfaces/Func.md)<`T`, `T`\>

___

### pipe

▸ `Const` **pipe**<`T`, `R`\>(`optsOrHanlderFn?`, ...`handlers`): [`Func`](interfaces/Func.md)<`T`, `R`\>

组合处理函数

**`example`**
```ts
let result = pipe()(8);
expect(result).equal(8);

result = pipe({ behavior: behaviors.Forward }, int(), def(2))('8');
expect(result).equal(2);

result = pipe<any, any>({ behavior: behaviors.BreakOnNotNullOrUndefinedValue }, int(), string(), def(2))('8');
expect(result).equal('8');

// custom behavior
result = pipe({
    behavior: ({ currentValue, prevValue, handlerIndex }): { value?: any, next?: boolean } => {
        return ({
            next: handlerIndex < 1,
            value: currentValue
        });
    }
}, int(), min(2), max(10))(12);
expect(result).equal(12);

result = pipe(int(), min(2), max(10))(8);
expect(result).equal(8);

result = pipe(int(), min(2), max(10))(11);
expect(result).to.be.undefined;

// group
let range = pipe(min(2), max(10));
result = pipe(int(), range)(8);
expect(result).equal(8);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optsOrHanlderFn?` | [`Func`](interfaces/Func.md)<`T`, `R`\> \| { `behavior?`: [`BehaviorFunc`](interfaces/BehaviorFunc.md)  } | - |
| `...handlers` | [`Func`](interfaces/Func.md)<`T`, `R`\>[] | 处理函数集合 |

#### Returns

[`Func`](interfaces/Func.md)<`T`, `R`\>

处理函数

___

### regex

▸ `Const` **regex**(`pattern`): [`Func`](interfaces/Func.md)<`string`, `string`\>

构建正则处理函数

**`example`**
```ts 
let result = regex(/^\d{2}$/)('31');
expect(result).equal('31');

result = regex('^\\d{2}$')('31');
expect(result).equal('31');

result = regex('^\\d{2}$')('311');
expect(result).to.be.undefined;
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pattern` | `string` \| `RegExp` | 正则表达式或正则字符串 |

#### Returns

[`Func`](interfaces/Func.md)<`string`, `string`\>

___

### required

▸ `Const` **required**<`T`, `R`\>(`errorOrErrorFn`): [`Func`](interfaces/Func.md)<`T`, `R`\>

构建`null`或`undefined`值检查处理函数
当处理值为`null`或`undefined`时，则抛出 {@link errorOrErrorFn errorOrErrorFn} 构建的异常

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `any` | 输入类型 |
| `R` | `any` | 输出类型 |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `errorOrErrorFn` | `any` | 异常值或构建异常的函数 |

#### Returns

[`Func`](interfaces/Func.md)<`T`, `R`\>

___

### string

▸ `Const` **string**(`opts?`): [`Func`](interfaces/Func.md)<`any`, `string`\>

构建字符串值处理函数

**`example`**
```ts 
let result = string()('zzz ');
expect(result).equal('zzz');

result = string({ trim: false })(' xxx ');
expect(result).equal(' xxx ');

result = string()(1);
expect(result).to.be.undefined;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `Object` |
| `opts.trim?` | `boolean` |

#### Returns

[`Func`](interfaces/Func.md)<`any`, `string`\>

处理函数

___

### throwError

▸ `Const` **throwError**<`T`, `R`\>(`errorOrErrorFn`, `match?`): [`Func`](interfaces/Func.md)<`T`, `R`\>

构建值检查处理函数
当 {@link match match} 函数返回 `true` 时，则抛出 {@link errorOrErrorFn errorOrErrorFn} 构建的异常

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `any` | 输入类型 |
| `R` | `any` | 输出类型 |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `errorOrErrorFn` | `any` | 异常值或构建异常的函数 |
| `match` | [`Func`](interfaces/Func.md)<`T`, `boolean`\> | - |

#### Returns

[`Func`](interfaces/Func.md)<`T`, `R`\>
