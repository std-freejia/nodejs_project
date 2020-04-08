
// 객체 하나 만든다. 

var M = {
    v:'v',
    q:'q',
    f:function(){
        console.log(this.v, ' this is function f');
    }
}
// mpart.js 의 기능들 중에 M 이라는 객체를 모듈 바깥에서 사용할 수 있도록 선언.
module.exports = M;

// 참고 : 모듈 추출 
// https://jongmin92.github.io/2016/08/25/Node/module-exports_exports/
