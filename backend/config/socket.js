let io;

const initSocket = (server) => {
  const socketIO = require("socket.io");

  io = socketIO(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_project", (projectId) => {
      socket.join(projectId);
    });
  });

  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };