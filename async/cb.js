/**
 * async.js but only works with callback accepting `fn`'s
 */

var Promise = require('laissez-faire/full')

module.exports = function(obj, fn, ctx){
	var p = new Promise
	if (obj == null) return p.fulfill()
	var i = 0
	var len = obj.length
	var pending
	// array
	if (len === +len) {
		if (!(pending = len)) return p.fulfill()
		while (i < len) fn.call(ctx, obj[i], i++, done)
	} 
	// object
	else {
		var keys = []
		for (var k in obj) keys.push(k)
		if (!(pending = len = keys.length)) return p.fulfill()
		while (i < len) {
			fn.call(ctx, obj[k = keys[i++]], k, done)
		}
	}
	
	function done (e) {
		if (e) p.reject(e)
		else if (--pending <= 0) p.fulfill()
	}

	return p
}