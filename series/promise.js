
var Promise = require('laissez-faire/full')
  , when = require('when/read')

/**
 * Asynchronous each
 *
 * @param {Object|Array}
 * @param {Function} (value, key) -> Promise nil
 * @param {Object} context is optional
 * @return {Promise} resolves to nil on completion
 */

module.exports = function(obj, fn, ctx){
	var p = new Promise
	if (obj == null) return p.fulfill()
	var i = 0
	var pending = obj.length
	// array
	if (pending === +pending) {
		var next = function(){
			if (i === pending) p.fulfill()
			else when(fn.call(ctx, obj[i], i++), next, fail)
		}
	} 
	// object
	else {
		var keys = []
		for (var k in obj) keys.push(k)
		var pending = keys.length
		var next = function(){
			var k = keys[i++]
			if (i > pending) p.fulfill()
			else when(fn.call(ctx, obj[k], k), next, fail)
		}
	}

	var fail = function(e) { p.reject(e) }

	next()

	return p
}
