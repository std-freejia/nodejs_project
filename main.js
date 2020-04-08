var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var template = require('./lib/template.js');


// Node.js 강의

// createServer() 접속이 들어올 때마다 콜백함수 동작함
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
        
  if(pathname === '/'){

      if(queryData.id === undefined){

          // 파일 리스트 가져오기 
          fs.readdir('./data', function(error, filelist){
            var title = 'Welcome';
            var description = 'Hello, Node.js'

            var list = template.list(filelist);
            var html = template.HTML(title, list, 
              `<h2>${title}</h2>${description}`, 
              `<a href="/create">create</a>`);

            response.writeHead(200);
            response.end(html);   
          });
        
      }else{ // '글 제목 클릭 시 화면 ' queryData.id 가 존재하는 경우, 

        fs.readdir('./data', function(error, filelist){ // 디렉토리 읽어서 파일 본문 보여주기 

          // 파일 읽어서 본문 보여주기 
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title= queryData.id
            var list = template.list(filelist);
            // 생성, 수정, 삭제 버튼이 보인다 
            var html = template.HTML(title, list, 
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a> 
              <a href="/update?id=${title}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>`);

            // '삭제'는 '링크'로 만들면 안된다. "form 이용하여 POST로 보낸다!"
            // 왜냐면, 클릭 후에 URL 이 변경되면서(쿼리스트링 들어있는 GET방식.) '이동'하기 때문이다. 
            response.writeHead(200);
            //response.end(queryData.id);
            response.end(html);    
          });
        });
      }
    }else if(pathname === '/create'){  // 글 작성 화면 

      // 파일 리스트 가져오기 
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
            <form action="/create_process" method="post">

                <p><input type="text" name="title" placeholder='title'></p>

                <p>
                    <textarea name="description" placeholder = 'description'></textarea>
                </p>

                <p>
                    <input type="submit">
                </p>

            </form>
          `, '');

        response.writeHead(200);
        response.end(html);    

        });

    }else if(pathname === '/create_process'){ // 파일 생성 처리 
      var body = '';
      request.on('data', function(data){  // POST 데이터를 받는다 
        body = body + data;
      });
      request.on('end', function(data){ // on('data') 종료 후에 동작. 'end' : 수신 후의 처리. 
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;

        // 파일에 저장 
        fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
          // 파일 저장 끝난 후의 동작 들.
          // 리다이렉션 (다른 페이지로 보내버림) == 302
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end('success');  

        })
      });

    }else if(pathname=== '/update'){ // 수정 화면 

        fs.readdir('./data', function(error, filelist){
          // 파일 읽어서 본문 보여주기 
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title= queryData.id
            var list = template.list(filelist);

            // 파일명으로 쓰이는 고유 식별자 ${title}을 hidden 으로 실어 보낸다 
            var html = template.HTML(title, list, 
              `
              <form action="/update_process" method="post">

              <input type="hidden" name="id" value="${title}">

              <p><input type="text" name="title" placeholder='title' value="${title}"></p>

              <p>
                  <textarea name="description" placeholder = 'description'>${description}</textarea>
              </p>

              <p>
                  <input type="submit">
              </p>

          </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`)
            response.writeHead(200);
            response.end(html);    
          });
        });

    }else if(pathname === '/update_process'){  // 파일 수정 처리 

      var body = '';
      request.on('data', function(data){ // POST 데이터를 받는다 
        body = body + data;
      });
      request.on('end', function(data){ //  on('data') 종료 후에 동작. 'end' : 수신 후의 처리. 
        var post = qs.parse(body);

        // 파일 식별 id 
        var id = post.id;
        var title = post.title;
        var description = post.description;

        // 파일 rename (이름수정)
        fs.rename(`data/${id}`, `data/${title}`, function(err){
          
            // 파일 내용 수정
          fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
            // 파일 저장 끝난 후 리다이렉션 (다른 페이지로 보내버림) == 302
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end('success');  
          })
        })

      });

    }else if(pathname === '/delete_process'){  // 파일 삭제 처리 

      var body = '';
      request.on('data', function(data){ // POST 데이터를 받는다 
        body = body + data;
      });
      request.on('end', function(data){ //  on('data') 종료 후에 동작. 'end' : 수신 후의 처리. 
        var post = qs.parse(body);
        // 파일 식별 id 
        var id = post.id;

        fs.unlink(`data/${id}`, function(err){ // 파일 삭제 
            // 파일 삭제 후 홈으로 리다이렉션 (다른 페이지로 보내버림) == 302
            response.writeHead(302, {Location: `/`});
            response.end();  
        });

      });
        
    }else{ // Not Found 
        response.writeHead(200);
        response.end('Not Found');
    }

});

app.listen(3000);