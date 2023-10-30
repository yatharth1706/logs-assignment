import * as http from "http";
import * as fs from "fs";

const logFilePath = "./logfile.txt";

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.method == "GET" && req.url?.startsWith("/logs")) {
      const query = new URLSearchParams(req.url?.split("?")[1] ?? "");
      const timestamp = query.get("timestamp");

      if (!timestamp) {
        res.statusCode = 400;
        res.end("Bad request: Missing timestamp parameter");
      } else {
        binarySearchLogFile(res, timestamp);
      }
    } else {
      res.statusCode = 404;
      res.end("Resource not valid");
    }
  }
);

const binarySearchLogFile = (res: http.ServerResponse, timestamp: string) => {
  let left = 0;
  const fileSize = fs.statSync(logFilePath).size;
  let right = fileSize;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    const fd = fs.openSync(logFilePath, "r");
    const buffer = Buffer.alloc(100); // Adjust buffer size as needed

    fs.readSync(fd, buffer, 0, buffer.length, mid);

    const data = buffer.toString("utf8");
    fs.closeSync(fd);

    const lines = data.split("\n");

    if (lines.length > 1) {
      const secondlastLine = lines[lines.length - 2];
      const lastLine = lines[lines.length - 1];
      const lastLineTimestamp = lastLine.split(" ")[0];
      const secondlastLineTimestamp = secondlastLine.split(" ")[0];
      let finalTimestamp = "";
      let finalLogLine = "";

      if (secondlastLineTimestamp.length === 24) {
        finalTimestamp = secondlastLineTimestamp;
        finalLogLine = secondlastLine;
      } else {
        finalTimestamp = lastLineTimestamp;
        finalLogLine = lastLine;
      }
      if (finalTimestamp === timestamp) {
        return res.end(`Log entry found: ${finalLogLine}`);
      } else if (finalTimestamp < timestamp) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    } else {
      // Incomplete line, adjust right pointer to avoid this line
      right = mid - 1;
    }
  }

  console.log("Log entry not found");
  res.end("Log entry not found");
};

server.listen(3000, () => {
  console.log(`Server is running on port: ${3000}`);
});
