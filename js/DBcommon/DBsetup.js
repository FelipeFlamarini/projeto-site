import DBconnect from "../DBconnect";
var con = DBconnect("products");

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!")
    var sql = "CREATE TABLE teste (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))";

})