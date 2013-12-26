
var apply = require('lift-result/apply')
var ResultType = require('result-type')
var lift = require('lift-result')
var Result = require('result')
var each = require('./index')

/**
 * parallel each
 *
 * @param {Object|Array} obj
 * @param {Function} fn(value, key)
 * @param {Object} [context]
 * @return {Result}
 */

module.exports = lift(function(obj, fn, ctx){
	var result = new Result
	var done = false
	var pending = 0

	function fail(e){
		result.error(e)
	}

	function write(){
		if (--pending === 0 && done) result.write()
	}

	each(obj, function(value, key){
		try { var ret = apply.call(ctx, value, key, fn) }
		catch (e) { return fail(e) }
		if (ret instanceof ResultType) {
			pending++
			ret.read(write, fail)
		}
	})

	if (pending === 0) result.write()
	else done = true

	return result
})