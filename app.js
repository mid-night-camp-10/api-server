const express = require("express");
const morgan = require("morgan");

const app = express();

const earthRouter = require("./routes/earth.router");
const issRouter = require("./routes/iss.router");
const weatherRouter = require("./routes/weather.router");

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/earth", earthRouter);
app.use("/api/iss", issRouter);
app.use("/api/weather", weatherRouter);

app.listen(3000, () => console.log("Listening on port 3000"));
