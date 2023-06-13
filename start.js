const fs = require("fs");
const url = require("url");
const DB = require("./public/js/DBactions");
const express = require("express");

const app = express();

// funcionamento do site

// iniciando o webserver----------------------------------------------------

// Abrindo o webserver com Express
const host = "localhost";
const port = 8080;
const path = "/view"

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/product", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  if (req.query.id) var info = await DB.getProductAllInfoById(req.query.id);
  res.render(__dirname + path + "/product.ejs", {
    info: info,
  });
});

app.get("*", async function (req, res) {
  var q = url.parse(req.url, true);
  const ext = ".ejs";
  if (fs.existsSync("." + path + q.pathname + ext)) {
    console.log(q.pathname)
    res.render(__dirname + path + q.pathname + ext);
  }
  else {
    console.log("404 " + q.pathname);
    res.render(__dirname + "/404.ejs", {
      q: q,
    });
  }
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