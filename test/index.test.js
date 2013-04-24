
var should = require('chai').should()
  , each = require('..')
  , series = require('../series')
  , parallel = require('../async')

function random () {
	return Math.round(Math.random() * 10)
}

function delay(fn){
	var args = [].slice.call(arguments, 1)
	setTimeout(function () {
		fn.apply(null, args)
	}, random())
}

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
			v.should.be.within(1, 3)
			delay(next)
		}, context).node(done)
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