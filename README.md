
[![npm (scoped)](https://img.shields.io/npm/v/@unicreators/pipe)](https://www.npmjs.com/package/@unicreators/pipe)


Pipe is a library for handle values, It completes the validate and conversion of values by combining handler functions.


Pipe 是一个处理值的库，它通过组合处理函数来完成对值的验证和转换。


##

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


:watermelon: [Example](./tests/index.test.ts) 



## Install

```sh
$ npm install @unicreators/pipe
```



## Handlers

- `int`
- `float`
- `date`
- `boolean`
- `string`
- `regex`
- `array`
- `min`
- `max`
- `minLength`
- `maxLength`
- `def`
  


## Composers

- `pipe`
- `forward`
- `any`
- `all`



### License

[MIT](LICENSE)