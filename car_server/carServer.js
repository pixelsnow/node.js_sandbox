"use strict";

const http = require("http");

const { port, host } = require("./config.json");

const storage = require("./carStorage");

const server = http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(
    `http://${req.headers.host}${req.url}`
  );
  let resultHtml = "";
  if (pathname === "/cars") {
    resultHtml = createCarsHtml(storage.getAllCars());
  } else if (pathname === "/cartypes") {
    resultHtml = createCarModelsHtml(storage.getAllModels());
  } else if (pathname === "/search/bylicence") {
    const value = searchParams.get("value");
    resultHtml = createCarsHtml(storage.getCar("licence", value));
  } else if (pathname === "/search/bymodel") {
    const value = searchParams.get("value");
    resultHtml = createCarsHtml(storage.getCar("model", value));
  } else {
    resultHtml = "<h1>Error</h1>";
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(resultHtml);
});

server.listen(port, host, () =>
  console.log(`Server ${host}:${port} is running...`)
);

function createCarsHtml(cars) {
  let htmlString = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Cars</title>
    </head>
    <body>
      <h1>Search result</h1>`;
  if (!cars.length) {
    htmlString += "<h2>No cars found</h2>";
  } else {
    htmlString += `<table>
    <thead>
      <tr>
        <th>Model</th>
        <th>Licence</th>
      </tr>
    </thead>
    <tbody>`;
    for (const car of cars) {
      htmlString += `<tr>
        <td>${car.model}</td>
        <td>${car.licence}</td>
        </tr>`;
    }
    htmlString += "</tbody></table>";
  }
  htmlString += "</body></html>";
  return htmlString;
}

function createCarModelsHtml(types) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Car models</title>
    </head>
    <body>
      <h1>Car models</h1>
      <ul>
        <li>${types.join("</li><li>")}</li>
      </ul>
    </body>
  </html>`;
}
