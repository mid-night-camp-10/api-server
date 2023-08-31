const httpStatus = require("http-status");

const calculateSunsetSunrise = require("../service/weather.service");
const cityNameCoordinates = require("../models/cityCoordinates");

var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

exports.getDaylight = async (req, res, next) => {
  const seoulCoordinates = cityNameCoordinates.seoul;
  const seoulDaylight = calculateSunsetSunrise(seoulCoordinates.lat, seoulCoordinates.lng, 9);
  const nowTime = moment().format("YYYY-MM-DD HH:mm:ss").split(" ")[1];
  const isDay = seoulDaylight[0] <= nowTime;
  const isNight = seoulDaylight[1] <= nowTime;
  result = {
    sunrise: seoulDaylight[0],
    sunset: seoulDaylight[1],
    nowTime,
    isDay,
    isNight,
  };
  res.status(httpStatus.OK).json(result);
};
