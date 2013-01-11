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
