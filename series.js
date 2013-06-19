
var when = require('when/read')
var Result = require('result')

/**
 * Asynchronous but sequential each
 *
 * @param {Object|Array} obj
 * @param {Function} fn(value, key) -> result
 * @param {Object} [context]
 * @return {Result}
 */

module.exports = function(obj, fn, ctx){
	var result = new Result
	if (obj == null) return result.write()
	var pending = obj.length
	var i = 0
	// array
	if (typeof pending == 'number') {
		var next = function(){
			if (i === pending) result.write()
			else when(fn.call(ctx, obj[i], i++), next, fail)
		}
	} else {
		var keys = []
		for (var k in obj) keys.push(k)
		var pending = keys.length
		var next = function(){
			var k = keys[i++]
			if (i > pending) result.write()
			else when(fn.call(ctx, obj[k], k), next, fail)
		}
	}

	var fail = function(e) { result.error(e) }

	next()

	return result
}
