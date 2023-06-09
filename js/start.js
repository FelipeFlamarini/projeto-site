import * as http from "http";
import * as fs from "fs";

var host = "localhost";
var port = 8080;

function startServer() {
    let server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log("Server running on http://${host}:${port}");
    })
    return server;
}

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "text/html");

};

startServer();