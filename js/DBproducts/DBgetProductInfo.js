import DBconnect from "../DBcommon/DBconnect.js";
var con = DBconnect("products");

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE teste (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))";
    con.query(sql, function (err, result) {
      if (err) {
        var sql = "DROP TABLE teste";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Table dropped")
          console.log(result);
        })
      }
      else console.log("Table created");
    });
  });