const fs = require('fs');
// 파일 읽을때 인코딩 주의  

fs.readFile('sample.txt', 'utf8', function(err, data){
    console.log(data);
});
