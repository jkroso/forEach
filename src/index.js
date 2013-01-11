exports = module.exports = forEach

/**
 * Apply an operation to each item in an array like object. The 3rd argument
 * is an optional callback to be called on completion if there are any errors 
 * they will be passed into this callback. Note only errors passed to their 
 * respective done callbacks are propagated to the final callback. So thrown 
 * errors are not caught.
 *
 *   forEach([1,2,3], function(i, done){
 *     // do stuff
 *     done()
 *   }, function(err){
 *     // called when all items have called their done callback
 *   })
 *
 * @param {Arraylike object} array anything with a length and numeric properties
 * @param {Function} iterator
 * @param {Function} [done]
 */

function forEach (array, iterator, done) {
	var i = array.length
	  , pending = i

	if (!pending) return next()

	while (i--) iterator(array[i], next)

	function next (error) {
		if (error) {
			done && done(error)
			// Ensure it doesn't get called again
			done = noop
		}
		else if (--pending <= 0) done && done(null)
	}
}

/**
 * Like forEach but the next item will not be proccessed until the previous one completes
 * 
 * @see forEach
 */

exports.series = forEachSeries
function forEachSeries (array, iterator, done) {
	var pending = array.length
	  , i = 0

	function next (err) {
		if (err) done && done(err)
		else if (i === pending) done && done(null)
		else iterator(array[i++], next)
	}

	next()
}

function noop () {}