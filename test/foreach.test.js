
var parallel = require('../async')
  , series = require('../series')
  , Result = require('result')
  , chai = require('./chai')
  , each = require('..')

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
	})
})