const mysql = require("mysql2");
const util = require("node:util")

const DB = mysql.createConnection({
    host:"localhost",
    user: "admin",
    password: "admin",
    database: "website"
  });

function debug() {
    console.log("debug");
}
  
  // operações na database---------------------------------------------
    // table products - retornos são em array ----------------------------------------------------------------
      // getColumnsNames
      async function getColumnsNames (table) {
        let result = []
        var sql = "SHOW COLUMNS FROM " + table;
        const query = await DB.promise().query(sql);
        for (var i = 0;i < query[0].length; i++) {
            result[i] = query[0][i].Field;
        }
        return result;
      }

      // getProductInfo -----------------
        async function getProductAllInfoById(id) {
            let columns = await getColumnsNames("products");
            var sql = "SELECT * FROM products WHERE id = " + id;
            const query = await DB.promise().query(sql);
            result = query[0][0];
            return result;
        };

      // createProduct -----------------
        async function createProduct(info) {
          return result;
        }
  
      //editProductinfo -------------------
      async function editProductInfo(id, info, insertion) {

        return result;
      }
    // table accounts-----------------------------------------------------------------
      // createAccount ---------------------------
      async function createAccount(id, info) {

      }
      // authenticateLogin -----------------------------
      async function authenticateLogin(id, info) {

      }

module.exports = {
    // products
    getProductAllInfoById,
    editProductInfo,

    // accounts
    createAccount,
    authenticateLogin,
};