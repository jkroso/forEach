
var promised = require('./promise')
var cps = require('./cb')

/**
 * Asynchronous parallel each. If `fn` takes less
 * than 3 arguments it will be expected to return a 
 * promise otherwise it will be expected to call `done`.
 * If an error occurs you can passed it to `done` ala nodejs
 *
 * @param {Object|Array} obj
 * @param {Function} fn (value, key[, done])
 * @param {Object} [context]
 * @return {Promise} nil
 */

module.exports = function(obj, fn, ctx){
	return fn.length < 3
		? promised(obj, fn, ctx)
		: cps(obj, fn, ctx)
}
