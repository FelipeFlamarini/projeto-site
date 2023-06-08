var mysql = require('mysql2');
var http = require('http');

var con = mysql.createConnection({
    host:"localhost",
    user: "admin",
    password: "admin",
    database: "mydb"
});

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM customers", function (err, result, fields) {
      if (err) throw err;
      console.log(fields);
    });
  });