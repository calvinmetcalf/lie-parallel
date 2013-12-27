'use strict';
var parallel = require('../lib/parallel');
require("mocha-as-promised")();
var chai = require("chai");
chai.should();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var resolve = require('lie-resolve');
var reject = require('lie-reject');
var cast = require('lie-cast');
var Promise = require('lie');
function async(time, value){
  return new Promise(function(yes){
    setTimeout(function(){
      yes(value);
    },time)
  });
}
describe("parallel",function(){
    describe('iter like',function(){
        it('should work with some promises',function(){
            return parallel(cast([resolve(1),resolve(2),resolve(3)]),1).should.become([1,2,3]);
        });
        it('should work with some mixed stuff',function(){
            return parallel(cast([resolve(1),2,resolve(3)]),1).should.become([1,2,3]);
        });
        it('should work async stuff',function(){
            return parallel(cast([async(100,1),async(5,2),async(40,3)]),1).should.become([1,2,3]);
        });
        it('should work async failure',function(){
            return parallel(cast([async(100,1),reject(2),async(40,3)]),1).should.be.rejected;
        });
    });
    describe('map like',function(){
        it('should work with some promises',function(){
            return parallel(cast([resolve(1),resolve(2),resolve(3)])).should.become([1,2,3]);
        });
        it('should work with some mixed stuff',function(){
            return parallel(cast([resolve(1),2,resolve(3)])).should.become([1,2,3]);
        });
        it('should work async stuff',function(){
            return parallel(cast([async(100,1),async(5,2),async(40,3)])).should.become([1,2,3]);
        });
        it('should work async failure',function(){
            return parallel(cast([async(100,1),reject(2),async(40,3)])).should.be.rejected;
        });
    });
    describe('2 like',function(){
        it('should work with some promises',function(){
            return parallel(cast([resolve(1),resolve(2),resolve(3)]),2).should.become([1,2,3]);
        });
        it('should work with some mixed stuff',function(){
            return parallel(cast([resolve(1),2,resolve(3)]),2).should.become([1,2,3]);
        });
        it('should work async stuff',function(){
            return parallel(cast([async(100,1),async(5,2),async(40,3)]),2).should.become([1,2,3]);
        });
        it('should work async failure',function(){
            return parallel(cast([async(100,1),reject(2),async(40,3)]),2).should.be.rejected;
        });
    });
    describe('order',function(){
        var arr = [];
        function async(tv){
            var time = tv[0];
            var value = tv[1];
          return new Promise(function(yes){
            setTimeout(function(){
              arr.push(value);
              yes();
            },time)
          });
        }
        it('should work',function(){
            arr = [];
            return parallel([[100,1],[5,2],[40,3]],1,async).then(function(){
                return arr;
            }).should.become([1,2,3]);
        });
        it('should work 2',function(){
            arr = [];
            return parallel([[100,1],[50,2],[5,3]],2,async).then(function(){
                return arr;
            }).should.become([2,3,1]);
        });
         it('should work 3',function(){
            arr = [];
            return parallel([[100,1],[50,2],[5,3]],async).then(function(){
                return arr;
            }).should.become([3,2,1]);
        });
    });
});