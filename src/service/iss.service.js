const axios = require("axios");

exports.getIssPosition = async () => {
  const result = await axios.get("http://api.open-notify.org/iss-now.json");
  return result.data;
};
