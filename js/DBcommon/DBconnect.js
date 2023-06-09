import * as mysql from "mysql2";
import * as http from "http";

function DBconnect(DBname) {
    var con = mysql.createConnection({
        host:"localhost",
        user: "admin",
        password: "admin",
        database: DBname
    })
    return con;
};

export default DBconnect;
