var mysql = require("mysql2");

var con = mysql.createConnection({
    host:"localhost",
    user: "admin",
    password: "admin",
    database: "website"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to DB products")
    
    con.query(
        "CREATE TABLE website.products (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,name VARCHAR(20) NOT NULL,model1 VARCHAR(20) NOT NULL,model2 VARCHAR(20) NOT NULL,year INT NOT NULL,seats INT NOT NULL,doors INT NOT NULL,trunkL INT NOT NULL,fuel VARCHAR(20) NOT NULL,transmission VARCHAR(20) NOT NULL,steering VARCHAR(20) NOT NULL,ABS TINYINT NOT NULL,airbags TINYINT NOT NULL, price FLOAT NOT NULL)",
        function (err, results, fields) {
            if (err) throw err;
            console.log("Table products created");
            process.exit();
        });
    //create table accounts
})