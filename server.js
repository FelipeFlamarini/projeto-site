const fs = require("fs");
const url = require("url");
const DB = require("./public/js/DBactions");
const express = require("express");
const bodyparser = require("body-parser");
const multer = require("multer");

const app = express();
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const pastaDestino = __dirname + "/public/imgs/cars/tmp";
    cb(null, pastaDestino);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage, limits: { files: 5 } });

// Abrindo o webserver com Express
const host = "localhost";
const port = 8080;
const path = __dirname + "/view";
const imgsTmpPath = __dirname + "/public/imgs/cars/tmp"
const ext = ".ejs";
const descriptionPath = path + "/partials/carDescriptionById"

app.set("view engine", "ejs"); // define engine para mostrar EJS
app.use(express.static(__dirname + "/public")); // pasta com CSS, scripts, imgs e afins
app.use(bodyparser.urlencoded({ limit: "50mb", extended: false}));

app.get("/", async function (req, res) {
  // res.render(path + "index" + ext)
})

app.get("/createProduct", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  res.render(path + "/createProduct" + ext)
});

app.post("/createProductPost", upload.array("img", 5), async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  var values = "id,"
  var isValueNull = false;

  // enviando ao DB
  Object.keys(req.body).forEach(function (key) {
    if (key != "img" & key != "description") values += "\"" + req.body[key] + "\","
  });
  var result = await DB.createProduct(values.slice(0, -1));
  if (result[0]) var productUrl = "http://localhost:8080/product?id=" + String(result[1]);
  else var productUrl = 0;
  
  // recebendo descrição e criando ejs com descrição
  if (result[1] > 0 & req.body.description.length > 0) {
    var descriptionFile = descriptionPath + "/" + result[1] + ext
    fs.writeFileSync(descriptionFile, "");
    req.body.description.split("\r\n").forEach(paragraph => {
      fs.appendFileSync(descriptionFile, "<p>" + String(paragraph) + "</p>\n");
    });
  }

  // recebendo imagens
  if (result[1] > 0 & fs.existsSync(imgsTmpPath)) {
    var imgsTmp = fs.readdirSync(imgsTmpPath);
    var imgsDestinationPath = __dirname + "/public/imgs/cars/" + result[1]
    fs.mkdirSync(imgsDestinationPath);
    for (var i = 0; i < imgsTmp.length; i++) {
      fs.rename(imgsTmpPath + "/" + imgsTmp[i], imgsDestinationPath + "/" + i + "." + imgsTmp[i].split(".")[1], err => {
        if (err) throw err;
        else console.log("moved");
      });
    }
  }
  res.render(path + "/post/createProductPost" + ext, {
    result: result[0],
    productUrl: productUrl,
  });
});

app.get("/product", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  if (req.query.id) var info = await DB.getProductAllInfoById(req.query.id);
  // preparando as informações vindas do DB
  if (info) {
    var productId = req.query.id;
    var imgsPath = "imgs/cars/" + productId + "/";
    if (fs.existsSync("public/imgs/cars/" + productId + "/")) var imgs = fs.readdirSync("public/imgs/cars/" + req.query.id + "/");
    else var imgs = 0;
    if (fs.existsSync("view/partials/carDescriptionById/" + productId + ext)) var descriptionPath = "./partials/carDescriptionById/" + productId + ext;
    else var descriptionPath = 0;
    if (Number.isInteger(info.price)) info.price = info.price + ",00"
    else {
      if (String(info.price).split(".")[1] < 2) {
        info.price = String(info.price).split(".")[0] + "," + String(info.price).split(".")[1] + "0";
      }
      else {
        info.price = String(info.price).split(".")[0] + "," + String(info.price).split(".")[1].slice(0, 1);
      }
    }
    res.render(path + "/product" + ext, {
      productId: productId,
      info: info,
      imgs: imgs,
      imgsPath: imgsPath,
      descriptionPath: descriptionPath, 
    });
  }
  else {
    res.render(path + "/productNotFound" + ext);
  }
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
  if (fs.existsSync(path + q.pathname + ext)) {
    console.log(q.pathname)
    res.render(path + q.pathname + ext);
  }
  else {
    console.log("404 " + q.pathname);
    res.render(path + "/error404" + ext, {
      q: q,
    });
  }
});

app.listen(port, console.log("http://localhost:${ port }"));

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