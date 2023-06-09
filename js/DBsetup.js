function DBconnect(DBname) {
    var con = mysql.createConnection({
        host:"localhost",
        user: "admin",
        password: "admin",
        database: DBname
    })
    return con;
}

var con = DBconnect("products")
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!")
    var sql = "CREATE TABLE teste (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))";

})