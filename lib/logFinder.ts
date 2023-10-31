import * as fs from "fs";

const logFilePath = "./logs/logfile.txt";

function binarySearchLogFile(targetTimestamp: string) {
  let low = 0;
  let high = fs.statSync(logFilePath).size;
  let result = "";

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const fd = fs.openSync(logFilePath, "r");

    // Initializing buffer with 512 bytes assuming every line is of max 256 bytes so i am creating a
    // double size window to search the timestamp

    const buffer = Buffer.alloc(512);
    const startPointer = mid - 256 >= 0 ? mid - 256 : 0;

    fs.readSync(fd, buffer, 0, buffer.length, startPointer);

    // Split logs with new lines
    const logLines = buffer.toString().split("\n");

    let found = false;

    // First we will search in the window if log is there, our window will be very small
    // So we can search using loop, If timestamp present we will return it else, we will change the
    // left and right pointer

    for (let i = 0; i <= logLines.length - 1; i++) {
      const logLine = logLines[i].trim();
      if (logLine.trim() === "" || /^\x00*$/.test(logLine)) continue; // Skip empty lines

      const timeValue = logLine.split(" ")[0];
      if (timeValue.length < 24) continue; // Skip lines with no timestamp

      const timestamp = new Date(logLine.split(" ")[0]).toISOString();

      if (timestamp === targetTimestamp) {
        result = logLine;
        found = true;
        break;
      }
    }

    fs.closeSync(fd);

    // In case our left window is going away from 0 that means we have already searched
    // in the first window so we can break the code

    if (mid - 256 < 0) {
      break;
    }

    if (found) {
      break;
    } else {
      // If the timestamp was not found in the above window, we need to change the window position
      const firstLogLine = logLines[1].trim();
      const lastLogLine = logLines[logLines.length - 2].trim();
      const firstTimestamp = new Date(firstLogLine.split(" ")[0]).toISOString();
      const lastTimestamp = new Date(lastLogLine.split(" ")[0]).toISOString();

      if (lastTimestamp < targetTimestamp) {
        low = mid + 1;
      } else if (firstTimestamp > targetTimestamp) {
        high = mid - 1;
      } else {
        break;
      }
    }
  }

  return result;
}

export default binarySearchLogFile;
