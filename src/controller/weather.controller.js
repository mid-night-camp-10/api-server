const httpStatus = require("http-status");

const cityNameCoordinates = require("../models/cityCoordinates");
const weatherImage = require("../models/weatherImage");
const axios = require("axios");
const calculateSunsetSunrise = require("../service/weather.service");

var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

const dotenv = require("dotenv");
dotenv.config();

exports.getWeatherByCityName = async (req, res, next) => {
  const cityName = req.query.city;
  if (!cityNameCoordinates[cityName]) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "City not found",
    });
  }
  const weatherAPI = process.env.WEATHER_API_KEY;
  const cityCoordinates = cityNameCoordinates[cityName];
  const weatherDate = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinates.lat}&lon=${cityCoordinates.lng}&appid=${weatherAPI}`);
  const weatherName = weatherDate.data.weather[0].main;
  const resImage = { image: null };
  if (["Mist", "Rain"].indexOf(weatherName) !== -1) {
    resImage.image = weatherImage.rain;
  }
  res.status(httpStatus.OK).json(resImage);
};

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
