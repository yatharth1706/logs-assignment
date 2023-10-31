## HTTP Server

Created http server that can search a very big log file according to the timestamp user will provide. Have created the below endpoint which user can call

```
GET localhost:3000/logs?timestamp=2020-01-01T05:45:31.296Z
```
## Endpoint
- /logs

## Params
- timestamp - Mandatory

## Approach used
- As the file can be very big till TB, we can't directly read the full file and the search the timestamp line by line.
- Instead we can utilize binary search and read file in chunks.
- I am using a window approach. My window will be of max 512 bytes.
- I will first search in my window if timestamp is there or not.
- If not i will change the window position via binary search and perform same steps again
- Have found out all edge cases and solved them.

## Steps to setup the project
- Fork the repository
- Run following command to start the server
```
npm start
```
- Now the server is up and running and in postman or browser you can try following endpoint and change timezone according to your need
```
localhost:3000/logs?timestamp=2020-01-01T05:45:31.296Z
```
