const mysql = require("../database/mappers.js");

const findAllSurvey = async () => {
  let list = await mysql.query("selectAllSurvey", null, "survey");
  const data = {};
  for (let i = 0; i < list.length; i++) {
    const section = list[i].section;
    const detail = list[i].detail + "," + list[i].info;

    if (!data[section]) data[section] = {};
    if (!data[section][detail]) data[section][detail] = [];
    data[section][detail].push({
      question: list[i].question,
      type: list[i].type,
    });
  }
  return data;
};

module.exports = {
  findAllSurvey,
};
