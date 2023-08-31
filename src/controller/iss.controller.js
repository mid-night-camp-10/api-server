const SunCalc = require("suncalc");
const httpStatus = require("http-status");
const axios = require("axios");

exports.getIssPosition = async (req, res, next) => {
  const result = await axios.get("http://api.open-notify.org/iss-now.json");
  res.status(httpStatus.OK).json(result.data);
};
