var http = require("node:http");
var fs = require("fs");
var url = require("url");
var mysql = require("mysql2");
var path = require("path")

// conectando à database-----------------------------------------------

var conProducts = mysql.createConnection({
  host:"localhost",
  user: "admin",
  password: "admin",
  database: "products"
});

var conAccounts = mysql.createConnection({
  host:"localhost",
  user: "admin",
  password: "admin",
  database: "accounts"
});

// operações na database---------------------------------------------

  // products----------------------------------------------------------------

    // getProductInfo -----------------

    // insertProductInfo -----------------

    //editProductinfo -------------------

  //  accounts-----------------------------------------------------------------

    // createAccount ---------------------------

    // authenticateLogin -----------------------------

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
        // else res.writeHead(200, {"Content-Type": "text/html"});
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