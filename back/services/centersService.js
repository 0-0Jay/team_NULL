const mysql = require("../database/mappers.js");

// 기관 목록 불러오기
const findAllCenter = async () => {
  const centerList = await mysql.query("selectAllCenter", null, "center");
  return centerList;
};

// 회원 소속 기관 불러오기
const findByUsernoCenter = async (user_no) => {
  const list = await mysql.query("selectByUsernoCenter", [user_no], "center");
  return list;
};

// 기관 주소 불러오기
const findAllAddressCenter = async () => {
  const list = await mysql.query("selectAllAddressCenter", null, "center");
  return list;
};

module.exports = {
  findAllCenter,
  findByUsernoCenter,
  findAllAddressCenter,
};
