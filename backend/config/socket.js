let io;

const initSocket = (server) => {
  const socketIO = require("socket.io");
  io = socketIO(server, {
    cors: {
      origin: "*", //fronend url
      methods: ["GET", "POST"]
    }
  });
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join_project", (projectId) => {
      socket.join(projectId);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };
