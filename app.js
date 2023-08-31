const express = require("express");
const morgan = require("morgan");
const webSocket = require("./src/socket/socket");

const app = express();
var server = require("http").createServer(app);

const earthRouter = require("./src/routes/earth.route");
const issRouter = require("./src/routes/iss.route");
const weatherRouter = require("./src/routes/weather.route");

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/earth", earthRouter);
app.use("/api/iss", issRouter);
app.use("/api/weather", weatherRouter);
webSocket(server, app);

app.listen(3000, () => console.log("Listening on port 3000"));
