
var parallel = require('../async')
var series = require('../series')
var Result = require('result')
var chai = require('./chai')
var each = require('..')

function delay(value){
	var result = new Result
	setTimeout(function(){
		if (value instanceof Error) result.error(value)
		else result.write(value)
	}, Math.random() * 10)
	return result
}

function error(){
	throw new Error('should not be called')
}
var context = {}

describe('each', function(){
	it('should handle arrays', function(){
		var res = []
		each([1,2,3], function(v, k){
			this.should.equal(context)
			res.push([k,v])
		}, context)
		res.should.deep.equal([[0,1], [1,2], [2,3]])
	})

	it('should handle objects', function(){
		var res = []
		each({a:1,b:2,c:3}, function(v, k){
			this.should.equal(context)
			res.push([k,v])
		}, context)
		res.should.deep.equal([['a',1], ['b',2], ['c',3]])
	})
})

describe('series', function(){
	it('should handle arrays', function(done){
		var res = []
		series([1,2,3], function(v, k){
			this.should.equal(context)
			return delay().then(function(){
				res.push([k,v])
			})
		}, context).then(function(){
			res.should.deep.equal([[0,1], [1,2], [2,3]])
		}).node(done)
	})

	it('should handle objects', function(done){
		var res = []
		series({0:1,1:2,2:3}, function(v, k){
			this.should.equal(context)
			return delay().then(function(){
				res.push([k,v])
			})
		}, context).then(function(){
			res.should.deep.equal([['0',1], ['1',2], ['2',3]])
		}).node(done)
	})

	describe('should immediatly complete if given empty imput', function(){
		test('array', [])
		test('object', {})
		test('null', null)
		test('undefined', undefined)

		function test(what, value){
			it(what, function(done){
				series(value, error).node(done)
			})
		}
	})

	describe('error handling', function(){
		it('array', function(done){
			series([1,2,3], function(v, k){
				return delay(new Error(v.toString()))
			}).then(null, function(e){
				e.message.should.equal('1')
				done()
			})
		})

		it('object', function(done){
			series({0:1,1:2,2:3}, function(v,k, next){
				return delay(new Error(v.toString()))
			}).then(null, function(e){
				e.message.should.equal('1')
				done()
			})
		})
	})

	it('immediate resolving `fn`', function(done){
		var res = []
		series([1,2,3], function(value){
			res.push(value)
			return new Result().write(value)
		}).then(function(){
			return series({0:4,1:5,2:6}, function(value){
				res.push(value)
				return new Result().write(value)
			})
		}).then(function(){
			res.should.deep.equal([1,2,3,4,5,6])
		}).node(done)
	})

	syncError([1,2,3], 'array')
	syncError({a:1,b:2,c:3}, 'object')
	function syncError(object, type){
		it('should catch sync errors with an ' + type, function(done){
			var error = new Error(this.test.title)
			series(object, function(){
				throw error
			}).then(null, function(e){
				e.should.equal(error)
				done()
			})
		})
	}
})

describe('parallel', function(){
	it('should handle arrays', function(done){
		parallel([1,2,3], function(v, k){
			this.should.equal(context)
			k.should.equal(v - 1)
			v.should.be.within(1, 3)
			return delay()
		}, context).node(done)
	})

	it('should handle objects', function(done){
		parallel({0:1,1:2,2:3}, function(v, k){
			(+k).should.equal(v - 1)
			this.should.equal(context)
			k.should.be.a('string')
			v.should.be.within(1, 3)
			return delay()
		}, context).node(done)
	})

	it('immediate fulfillment', function(done){
		var i = 0
		parallel({0:1,1:2,2:3}, function(v, k){
			return new Result().write(i++)
		}, context)
		.then(function(){
			i.should.equal(3)
		})
		.then(function(){
			return parallel([1,2,3], function(v, k){
				return new Result().write(i++)
			}, context)
		})
		.then(function(){
			i.should.equal(6)
		})
		.node(done)
	})

	describe('should immediatly complete if given empty imput', function(){
		test('array', [])
		test('object', {})
		test('null', null)
		test('undefined', undefined)

		function test(what, value){
			it(what, function(done){
				parallel(value, error).node(done)
			})
		}
	})

	describe('error handling', function(){
		it('array', function(done){
			parallel([1,2,3], function(v,k){
				return delay(new Error(v.toString()))
			}).then(null, function(e){
				e.should.be.an.instanceOf(Error)
				done()
			})
		})

		it('object', function(done){
			parallel({0:1,1:2,2:3}, function(v, k){
				return delay(new Error(v.toString()))
			}).then(null, function(e){
				e.should.be.an.instanceOf(Error)
				done()
			})
		})

		it('should catch sync errors', function(done){
			var error = new Error(this.test.title)
			parallel([1,2,3], function(){
				throw error
			}).then(null, function(e){
				e.should.equal(error)
				done()
			})
		})
	})

	it('nested Promises', function(done){
		parallel({a: delay(1) }, function(n, k){
			k.should.equal('a')
			n.should.equal(1)
		}).node(done)
	})
})