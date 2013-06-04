
var should = require('chai').should()
  , each = require('..')
  , series = require('../series')
  , parallel = require('../async')
  , promise = require('laissez-faire')
  , promisify = require('promisify')

function random(){
	return Math.round(Math.random() * 10)
}

function delay(fn){
	var args = [].slice.call(arguments, 1)
	var self = this
	setTimeout(function () {
		fn.apply(self, args)
	}, random())
}

var pelay = promisify(delay)

function error(){ throw new Error('should not be called') }

var context = {}

describe('each', function () {
	it('should handle arrays', function () {
		var res = []
		each([1,2,3], function(v, k){
			this.should.equal(context)
			res.push([k,v])
		}, context)
		res.should.deep.equal([[0,1], [1,2], [2,3]])
	})

	it('should handle objects', function () {
		var res = []
		each({a:1,b:2,c:3}, function(v, k){
			this.should.equal(context)
			res.push([k,v])
		}, context)
		res.should.deep.equal([['a',1], ['b',2], ['c',3]])
	})
})

describe('series', function () {
	it('should handle arrays', function (done) {
		var res = []
		series([1,2,3], function(v, k, done){
			this.should.equal(context)
			res.push([k,v])
			delay(done)
		}, context).then(function(){
			res.should.deep.equal([[0,1], [1,2], [2,3]])
		}).node(done)
	})

	it('should handle objects', function (done) {
		var res = []
		series({0:1,1:2,2:3}, function(v, k, next){
			this.should.equal(context)
			delay(function(){
				res.push([k, v])
				next()
			})
		}, context).then(function(){
			res.should.deep.equal([['0',1], ['1',2], ['2',3]])
		}).node(done)
	})

	describe('promise handling if `fn.length < 3`', function(){
		it('objects', function(done){
			var res = []
			var object = Object.create(null)
			object[0] = 1
			object[1] = 2
			object[2] = 3
			series(object, function(v, k){
				this.should.equal(context)
				return pelay().then(function(){
					res.push([k, v])
				})
			}, context).then(function(){
				res.should.eql([['0',1], ['1',2], ['2',3]])
				done()
			})
		})

		it('arrays', function(done){
			var res = []
			series([1,2,3], function(v, k){
				this.should.equal(context)
				return pelay().then(function(){
					res.push([k, v])
				})
			}, context).then(function(){
				res.should.eql([[0,1], [1,2], [2,3]])
				done()
			})
		})
	})

	describe('should immediatly complete if given empty imput', function (done) {
		test('array', [])
		test('object', {})
		test('null', null)
		test('undefined', undefined)

		function test(what, value){
			it(what, function (done) {
				series(value, error).node(done)
			})
		}
	})

	describe('error handling', function () {
		it('array', function (done) {
			series([1,2,3], function(v,k, next){
				delay(next, new Error(v.toString()))
			}).then(null, function(e){
				e.message.should.equal('1')
				done()
			})
		})

		it('object', function (done) {
			series({0:1,1:2,2:3}, function(v,k, next){
				delay(next, new Error(v.toString()))
			}).then(null, function(e){
				e.message.should.equal('1')
				done()
			})
		})
	})

	describe('immediate resolving `fn`', function () {
		it('promises', function (done) {
			var res = []
			series([1,2,3], function(value){
				res.push(value)
				return promise().fulfill(value)
			}).then(function(){
				return series({0:4,1:5,2:6}, function(value){
					res.push(value)
					return promise().fulfill(value)
				})
			}).then(function(){
				res.should.deep.equal([1,2,3,4,5,6])
			}).node(done)
		})

		it('callbacks', function (done) {
			var res = []
			series([1,2,3], function(value, i, next){
				res.push(value)
				next()
			}).then(function(){
				return series({0:4,1:5,2:6}, function(value, i, next){
					res.push(value)
					next()
				})
			}).then(function(){
				res.should.deep.equal([1,2,3,4,5,6])
			}).node(done)
		})
	})
})

describe('parallel', function () {
	it('should handle arrays', function (done) {
		parallel([1,2,3], function(v, k, done){
			this.should.equal(context)
			k.should.equal(v - 1)
			v.should.be.within(1, 3)
			delay(done)
		}, context).node(done)
	})

	it('should handle objects', function (done) {
		parallel({0:1,1:2,2:3}, function(v, k, next){
			this.should.equal(context);
			(+k).should.equal(v - 1)
			k.should.be.a('string')
			v.should.be.within(1, 3)
			delay(next)
		}, context).node(done)
	})

	it('should work with promises if `fn.length < 3`', function (done) {
		parallel({0:1,1:2,2:3}, function(v, k){
			this.should.equal(context);
			(+k).should.equal(v - 1)
			k.should.be.a('string')
			v.should.be.within(1, 3)
			return promise(function(fulfill){
				delay(fulfill)
			})
		}, context).node(done)
	})

	describe('immediate fulfillment', function () {
		it('promises', function (done) {
			var i = 0
			parallel({0:1,1:2,2:3}, function(v, k){
				return promise().fulfill(i++)
			}, context)
			.then(function(){
				i.should.equal(3)
			})
			.then(function(){
				return parallel([1,2,3], function(v, k){
					return promise().fulfill(i++)
				}, context)
			})
			.then(function(){
				i.should.equal(6)
			})
			.node(done)
		})

		it('callbacks', function (done) {
			var i = 0
			parallel({0:1,1:2,2:3}, function(v, k, done){
				done(null, i++)
			}, context)
			.then(function(){
				i.should.equal(3)
			})
			.then(function(){
				return parallel([1,2,3], function(v, k, done){
					done(null, i++)
				}, context)
			})
			.then(function(){
				i.should.equal(6)
			})
			.node(done)
		})
	})

	describe('should immediatly complete if given empty imput', function (done) {
		test('array', [])
		test('object', {})
		test('null', null)
		test('undefined', undefined)
		
		function test(what, value){
			it(what, function (done) {
				parallel(value, error).node(done)
			})
		}
	})

	describe('error handling', function () {
		it('array', function (done) {
			parallel([1,2,3], function(v,k, next){
				delay(next, new Error(v.toString()))
			}).then(null, function(e){ 
				e.should.be.an.instanceOf(Error)
				done()
			})
		})

		it('object', function (done) {
			parallel({0:1,1:2,2:3}, function(v,k, next){
				delay(next, new Error(v.toString()))
			}).then(null, function(e){ 
				e.should.be.an.instanceOf(Error)
				done()
			})
		})
	})
})