var http = require("node:http");
var fs = require("fs");
var url = require("url");
var mysql = require("mysql2");
var path = require("path")

// iniciando o webserver----------------------------------------------------

const host = "localhost";
const port = 8080;

const requestListener = function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname
  console.log(filename);
  if (fs.existsSync(filename) && (filename != "./")) {
    fs.readFile(filename, function(err, data) {
      if (err) throw err;
      var ext = path.extname(filename);
      if (ext != ".html") {
        if (ext == ".css") {
          res.writeHead(200, {"Content-Type": "text/css"});
        }
        if (ext == ".js") {
          res.writeHead(200, {"Content-Type": "text/javascript"});
        }
      };
      res.write(data);
      res.end();
    })
  }
  else {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write("404 " + filename + " not found");
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});