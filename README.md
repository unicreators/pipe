## Pipe

一个简洁的值处理工具包


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
[:watermelon: Example :watermelon:](./tests/index.test.ts) 


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