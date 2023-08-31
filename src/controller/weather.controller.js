const httpStatus = require("http-status");

const cityNameCoordinates = require("../models/cityCoordinates");
const weatherImage = require("../models/weatherImage");
const axios = require("axios");

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
  console.time("weather API call");
  const weatherDate = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinates.lat}&lon=${cityCoordinates.lng}&appid=${weatherAPI}`);
  const weatherName = weatherDate.data.weather[0].main;
  console.timeEnd("weather API call");
  const resImage = { image: null };
  if (["Mist", "Rain"].indexOf(weatherName) !== -1) {
    resImage.image = weatherImage.rain;
  }

  if (["Clear"].indexOf(weatherName) !== -1) {
    if (cityName == "rome") {
      resImage.image = weatherImage.italy_day;
    } else if (cityName == "newyork") {
      resImage.image = weatherImage.newyork_day;
    } else if (cityName == "seoul") {
      resImage.image = weatherImage.korea_day;
    }
  }

  if (["Clouds"].indexOf(weatherName) !== -1) {
    resImage.image = weatherImage.cloudy;
  }

  if (["Thunderstorm"].indexOf(weatherName) !== -1) {
    resImage.image = weatherImage.thunderstorms;
  }

  if (["Tornado"].indexOf(weatherName) !== -1) {
    resImage.image = weatherImage.typhoon;
  }

  res.status(httpStatus.OK).json(resImage);
};

exports.getWeatherByWeatherName = async (req, res, next) => {
  const weatherName = req.params.weatherName;

  const resImage = { image: null };
  resImage.image = weatherImage[weatherName];
  res.status(httpStatus.OK).json(resImage);
};
