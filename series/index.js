
var promising = require('./promise')
var cps = require('./cb')

/**
 * Dispatch to the appropriate implementation depending 
 * on if `fn` can support CPS 
 */

module.exports = function(obj, fn, ctx){
	return fn.length < 3
		? promising(obj, fn, ctx)
		: cps(obj, fn, ctx)
}