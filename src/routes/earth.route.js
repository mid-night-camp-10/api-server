// 지구 밤 낮 보여주기
const express = require("express");
const router = express.Router();
const earthController = require("../controller/earth.controller");

router.get("/", earthController.getSunPosition);

module.exports = router;
