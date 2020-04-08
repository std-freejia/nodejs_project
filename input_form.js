var http= require('http');
var url = require('url');
var fs = require('fs');

var qs = require('querystring');
const puppeteer = require('puppeteer');


// 마번 크롤링
// 출처  http://magic.wickedmiso.com/139

function horse_crawler(user_input){

    // 마적 조회 URL 
    const url = 'http://studbook.kra.co.kr/html/info/ind/stud_s_mapil_retrieve.jsp' 
    
    // launch() 브라우저를  연다
    puppeteer.launch({
          headless : false	// 헤드리스모드의 사용여부를 묻는다.
        , devtools : true	// 개발자 모드의 사용여부를 묻는다.
    
    }).then(async browser => {
    
      console.log("사용자가 입력한 마번 : ", user_input)
    
      // newPage() 새 창을 연다 
      const page = await browser.newPage();
      // 접속할 페이지를 지정
      await page.goto( url, { waitUntil : "networkidle2" } );
      
      // input 폼에 마번 입력 
      await page.evaluate((user_input) => {document.getElementById( "mamyung" ).value = user_input;}, user_input);
        // SUBMIT 기능
        const elementHandle = await page.waitFor( "#mamyung.input02" );
        await elementHandle.press( "Enter" );
    
      // 결과 띄우기 (마명, 마번, 성별, 품종, 부마명, 모마명, 국제마번, 생산국, 소재지, 최종용도, 출생일, 소유자, 생산자, 털색)
      await page.waitFor( "#divList > table > tbody" );
    

      
      data = await page.$("#divList > table > tbody > tr:nth-child(2) > td.td1");
      const horse_name = await page.evaluate(element => {return element.textContent;}, data);
      console.log('마명 : ', horse_name);
    
      data = await page.$("#divList > table > tbody > tr:nth-child(2) > td.td2");
      const register_number = await page.evaluate(element => {return element.textContent;}, data);
      console.log('마번 : ', register_number);
    
      data = await page.$("#divList > table > tbody > tr:nth-child(4) > td.td1");
      const horse_sex = await page.evaluate(element => {return element.textContent;}, data);
      console.log('성별 : ', horse_sex);
    
      data = await page.$("#divList > table > tbody > tr:nth-child(5) > td.td1");
      const breed = await page.evaluate(element => {return element.textContent;}, data);
      console.log('품종 : ', breed);
    
      // 마명에 링크가 걸려있으므로 trim() 필요 
      data = await page.$("#divList > table > tbody > tr:nth-child(11) > td:nth-child(2) ");
      const sire_name = await page.evaluate(element => {return element.textContent;}, data);
      console.log('부마명 : ', sire_name.trim());
    
      data = await page.$("#divList > table > tbody > tr:nth-child(12) > td:nth-child(2) ");
      const dam_name = await page.evaluate(element => {return element.textContent;}, data);
      console.log('모마명 : ', dam_name.trim());
    
      data = await page.$("#divList > table > tbody > tr:nth-child(5) > td.td2");
      const life_number = await page.evaluate(element => {return element.textContent;}, data);
      console.log('국제마번 : ', life_number);
    
      data = await page.$("#divList > table > tbody > tr:nth-child(6) > td.td1");
      const country = await page.evaluate(element => {return element.textContent;}, data);
      console.log('생산국 : ', country);
    
      data = await page.$("#divList > table > tbody > tr:nth-child(8) > td:nth-child(6)");
      const location = await page.evaluate(element => {return element.textContent;}, data);
      console.log('소재지 : ', location.trim());
    
      data = await page.$("#divList > table > tbody > tr:nth-child(7) > td.td1");
      const use = await page.evaluate(element => {return element.textContent;}, data);
      console.log('최종용도 : ', use.trim());
    
      data = await page.$("#divList > table > tbody > tr:nth-child(3) > td.td2");
      const foaling_date = await page.evaluate(element => {return element.textContent;}, data);
      console.log('출생일 : ', foaling_date.trim());
    
      data = await page.$("#divList > table > tbody > tr:nth-child(8) > td:nth-child(4)");
      const owner = await page.evaluate(element => {return element.textContent;}, data);
      console.log('소유자 : ', owner.trim());
    
      data = await page.$("#divList > table > tbody > tr:nth-child(8) > td.td1");
      const breeder = await page.evaluate(element => {return element.textContent;}, data);
      console.log('생산자 : ', breeder.trim());
    
      data = await page.$("#divList > table > tbody > tr:nth-child(4) > td.td2");
      const color = await page.evaluate(element => {return element.textContent;}, data);
      console.log('털색 : ', color.trim());
    
      //브라우저 닫기 
      await browser.close();
    });
    
    }

// createServer() 접속이 들어올 때마다 콜백함수 동작함
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    
    console.log('pathname:', pathname)
    // url 출력 
    //console.log(__dirname + _url);
    // fs.readFileSync(): 파일을 읽어준다 
    //response.end(fs.readFileSync(__dirname + _url));
    
    if(pathname === '/'){

      if(queryData.id === undefined){

        // 폼 화면으로 연결 
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        fs.readFile('form.html', null, function (error, data) {
            if (error) {
                response.writeHead(404);
                respone.write('Whoops! File not found!');
            } else {
                response.write(data, 'utf8');
            }
            response.end();
        });
          
      }else if(queryData.number ===  ){
        // 크롤링 결과 받았을 때, 

      }
    }else if(pathname === '/crawling'){
        // 마번 추출 하여 크롤링 요청 

        var body = '';
        // POST 데이터 추출
        request.on('data', function (data) {
            body += data;
            // Too much POST data, kill the connection!
            if (body.length > 1e6)
                request.connection.destroy(); // 용량 크면 연결 끊음.
        });

        request.on('end', function () {
            var post = qs.parse(body);
            // use post['blah'], etc.
        });

      request.on('end', function(data){ // data가 다들어왔으면,  == end 수신 후처리. 
        var post = qs.parse(body);

        console.log('number:', post.number)

        // 크롤링 요청 
        var resultCrawling = 

        // 리다이렉션 (다른 페이지로 보내버림) == 302
        response.writeHead(302, {Location: '/'});
        response.end('success');  

      });

    }else{ // Not Found 
      response.writeHead(200);
      response.end('Not Found');
    }

});

app.listen(3003);