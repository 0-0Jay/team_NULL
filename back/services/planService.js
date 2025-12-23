const mysql = require("../database/mappers.js");

//지원계획서 작성

const addPlan = async (application_no) => {
  let list = await mysql.query("insertPlan", [application_no], "plan");
  return list;
};

module.exports = {
  addPlan,
};
