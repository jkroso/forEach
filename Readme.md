# async-forEach

Perform an async operation on each item of an array. This code was inspired by [coalan/async](https://github.com/caolan/async). I was finding I only use a small portion of that library at a time so thought it appropriate to start seperating the ones I use. This implementation is dramatically more efficient than the implementation in async which is important to me because its a low level tool.

## Getting Started

With component(1) 

`component install jkroso/async-forEach`

In Node.js 

`npm install jkroso/async-forEach`

## API
These functions share their api's with their respective coalan/async functions so further documentation can be found [there](https://github.com/caolan/async).

```javascript
var forEach = require('async-forEach')
var series = forEach.series
```
  - [forEach()](#foreach)
  - [exports.series](#exportsseries)

## forEach()

  Apply an operation to each item in an array like object. The 3rd argument
  is an optional callback to be called on completion if there are any errors 
  they will be passed into this callback. Note only errors passed to their 
  respective done callbacks are propagated to the final callback. So thrown 
  errors are not caught.
  
```js
forEach([1,2,3], function(i, done){
  // do stuff
  done()
}, function(err){
  // called when all items have called their done callback
})
```

## exports.series

  Like forEach but the next item will not be proccessed until the previous one completes

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Jakeb Rosoman

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
