var http = require('http'); 
var chartServer = require('./server/chat_server');
var fileServer= require('./server/file-server.js');
var cache = {}; 

let server  = http.createServer((request, response) => {
    // 文件的绝对路径
    let filePath = request.url === '/' ? 'public/index.html' : 'public' + request.url;
    // 文件相对路径
    let absPath = './' + filePath;

    fileServer.serverStatic(response, cache,  absPath);
});

server.listen(8087, () => {
    console.log('server listening on port 8087');
});

// 启动socket，跟HTTP 服务器共享一个TCP/IP 端口
chartServer.socketioListen(server);
