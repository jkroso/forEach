
var Promise = require('laissez-faire/full')

/**
 * Asynchronous each
 *
 * @param {Object|Array}
 * @param {Function} (value, key, done) -> nil
 * @param {Object} context is optional
 * @return {Promise} resolves to nil on completion
 */

module.exports = function(obj, fn, ctx){
	var promise = new Promise
	if (obj == null) return promise.write()
	var i = 0
	var pending = obj.length
	// array
	if (pending === +pending) {
		var next = function(e){
			if (e) promise.error(e)
			else if (i === pending) promise.write()
			else fn.call(ctx, obj[i], i++, next)
		}
	} else {
		var keys = []
		for (var k in obj) keys.push(k)
		var pending = keys.length
		var next = function(e){
			var k = keys[i++]
			if (e) promise.error(e)
			else if (i > pending) promise.write()
			else fn.call(ctx, obj[k], k, next)			
		}
	}

	next(false)

	return promise
}
