var cast = require('lie-cast');
var Promise = require('lie');
function parallel(list, num, func){
  if(typeof num === 'function'){
    func = num;
    num = 0;
  }
  func = func || function(a){return a};
  return cast(list).then(function(list){
    var n = Math.min((num||list.length),list.length);
    return new Promise(function(yes,no){
      var len = list.length;
      var results = [];
      var started = 0;
      var done = 0;
      function callback(i,result){
        results[i] = result;
        if(++done>=len){
          yes(results);
        }else{
          next();
        }
      }
      function next(){
        var i = started++;
        if(started>len){
          return;
        }
        cast(list[i]).then(function(value){
          return cast(func(value,i)).then(callback.bind(null,i),no);
        }).then(null, no);
      }
      for(var i = 0;i<n;i++){
        next();
      }
    });
  });
}
module.exports = parallel;