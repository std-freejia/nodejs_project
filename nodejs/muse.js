// var M = {
//     v:'v',
//     f:function(){
//         console.log(this.v);
//     }
// }

// 모듈 가져오기  (경로 명시) 
var part = require('./mpart.js');
//require() 키워드는 객체를 반환한다. 

console.log(part);

part.f();
//M.f();