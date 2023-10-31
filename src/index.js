const http = require("http");
const binarySearchLogFile = require("../lib/logFinder");

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  if (method === "GET" && url?.startsWith("/logs")) {
    const query = new URLSearchParams(url.split("?")[1] || "");
    const timestamp = query.get("timestamp")?.trim();

    if (!timestamp) {
      res.statusCode = 400;
      res.end("timestamp is mandatory");
    } else {
      const searchedLog = binarySearchLogFile(timestamp);

      if (searchedLog) {
        res.statusCode = 200;
        res.end(searchedLog);
      } else {
        res.statusCode = 400;
        res.end("No log found with the timezone specified");
      }
    }
  } else {
    res.statusCode = 404;
    res.end("Resource not found");
  }
});

server.listen(3000, () => console.log(`Server is listening on port: 3000`));
