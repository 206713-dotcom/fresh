import http from "http";
import fs from "fs";

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(fs.readFileSync("sheet-preview.html"));
});
server.listen(4173, "127.0.0.1", () => {
  console.log("preview on 4173");
});
