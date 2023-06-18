const fs = require("fs");
const url = require("url");
const DB = require("./public/js/DBactions");
const express = require("express");
const bodyparser = require("body-parser");

const app = express();

// Abrindo o webserver com Express
const host = "localhost";
const port = 8080;
const path = __dirname + "/view"
const ext = ".ejs";

app.set("view engine", "ejs"); // define engine para mostrar EJS
app.use(express.static(__dirname + "/public")); // pasta com CSS, scripts, imgs e afins
app.use(bodyparser.urlencoded({ extended: false}));

app.get("/", async function (req, res) {
  // res.render(path + "index" + ext)
})

app.get("/createProduct", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  res.render(path + "/createProduct" + ext)
});

app.post("/createProductPost", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  var values = "id,"
  var isValueNull = false;
  Object.keys(req.body).forEach(function (key) {
    if (req.body[key] == "") isValueNull = true;
    values += "\"" + req.body[key] + "\","
  });
  var result = await DB.createProduct(values.slice(0, -1));
  res.render(path + "/post/createProductPost" + ext, {
    result: result,
  });
})

app.get("/product", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  var imgs = fs.readdirSync("public/imgs/cars/" + req.query.id + "/");
  var imgsPath = "imgs/cars/" + req.query.id + "/";
  if (req.query.img) var imgDisplay = req.query.img;
  else var imgDisplay = 0;
  if (req.query.id) var info = await DB.getProductAllInfoById(req.query.id);
  res.render(path + "/product" + ext, {
    info: info,
    imgs: imgs,
    imgsPath: imgsPath,
    imgDisplay: imgDisplay,
  });
});

app.get("/deleteProduct", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  res.render(path + "/deleteProduct" + ext);
})

app.post("/deleteProductPost", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  if (req.body.productId) var result = await DB.deleteProductById(req.body.productId);
  res.render(path + "/post/deleteProductPost" + ext, {
    result: result,
  });
});

app.get("*", async function (req, res) {
  var q = url.parse(req.url, true);
  if (fs.existsSync("." + path + q.pathname + ext)) {
    console.log(q.pathname)
    res.render(path + q.pathname + ext);
  }
  else {
    console.log("404 " + q.pathname);
    res.render(path + "/404" + ext, {
      q: q,
    });
  }
});

app.listen( port, console.log( `http://127.0.0.1:${ port }` ) );

// console.log(`Server is running on http://${host}:${port}`)});
  
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