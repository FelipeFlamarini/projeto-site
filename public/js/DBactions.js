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
    // table products -----------------------------------------------------
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
          var sql = "INSERT INTO products VALUES (" + info + ")";
          const query = await DB.promise().query(sql);
          var result = [];
          if (query[0].affectedRows) {
            result[0] = true;
            result[1] = query[0].insertId;
          }
          else result = false;
          return result;
        }
  
      //editProductInfoById -------------------
        async function editProductInfoById(id, info, insertion) {
          return result;
        }

      // deleteProductById
        async function deleteProductById(id) {
          var sql = "DELETE FROM products WHERE id=" + id;
          const query = await DB.promise().query(sql);
          if (query[0].affectedRows) result = true;
          else result = false;
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
    createProduct,
    editProductInfoById,
    deleteProductById,

    // accounts
    createAccount,
    authenticateLogin,
};