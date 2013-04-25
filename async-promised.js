/**
 * async.js but only works with promise returning `fn`'s
 */

var Promise = require('laissez-faire/full')
  , when = require('when/read')

module.exports = function(obj, fn, ctx){
	var p = new Promise
	if (obj == null) return p.fulfill()
	var i = 0
	// array
	var pending = obj.length
	if (pending === +pending) {
		if (!pending) return p.fulfill()
		while (i < pending) when(fn.call(ctx, obj[i], i++), done, fail)
	} 
	// object
	else {
		var keys = []
		for (var k in obj) keys.push(k)
		var pending = keys.length
		if (!pending) return p.fulfill()
		while (i < pending) {
			when(fn.call(ctx, obj[k = keys[i++]], k), done, fail)
		}
	}

	function fail(e){ p.reject(e) }
	function done(){ if (--pending <= 0) p.fulfill() }

	return p
}
