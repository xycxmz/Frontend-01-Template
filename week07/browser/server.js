const http = require('http');

const server = http.createServer((req, res) => {

	console.log(req.method, req.url);
	console.log(req.headers);
	res.setHeader('Content-Type', 'text/html');
	res.writeHead(200);
	res.end("ok");
	});

server.listen(8080);
