const SunCalc = require("suncalc");
const httpStatus = require("http-status");

exports.getSunPosition = async (req, res, next) => {
  var times = SunCalc.getTimes(new Date(), 51.5, -0.1);
  const result = SunCalc.getPosition(times.sunrise, 51.5, -0.1);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "OK",
    results: result,
  });
};
