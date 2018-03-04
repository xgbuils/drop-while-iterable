# drop-while-iterable

[![travis ci][1]][2]
[![npm version][3]][4]
[![Coverage Status][5]][6]
[![Dependency Status][7]][8]

`drop-while-iterable` exports a class that builds iterables that provide dropWhile method.

## Install

``` bash
$ npm install drop-while-iterable --save
```

## Usage
``` javascript
const I = require('drop-while-iterable') 

const first = I.of(new Set([4, 2, 7, 8, 4, 7])) // (4 2 7 8 4 7)
const second = I.dropWhile(e => e % 2 === 0, first) // (7 8 4 7)
const third = I.dropWhile(e => e > 5, second) // (4 7)

// converting to array:
[...third] // [4 7]

// traversing values:
for (const val of third) {
    // ...
}

// creating an iterator that traverses the values
let iterator = third[Symbol.iterator]()
iterator.next() // {value: 4, done: false}
iterator.next() // {value: 7, done: false}
iterator.next() // {value: undefined, done: true}

// Infinite iterable
const naturals = {
    [Symbol.iterator]: function* () {
        let i = 1
        while(true) { yield i++ }
    }
} // (1 2 3 4...)

I.dropWhile(e => e > 5, I.of(naturals)) // (6 7 8 9 10...)
```

## Support
- Node.js >=6
- ES2015 transpilers

## License
MIT

  [1]: https://travis-ci.org/xgbuils/drop-while-iterable.svg?branch=master
  [2]: https://travis-ci.org/xgbuils/drop-while-iterable
  [3]: https://badge.fury.io/js/drop-while-iterable.svg
  [4]: https://badge.fury.io/js/drop-while-iterable
  [5]: https://coveralls.io/repos/github/xgbuils/drop-while-iterable/badge.svg?branch=master
  [6]: https://coveralls.io/github/xgbuils/drop-while-iterable?branch=master
  [7]: https://david-dm.org/xgbuils/drop-while-iterable.svg
  [8]: https://david-dm.org/xgbuils/drop-while-iterable
