
var Promise = require('laissez-faire/full')
var when = require('when/read')

/**
 * Asynchronous but sequential each
 *
 * @param {Object|Array}
 * @param {Function} (value, key) -> Promise
 * @param {Object} [context]
 * @return {Promise} nil
 */

module.exports = function(obj, fn, ctx){
	var promise = new Promise
	if (obj == null) return promise.write()
	var i = 0
	var pending = obj.length
	// array
	if (pending === +pending) {
		var next = function(){
			if (i === pending) promise.write()
			else when(fn.call(ctx, obj[i], i++), next, fail)
		}
	} else {
		var keys = []
		for (var k in obj) keys.push(k)
		var pending = keys.length
		var next = function(){
			var k = keys[i++]
			if (i > pending) promise.write()
			else when(fn.call(ctx, obj[k], k), next, fail)
		}
	}

	var fail = function(e) { promise.error(e) }

	next()

	return promise
}
