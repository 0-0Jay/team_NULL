const mysql = require("../database/mappers.js");

// 로그인
const findByIdAndPwUsers = async (id, pw) => {
  let list = await mysql.query("selectedByIdAndPw", [id, pw], "users");
  return list;
};

// 회원가입
// const addUser = async (id, pw, name, email, phone, address, address_detail, zipcode, type, c_no) {
//   let list = await mysql.query("insertUser", [])
// }

// 아이디 찾기
const findByNameAndEmailUsers = async (name, email) => {
  let list = await mysql.query("selectByNameAndEmail", [name, email], "users");
  return list;
};

module.exports = {
  findByIdAndPwUsers,
  findByNameAndEmailUsers,
};
