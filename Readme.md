
# foreach

  iterate over key value pairs (array or object). async or sync implementations

## Getting Started

_With component_  

  $ component install jkroso/foreach

_With npm_  

  $ npm install jkroso/foreach --save

then in your app:

```js
var foreach = require('foreach')
var async = require('foreach/async')
var series = require('foreach/series')
```

## API

- [foreach()](#foreach)
- [async()](#async)
- [series()](#series)

### foreach(object, iterator, context)

  apply iterator to each key value pair in `object`. The value is passed as the first argument and the key as the second. If you pass `context` that will be the value of `this` inside of `iterator`.

```js
foreach({a:1,b:2}, function(v, k){
  // v = 1,2
  // k = a,b
})
foreach([1,2], function(v, k){
  // v = 1,2
  // k = 0,1
})
```

### async()

  Same API as the sync version except it will return a promise object, which will either, resolve when all items have been processed or reject when one rejects. No ordering is guaranteed between items.

```js
async([20, 10, 0], function(value, i){
  return promise(function(fulfill){
    setTimeout(fulfill, value)
  })
}).then(function(){
  // This function runs after all async processes have completed
  // Note that in this example the last iteration will complete before
  // the first because all iterations are run in parrallel and the last 
  // one completes in the shortest time
})
```

### series()

  Like `async` but the next item will not be processed until the previous one completes

## Running the tests

```bash
$ make
```
Then open your browser to the `./test` directory.
