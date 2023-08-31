// iss의 실시간 위치 넘겨주기
const express = require("express");
const router = express.Router();
const issController = require("../controller/iss.controller");

router.get("/", issController.getIssPosition);

module.exports = router;
