const http = require("node:http");
const fs = require("fs");
const url = require("url");
const DB = require("./js/DBactions");
const path = require("path");
const express = require("express");
const util = require("node:util")

const app = express();

// funcionamento do site

// iniciando o webserver----------------------------------------------------

// Abrindo o webserver com Express
const host = "localhost";
const port = 8080;

app.set("view engine", "ejs");
app.use(express.static(__dirname));

app.get("/product", async function (req, res) {
  var q = url.parse(req.url, true);
  var info = await DB.getProductAllInfoById(1);
  res.render(__dirname + "/product.ejs", {
    info: info,
  });
});

app.get("*", function (req, res) {
  var q = url.parse(req.url, true);
  res.render(__dirname + "/404.ejs", {
    q: q,
  });
});

app.listen(port, host, () => {
console.log(`Server is running on http://${host}:${port}`)});
  
// abrindo o webserver com HTTP
// const requestListener = function (req, res) {
//   var q = url.parse(req.url, true);
//   var filename = "." + q.pathname
//   console.log(filename);
//   if (fs.existsSync(filename) && (filename != "./")) {
//     fs.readFile(filename, function(err, data) {
//       if (err) throw err;
//       var ext = path.extname(filename);
//       if (ext != ".html") {
//         if (ext == ".css") {
//           res.writeHead(200, {"Content-Type": "text/css"});
//         }
//         if (ext == ".js") {
//           res.writeHead(200, {"Content-Type": "text/javascript"});
//         }
//       };
//       res.write(data);
//       res.end();
//     })
//   }
//   else {
//     res.writeHead(200, {"Content-Type": "text/html"});
//     res.write("404 " + filename + " not found");
//     res.end();
//   }
// };

// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//   console.log(`Server is running on http://${host}:${port}`);
// });