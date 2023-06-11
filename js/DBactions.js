const mysql = require("mysql2");

const DB = mysql.createConnection({
    host:"localhost",
    user: "admin",
    password: "admin",
    database: "website"
  });
  
  // operações na database---------------------------------------------
    // table products----------------------------------------------------------------
      // getProductInfo -----------------
      function getProductInfo(id, info) {
        result = DB.query(
            "SELECT " + info + " FROM products WHERE id = " + id,
            function (err, result) {
                if (err) throw err;
                console.log(result);
                return result;
            })
            return result;
    };
  
      //editProductinfo -------------------
      function editProductInfo(id, info, insertion) {
        DB.query (
          "",
          function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            return result;
        })
        return result;
      }
    // table accounts-----------------------------------------------------------------
      // createAccount ---------------------------
      function createAccount(id, info) {
        DB.query (
          "",
          function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            return result;
        })
        return result;
      }
      // authenticateLogin -----------------------------
      function authenticateLogin(id, info) {
        DB.query (
          "",
          function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            return result;
        })
        return result;
      }

module.exports = {
    // products
    getProductInfo,
    editProductInfo,
    
    // accounts
    createAccount,
    authenticateLogin,
};