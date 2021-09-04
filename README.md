[![Tests](https://github.com/unicreators/pipe/actions/workflows/tests.yml/badge.svg)](https://github.com/unicreators/pipe/actions/workflows/tests.yml) 
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

:watermelon: [APIs](./docs) & [Example](./tests/index.test.ts)  


## Install

```sh
$ npm install @unicreators/pipe
```

## Handlers

- [string](./docs#string)
- [int](./docs#int)
- [float](./docs#float)
- [date](./docs#date)
- [boolean](./docs#boolean)
- [regex](./docs#regex)
- [array](./docs#array)
- [min](./docs#min)
- [max](./docs#max)
- [minLength](./docs#minlength)
- [maxLength](./docs#maxlength)
- [def](./docs#def)
- [required](./docs#required)
- [throwError](./docs#throwerror)
- [path](./docs#path)
- [project](./docs#project)
  

## Composers

- [pipe](./docs#pipe)
- [forward](./docs#forward)
- [all](./docs#all)
- [any](./docs#any)




### License

[MIT](LICENSE)