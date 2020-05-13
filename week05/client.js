## 参考：https://github.com/SwimmerRcd/Frontend-01-Template/blob/master/week05/NOTE.md
## 参考：https://github.com/volewu/Frontend-01-Template/blob/master/week05/toy/client.js


const net = require('net');

class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.path = options.path || '/';
    this.port = options.port || 80;
    this.body = options.body || {};
    this.headers = options.headers || {};

    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "appliction/x-www-form-urlendoed";
    }
    if (this.headers["Content-Type"] === "appliction/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers["Content-Type"] === "appliction/x-www-form-urlendoed") {
      this.bodyText = Object.keys(this.body)
        .map(key => {
          return `${key}=${encodeURIComponent(this.body[key])}`
        })
        .join('&')
    }
    this.headers['Content-Length'] = this.bodyText.length
  }

  toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
  }
  send(connection) {
    return new Promise((resolve, reject)=>{
      let parser = new ResponseParser();
      if(connection) {
        connection.write(this.toString());
      }else{
        connection = net.createConnection({
          host: this.host,
          port: this.port
        },()=>{
          connection.write(this.toString());
        });
      }
      connection.on('data', (data) => {
        console.log(data.toString());
        parser.receive(data.toString());
        if(parser.isFinished){
          resolve(parser.response);
        }
        connection.end();
      });
      connection.on('error', (error) => {
        reject(error);
        connection.end();
      });
    });
  }
}

class Response {}

class ResponseParser{
  constructor(){
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  receive(string){
    for(let i = 0; i < string.length; i++){
      this.receiveChar(string.charAt(i));
    }
  }
  receiveChar(char){
    if(this.current === this.WAITING_STATUS_LINE) {
      if(char === "\r"){
        this.current = this.WAITING_STATUS_LINE_END;
      } else if(char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      } else {
        this.statusLine += char;
      }
    }
    else if(this.current === this.WAITING_STATUS_LINE_END) {
      if(char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    }
    else if(this.current === this.WAITING_HEADER_NAME) {
      if(char === '\r'){
        this.current = this.WAITING_HEADER_BLOCK_END;
      }
      else if(char === ":") {
        this.current = this.WAITING_HEADER_SPACE;
      } else {
        this.headerName += char;
      }
    }
    else if(this.current === this.WAITING_HEADER_SPACE) {
      if(char === ' '){
        this.current = this.WAITING_HEADER_VALUE;
      }
    }
    else if(this.current === this.WAITING_HEADER_VALUE) {
      if(char === "\r"){
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += char;
      }
    }
    else if(this.current === this.WAITING_HEADER_LINE_END) {
      if(char === '\n'){
        this.current = this.WAITING_HEADER_NAME;
      }
    }
    else if(this.current === this.WAITING_HEADER_BLOCK_END) {
      if(char === '\n'){
        this.current = this.WAITING_BODY;
        if(this.headers['Transfer-Encoding'] === 'chunked'){
          this.bodyParser = new ChunkedBodyParser();
        }
      }
    }
    else if(this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
}

class ChunkedBodyParser {
  constructor () {
    this.READING_LENGTH_FIRSR_CHAR = 0;
    this.READING_LENGTH = 1;
    this.READING_LENGTH_END = 2;
    this.READING_CHUNK = 3;
    this.READING_CHUNK_END = 4;
    this.BODY_BLOCK_END = 5;

    this.current = this.READING_LENGTH_FIRSR_CHAR;
    this.content = []
    this.chunkLength = 0
  }

  get isFinished () {
    return this.current === this.BODY_BLOCK_END
  }

  receiveChar (char) {
    if (this.current === this.READING_LENGTH_FIRSR_CHAR) { // Length的第一个字符是单独一个状态
      if (char === '0') { // Length的第一个字符是'0'的话就是终止块
        this.current = this.BODY_BLOCK_END;
      } else {
        this.chunkLength += Number(`0x${char}`); // chunk-length在包体是16进制
        this.current = this.READING_LENGTH;
      }
    } else if (this.current === this.READING_LENGTH) {
      if (char === '\r') {
        this.current = this.READING_LENGTH_END;
      } else {
        this.chunkLength = this.chunkLength * 16 + Number(`0x${char}`);
      }
    } else if (this.current === this.READING_LENGTH_END) {
      this.current = this.READING_CHUNK;
    } else if (this.current === this.READING_CHUNK) {
      if (char === '\r') {
        this.current = this.READING_CHUNK_END
        this.chunkLength = 0
      } else if (this.chunkLength > 0) {
        this.content.push(char);
        this.chunkLength -= 1;
      }
    } else if (this.current === this.READING_CHUNK_END) {
      this.current = this.READING_LENGTH_FIRSR_CHAR;
    }
  }
}

void async function() {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8088',
    path: '/',
    headers:{
      ["x-Foo2"]: "customed"
    },
    body: {
      name: 'xyc'
    }
  });
  console.log(request.toString());
 let response = await request.send(); 
 console.log(response);
}();
