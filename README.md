
[![npm (scoped)](https://img.shields.io/npm/v/@unicreators/pipe)](https://www.npmjs.com/package/@unicreators/pipe)


Pipe is a library for handle values, It completes the validate and conversion of values by combining handler functions.


Pipe 是一个处理值的库，它通过组合处理函数来完成对值的验证和转换。


```ts
import { pipe, int, min, max } from '@unicreators/pipe';

let fn = pipe(int(), min(2), max(10));
console.log(fn(8) == 8);
// true
console.log(fn(1) === undefined);
// true

fn = pipe(int({tryConvert: true}), min(2), max(10));
console.log(fn('8') == 8);
// true
```

:watermelon: [APIs](./docs/modules.md) & [Example](./tests/index.test.ts)  


## Install

```sh
$ npm install @unicreators/pipe
```

## Handlers

- [string](./docs/modules.md#string)
- [int](./docs/modules.md#int)
- [float](./docs/modules.md#float)
- [date](./docs/modules.md#date)
- [boolean](./docs/modules.md#boolean)
- [regex](./docs/modules.md#regex)
- [array](./docs/modules.md#array)
- [min](./docs/modules.md#min)
- [max](./docs/modules.md#max)
- [minLength](./docs/modules.md#minlength)
- [maxLength](./docs/modules.md#maxlength)
- [def](./docs/modules.md#def)
- [required](./docs/modules.md#required)
- [throwError](./docs/modules.md#throwerror)
  

## Composers

- [pipe](./docs/modules.md#pipe)
- [forward](./docs/modules.md#forward)
- [all](./docs/modules.md#all)
- [any](./docs/modules.md#any)




### License

[MIT](LICENSE)