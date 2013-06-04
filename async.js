
var Promise = require('laissez-faire/full')
var when = require('when/read')

/**
 * parallel each
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
	var len = obj.length
	var pending
	// array
	if (len === +len) {
		if (!len) return promise.write()
		pending = len
		while (i < len) {
			when(fn.call(ctx, obj[i], i++), done, fail)
		}
	} else {
		var keys = []
		for (var k in obj) keys.push(k)
		len = pending = keys.length
		if (!len) return promise.write()
		while (i < len) {
			when(fn.call(ctx, obj[k = keys[i++]], k), done, fail)
		}
	}

	function fail(e){ promise.error(e) }
	function done(){ if (--pending <= 0) promise.write() }

	return promise
}
