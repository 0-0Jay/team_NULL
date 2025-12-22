const mysql = require("../database/mappers.js");

// 로그인
const findByIdAndPw = async () => {
  let list = await mysql.query("selectedByIdAndPw", null, "users");
  return list;
};

module.exports = { findByIdAndPw };
