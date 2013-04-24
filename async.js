
var Promise = require('laissez-faire/full')

/**
 * Asynchronous parallel each
 *
 * @param {Object|Array}
 * @param {Function} (value, key, done) -> nil
 * @param {Object} context is optional
 * @return {Promise} resolves to nil on completion
 */

module.exports = function(obj, fn, ctx){
	var p = new Promise
	if (obj == null) return p.fulfill()
	var i = 0
	// array
	var pending = obj.length
	if (pending === +pending) {
		if (!pending) return p.fulfill()
		while (i < pending) fn.call(ctx, obj[i], i++, done)
	} 
	// object
	else {
		var keys = enumkeys(obj)
		var pending = keys.length
		if (!pending) return p.fulfill()
		while (i < pending) {
			var k = keys[i++]
			fn.call(ctx, obj[k], k, done)
		}
	}
	
	function done (e) {
		if (e) p.reject(e)
		else if (--pending <= 0) p.fulfill()
	}

	return p
}

function enumkeys(obj){
	var res = []
	for (var k in obj) res.push(k)
	return res
}
