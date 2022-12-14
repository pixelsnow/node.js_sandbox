"use strict";

// Just a nicer way of doing things, with a separate sendFile function

const http = require("http");
const path = require("path");
const fs = require("fs"); // file system module
// const fs = require("fs").promises;

const { port, host } = require("./config.json");

const homePath = path.join(__dirname, "home.html");

const server = http.createServer(async (req, res) => {
  sendFile(res, homePath);
});

server.listen(port, host, () =>
  console.log(`Server ${host}:${port} is running...`)
);

async function sendFile(res, filePath) {
  try {
    const data = await fs.promises.readFile(homePath, "utf8");
    // const data = await fs.readFile(homePath, "utf8");  // FOR THE require("fs").promises VERSION
    res.writeHead(200, {
      "Content-Type": "text/html",
      "Content-Length": Buffer.byteLength(data, "htf-8"),
    });
    res.end(data);
  } catch (err) {
    res.statusCode = 404;
    res.end("Error: ", err.message); // only for debugging
  }
}
