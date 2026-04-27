const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");
const { PORT } = require("./config/env");

connectDB();

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// swapnil
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZWJhNGEyNzNlOTk5NWI3MzA5ZTI5MiIsImlhdCI6MTc3NzA1MDc5NSwiZXhwIjoxNzc3NjU1NTk1fQ.hqC38wEQie8ze-yV3yh1tIN-06UbycVwNeqZREFTb0w



// hritik 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZWJhMzc2MjliZDhhZjNhZTViNmJiYSIsImlhdCI6MTc3NzA1MDUwMCwiZXhwIjoxNzc3NjU1MzAwfQ.ifsoGhnxSLjWvvSC0P6kg-aMJpE55HT2WV3DMPYwAKk

// project invite token
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiI2OWViYTNiNTlhZGVhZThlYWM4ZWQ5NTciLCJpYXQiOjE3NzcwNTA3MDcsImV4cCI6MTc3NzA1MjUwN30.cF6Fi_beuP-NjyDkRdexQjEcjZMhUIhE2Fyfek4MtQk

// task AA ID
// 69ebb0ce208e4a242842dcae

// task BB ID
// 69ebb1096311e935d8cf80da