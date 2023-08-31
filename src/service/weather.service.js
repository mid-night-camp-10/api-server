const SUN_DIAMETER = 0.53;
const AIR_REF = 34.0 / 60.0;

function isLeapYear(year) {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true;
  } else {
    return false;
  }
}

function getJulianDay(year, month, day) {
  let tmp = (-7.0 * (year + (month + 9.0) / 12.0)) / 4.0 + (275.0 * month) / 9.0 + day;
  tmp += year * 367;
  return tmp - 730531.5 + 12.0 / 24.0;
}

function getRangeRadian(x) {
  const b = x / (2 * Math.PI);
  let a = 2 * Math.PI * (b - Math.floor(b));

  if (a < 0) {
    a = 2 * Math.PI + a;
  }
  return a;
}

function getHa(lat, decl) {
  let dfo = (Math.PI / 180.0) * (0.5 * SUN_DIAMETER + AIR_REF);
  if (lat < 0.0) {
    dfo = -dfo;
  }
  let fo = Math.tan(decl + dfo) * Math.tan((lat * Math.PI) / 180.0);
  if (fo > 1.0) {
    fo = 1.0;
  }
  fo = Math.asin(fo) + Math.PI / 2.0;

  return fo;
}

function getSunLongitude(days) {
  const longitude = getRangeRadian((280.461 * Math.PI) / 180.0 + ((0.9856474 * Math.PI) / 180.0) * days);
  const g = getRangeRadian((357.528 * Math.PI) / 180.0 + ((0.9856003 * Math.PI) / 180.0) * days);

  return getRangeRadian(longitude + ((1.915 * Math.PI) / 180.0) * Math.sin(g) + ((0.02 * Math.PI) / 180.0) * Math.sin(2 * g));
}

function convertDtimeToRtime(dhour) {
  const hour = Math.floor(dhour);
  const minute = Math.floor((dhour - hour) * 60);

  return [hour, minute];
}

module.exports = function calculateSunsetSunrise(latitude, longitude, timezone) {
  const today = new Date();

  const days = getJulianDay(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const gamma = getSunLongitude(days);
  const meanLongitude = getSunLongitude(days);
  const obliq = (23.439 * Math.PI) / 180.0 - ((0.0000004 * Math.PI) / 180.0) * days;

  const alpha = Math.atan2(Math.cos(obliq) * Math.sin(gamma), Math.cos(gamma));
  const delta = Math.asin(Math.sin(obliq) * Math.sin(gamma));

  let ll = meanLongitude - alpha;

  if (meanLongitude < Math.PI) {
    ll += 2 * Math.PI;
  }
  const eq = 1440.0 * (1.0 - ll / (2 * Math.PI));

  const ha = getHa(latitude, delta);

  const sunrise = 12.0 - (12.0 * ha) / Math.PI + timezone - longitude / 15.0 + eq / 60.0;
  const sunset = 12.0 + (12.0 * ha) / Math.PI + timezone - longitude / 15.0 + eq / 60.0;

  let sunriseTime = [0, 0];
  let sunsetTime = [0, 0];

  sunriseTime = convertDtimeToRtime(sunrise);
  sunsetTime = convertDtimeToRtime(sunset);

  let retSunrise = "";
  let retSunset = "";

  if (sunriseTime[0] < 10) {
    retSunrise += "0";
  }
  retSunrise += sunriseTime[0];
  retSunrise += ":";
  if (sunriseTime[1] < 10) {
    retSunrise += "0";
  }
  retSunrise += sunriseTime[1] - 1;

  if (sunsetTime[0] < 10) {
    retSunset += "0";
  }
  retSunset += sunsetTime[0];
  retSunset += ":";
  if (sunsetTime[1] < 10) {
    retSunset += "0";
  }
  retSunset += sunsetTime[1] + 1;

  return [retSunrise, retSunset];
};
