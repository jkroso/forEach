var should = require('chai').should()
  , each = require('../src')
  , eachSeries = each.series

function random () {
	return Math.round(Math.random() * 10)
}

describe('forEach([...], fn, cb) async', function () {
	it('should enumerate each value before calling completing', function (done) {
		each([1,3,2], function (item, done) {
			item.should.be.within(1, 3)
			setTimeout(done, random())
		}, done)
	})
})

describe('forEach empty array', function () {
	it('should not call the iterator', function (done) {
		each([], function (item) {
			throw new Error('should not call the iterator')
		}, done)
	})
})

describe('forEach error', function () {
	it('should pass the error to the callback', function (done) {
		each([1,2,3], function(x, callback){
			callback('error')
		}, function(err){
			err.should.equal('error')
			done()
		})
	})
})

describe('forEach no callback', function(){
	it('should not error', function () {
		each([1], function (val, done) {
			val.should.equal(1)
			done()
		})
	})
})

describe('forEachSeries', function(){
	it('should perform operation sequentially', function (done) {
		var i = 0
		eachSeries([1, 2, 3], function (value, done) {
			value.should.equal(++i)
			setTimeout(done, random())
		}, function (err) {
			should.not.exist(err)
			i.should.equal(3)
			done()
		})
	})
})

describe('forEachSeries empty array', function () {
	it('should not call the iterator', function (done) {
		eachSeries([], function(x, callback){
			throw Error('should not be called')
		}, done)
	})
})

describe('forEachSeries error', function () {
	it('should pass the error to the callback', function (done) {
		eachSeries([1,2,3], function(x, callback){
			callback('error')
		}, function(err){
			err.should.equal('error')
			done()
		})
	})
})

describe('forEachSeries no callback', function(){
	it('should not error', function () {
		each([1], function (val, done) {
			val.should.equal(1)
			done()
		})
	})
})
