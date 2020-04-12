
var fs = require('fs'); 
var path = require('path'); 
var mime = require('mime'); 

function send404 (res){
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('Error 404: resource is not found.');
  res.end();
}

function sendFile(res, filePath, fileContent) {
  res.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
  res.end(fileContent);
}

exports.serverStatic = function (res, cache, absPath){
  // 已缓存
  if(cache[absPath]){
      sendFile(res, absPath, cache[absPath]);
  // 未缓存
  }else{
      
      fs.exists(absPath, function (exist) {
          if(exist){
              fs.readFile(absPath, function (err, data) {
                  if (err) send404(res); //  如果读取文件失败
                  cache[absPath] = data; // 缓存读取的文件
                  sendFile(res, absPath, data); 
              })
          }else{
              console.log("not exist");
              send404(res);
          }
      })
  }
};
