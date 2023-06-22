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
    //custom query
    async function customQuery(sql) {
      const query = await DB.promise().query(sql);
      return query;
    }

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

      // incrementInfoByProductId
      async function incrementInfoByProductId(info, id) {
        sql = "UPDATE products SET " + info + " = " + info + " + 1 WHERE id=" + id;
        const query = await DB.promise().query(sql);
      }

      // getProductInfo -----------------
        async function getProductInfoById(id) {
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

      // productList
        // getProductsInfo
        async function getProductsInfo(amount, page) {
          var sql = "SELECT * FROM products ORDER BY id ASC LIMIT " + amount + " OFFSET " + ((page - 1) * amount);
          const query = await DB.promise().query(sql);
          return query;
        }

        // getCount
        async function getCount() {
          var sql = "SELECT COUNT(*) FROM products"
          const query = await DB.promise().query(sql);
          return query;
        }

        // getDistinctColumn
        async function getDistinctColumn(column, ASC = true) {
          var sql = "SELECT DISTINCT " + column + " FROM products ORDER BY " + column;
          if (ASC) sql += " ASC"
          else sql += " DESC"
          const query = await DB.promise().query(sql);
          var distinctColumn = []
          for (var i = 0; i < query[0].length; i++) {
            distinctColumn[i] = Object.values(query[0][i]);
          }
          return distinctColumn;
        }

        // getProductsInfoWithFilter
        async function getProductsInfoWithFilter(orderBy, ASC = 1, info, target, amount, page) {
          var sql = "SELECT * FROM products ";
          var filter = 0;
          for (var i = 0; i < target.length; i++) {
            if (target[i].length) {
              filter = 1;
              break;
            }
          }
          if (filter) { // construindo query para o mysql
            sql += "WHERE "
            for (var i = 0; i < info.length; i++) {
              if (target[i]) {
                sql += info[i] + " IN ("
                if (Array.isArray(target[i])) {
                  for (var k = 0; k < target[i].length; k++) {
                    sql += "\"" + target[i][k] + "\"";
                    if (k < target[i].length - 1) sql += ",";
                  }
                }
                else sql += "\"" + target[i] + "\"";
                sql += ") "
                if (i < info.length - 1) sql += "AND ";
              }
            }
          }
          if (sql.slice(sql.length - 4, -1) == "AND") sql = sql.slice(0, -4);
          else if (sql.slice(sql.length - 3, -1) == "OR") sql = sql.slice(0, -3);
          sql += "ORDER BY " + orderBy + " ";
          if (ASC > 0) sql += "ASC ";
          else sql += "DESC ";
          // sql += "LIMIT " + amount + " OFFSET " + ((page - 1) * amount);
          console.log(sql);
          const query = await DB.promise().query(sql);
          return query[0];
        }



    // table accounts-----------------------------------------------------------------
      // createAccount ---------------------------
      async function createAccount(id, info) {

      }
      // authenticateLogin -----------------------------
      async function authenticateLogin(id, info) {

      }

module.exports = {
    customQuery,

    // products
    getColumnsNames,
    incrementInfoByProductId,
    getProductInfoById,
    createProduct,
    editProductInfoById,
    deleteProductById,
    
    //productList
    getProductsInfo,
    getCount,
    getDistinctColumn,
    getProductsInfoWithFilter,

    // accounts
    createAccount,
    authenticateLogin,
}