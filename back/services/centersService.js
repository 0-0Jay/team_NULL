const mysql = require("../database/mappers.js");

// 기관 목록 불러오기
const findAllCenter = async () => {
  const centerList = await mysql.query("selectAllCenter", null, "center");
  return centerList;
};

module.exports = { findAllCenter };
