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

// routes ----------------------------------------------------
//productList ------------------------------------------------------
app.get("/productList", async function (req, res) {
  var q = url.parse(req.url, true);
  var imgs = [];
  var amount = 12;
  if (!req.query.page) res.redirect("/productList?page=1")
  else {
    var page = req.query.page;
    var orderBy = req.query.orderBy;
    var ASC = req.query.ASC;
    var queryPage = [];
    for (var i = 2; i < req.query.length; i++) {
      queryPage[i - 2] = req.query.page[i];
    }
    
    
    // criação dos filtros
    var productsColumns = await DB.getColumnsNames("products");
    var filters = {};
    for (var i = 0; i < productsColumns.length; i++) {
      var distinctColumn = await DB.getDistinctColumn(productsColumns[i]);
      Object.assign(filters, {[productsColumns[i]]: distinctColumn});
    }

    // informações de todos os produtos com filtros
    if (!orderBy) var orderBy = "id"
    var filterInfo = [];
    var filterTarget = [];
    for (var i = 0; i < Object.keys(req.query).length - 3; i++) {
        var info = Object.keys(req.query)[i + 3];
        var target = Object.values(req.query)[i + 3];
        filterInfo[i] = info;
      if (target.length != 0) filterTarget[i] = target;
      else filterTarget[i] = "";

    }

    // recebendo produtos da DB
    var products = await DB.getProductsInfoWithFilter(orderBy, ASC, filterInfo, filterTarget, amount, page);

    // ajusta a quantidade para a página amount*(page-1)
    var productsForPage = [];
    for (var i = amount*(page-1), j = 0; i < amount*page & i < products.length; i++, j++) {
      productsForPage[j] = products[i];
    }

    // pageSelector, ajusta o número de páginas
    var count = products.length;
    var maxPage = Math.ceil(count / amount);
    if (maxPage == 0) maxPage = 1;
    if (page > maxPage) res.redirect("/error")
    var pageOption = [];
    for (var i = 2, j = 0; i >= -2; i--, j++) {
      if (page - i > 0 & page - i <= maxPage) pageOption[j] = page - i;
      else pageOption[i] = ""
    }

    // ajusta o preço
    // verifica se há imagem. se não, enviar imagem de indisponível
    for (var i = 0; i < productsForPage.length; i++) {
      productsForPage[i].price = await adjustPrice(productsForPage[i].price);
      var imgsPath = "imgs/cars/" + productsForPage[i].id;
      if (fs.existsSync("public/imgs/cars/" + productsForPage[i].id)) imgs[i] = imgsPath + "/" + fs.readdirSync("public/" + imgsPath)[0];
      else imgs[i] = 0;
    }


    // passando os filtros
    var filterQuery = q.path.split("page=")[1].slice(1)

    res.render(path + "/productList" + ext, {
      products: productsForPage,
      maxPage: maxPage,
      page: page,
      pageOption: pageOption,
      imgs: imgs,
      filters: filters,
      filterQuery: filterQuery,
    });
  }
});

//productList filters ----------------------------------
app.post("/productListFilter", async function (req, res) {
  console.log(req.body);
  res.redirect(url.format({
    pathname: "/productList",
    query: {
      page: 1,
      orderBy: req.body.orderBy,
      ASC: req.body.ASC,
      name: req.body.name,
      model1: req.body.model1,
      year: req.body.year,
      fuel: req.body.fuel,
      transmission: req.body.transmission,
      steering: req.body.steering,
      ABS: req.body.ABS,
      airbags: req.body.airbags,
    }
  }
  ));
});

//createProduct ------------------------------------------------------
app.get("/createProduct", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  res.render(path + "/createProduct" + ext)
});

//createProductPost ------------------------------------------------------
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
      fs.rename(imgsTmpPath + "/" + imgsTmp[i], imgsDestinationPath + "/" + i + ".png", err => {
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

//product ------------------------------------------------------
app.get("/product", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  if (req.query.id) var info = await DB.getProductInfoById(req.query.id);

  // preparando as informações vindas do DB
  if (info) {
    var productId = req.query.id;
    var imgsPath = "imgs/cars/" + productId + "/";
    if (fs.existsSync("public/imgs/cars/" + productId + "/")) var imgs = fs.readdirSync("public/imgs/cars/" + req.query.id + "/");
    else var imgs = 0;
    if (fs.existsSync("view/partials/carDescriptionById/" + productId + ext)) var descriptionPath = "./partials/carDescriptionById/" + productId + ext;
    else var descriptionPath = 0;
    info.price = await adjustPrice(info.price);
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

//deleteProduct ------------------------------------------------------
app.get("/deleteProduct", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  res.render(path + "/deleteProduct" + ext);
})

//deleteProductPost ------------------------------------------------------
app.post("/deleteProductPost", async function (req, res) {
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  if (req.body.productId) var result = await DB.deleteProductById(req.body.productId);
  res.render(path + "/post/deleteProductPost" + ext, {
    result: result,
  });
});

// * ------------------------------------------------------
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

// abre o server
app.listen(port, console.log("http://localhost:${ port }"));

// util
// ajustar valor de preço para o formato RRRR,CC
async function adjustPrice(price) {
  if (Number.isInteger(price)) price = price + ",00";
  else if (String(price).split(".")[1].length == 1) {
    price = String(price).split(".")[0] + "," + String(price).split(".")[1] + "0";
  }
  else {
    price = String(price).split(".")[0] + "," + String(price).split(".")[1].slice(0, 2);
  }
  return price;
}

  
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
//       }
//       res.write(data);
//       res.end();
//     })
//   }
//   else {
//     res.writeHead(200, {"Content-Type": "text/html"});
//     res.write("404 " + filename + " not found");
//     res.end();
//   }
// }

// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//   console.log(`Server is running on http://${host}:${port}`);
// });