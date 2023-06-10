var mysql = require("mysql2");
var url = require("url");
var path = require("path")
var fs = require("fs");

var conWebsite = mysql.createConnection({
    host:"localhost",
    user: "admin",
    password: "admin",
    database: "website"
  });

function debug() {
    console.log(x)
    alert(x)
}

  // operações na database---------------------------------------------
    // table products----------------------------------------------------------------
      // getProductInfo -----------------
        function getProductInfo() {
            conWebsite.query(
                "SELECT * FROM products WHERE id = 1",
                function (err, result, fields) {
                    if (err) throw err;
                    console.log(result);
                    return result;
                }
            )
        };

      // insertProductInfo -----------------
  
      //editProductinfo -------------------
  
    // table accounts-----------------------------------------------------------------
      // createAccount ---------------------------
  
      // authenticateLogin -----------------------------
  