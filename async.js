
var ResType = require('result-type')
  , Result = require('result')
  , each = require('./index')

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
	var done = false
	var pending = 0
	
	function fail(e){
		result.error(e)
	}

	function write(){
		if (--pending === 0 && done) result.write()
	}

	each(obj, function(value, key){
		try { var ret = fn.call(ctx, value, key) }
		catch (e) { return fail(e) }
		if (ret instanceof ResType) {
			pending++
			ret.read(write, fail)
		}
	})	

	if (pending === 0) result.write()
	else done = true

	return result
}
