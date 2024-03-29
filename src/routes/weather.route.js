// 날씨 이미지 요청 시, 해당 데이터 넘겨주기

const express = require("express");
const router = express.Router();
const weatherController = require("../controller/weather.controller");

router.get("/", weatherController.getWeatherByCityName);
router.get("/:weatherName", weatherController.getWeatherByWeatherName);

module.exports = router;
