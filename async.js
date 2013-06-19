
var when = require('when/read')
var Result = require('result')

/**
 * parallel each
 * 
 * @param {Object|Array} obj
 * @param {Function} fn(value, key)
 * @param {Object} [context]
 * @return {Result}
 */

module.exports = function(obj, fn, ctx){
	var result = new Result
	if (obj == null) return result.write()
	var len = obj.length
	var pending
	var i = 0
	// array
	if (typeof len == 'number') {
		if (len === 0) return result.write()
		pending = len
		while (i < len) {
			when(fn.call(ctx, obj[i], i++), done, fail)
		}
	} else {
		var keys = []
		for (var k in obj) keys.push(k)
		len = pending = keys.length
		if (len === 0) return result.write()
		while (i < len) {
			when(fn.call(ctx, obj[k = keys[i++]], k), done, fail)
		}
	}

	function fail(e){ result.error(e) }
	function done(){ if (--pending <= 0) result.write() }

	return result
}
