const { Server } = require("socket.io");
const { createServer } = require("http");
const { instrument } = require("@socket.io/admin-ui");
const { getIssPosition } = require("../service/iss.service");

module.exports = (server, app) => {
  console.log("CONNECT SOCKET.IO");
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    path: "/socket.io",
    transports: ["websocket"],
    cors: {
      origin: ["https://admin.socket.io", "http://localhost:3030", "http://localhost:3000"],
      credentials: true,
    },
  }); // socket.io 패키지와 express 서버 연결

  instrument(io, {
    auth: false,
    namespaceName: "/admin",
    readonly: true,
  });

  app.set("io", io); // 라우터에서 io 객체를 쓸 수 있게 저장. req.app.get('io')로 접근 가능

  const adminNamespace = io.of("/admin");
  const issNamespace = io.of("/iss");

  const getIssPositionPerSec = async () => {
    const msg = await getIssPosition();

    issNamespace.emit("current", msg);
  };

  issNamespace.on("connection", async (socket) => {
    try {
      console.log("connect iss namespace");
      console.log("socket id", socket.id);

      setInterval(function () {
        getIssPositionPerSec();
      }, 1000);

      socket.on("disconnect", async () => {
        console.log("break connection iss namespace");
      });
    } catch (err) {
      console.log(err);
    }
  });

  httpServer.listen(3030, "0.0.0.0", (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
};
