#!/usr/bin/node

const http = require("http");
const fs = require("fs");
const node_static = require("node-static");

console.log("Inicializando el servidor web");

let public_files = new(node_static.Server)("/home/enti/marcas_uf3/pub");

http.createServer((request, response) => {
	console.log(request.url);

	public_files. serve(request, response);

/*
	if (request.url == "/fondo_estrellado.jpg"){
		fs.readFile("fondo_estrellado.jpg", (error, content) => {
			response.writeHead(200, {'Content-Type': 'image/jpg'});
			response.write(content);
			response.end();
		});
	}
	else {

		fs.readFile("index.html", (error, content) => {
			response.writeHead(200, {'Content-Type': 'text/html'});

			response.write(content);

			response.end();
		});
	}
*/
}).listen(8080);

