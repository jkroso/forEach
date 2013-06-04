/**
 * async.js but only works with callback accepting `fn`'s
 */

var Promise = require('laissez-faire/full')

module.exports = function(obj, fn, ctx){
	var promise = new Promise
	if (obj == null) return promise.write()
	var i = 0
	var len = obj.length
	var pending
	// array
	if (len === +len) {
		if (!(pending = len)) return promise.write()
		while (i < len) {
			fn.call(ctx, obj[i], i++, done)
		}
	} 
	// object
	else {
		var keys = []
		for (var k in obj) keys.push(k)
		if (!(pending = len = keys.length)) return promise.write()
		while (i < len) {
			fn.call(ctx, obj[k = keys[i++]], k, done)
		}
	}
	
	function done (e) {
		if (e) promise.error(e)
		else if (--pending <= 0) promise.write()
	}

	return promise
}