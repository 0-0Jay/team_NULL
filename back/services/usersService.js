const mysql = require("../database/mappers.js");

// 로그인
const findByIdAndPwUsers = async (id, pw) => {
  let list = await mysql.query("selectedByIdAndPwUsers", [id, pw], "users");
  return list;
};

// 회원가입
const addUsers = async (
  id,
  pw,
  name,
  email,
  phone,
  address,
  address_detail,
  zipcode,
  type,
  c_no
) => {
  let list = await mysql.query(
    "insertUser",
    [id, pw, name, email, phone, address, address_detail, zipcode, type, c_no],
    "users"
  );
};

// 아이디 찾기
const findByNameAndEmailUsers = async (name, email) => {
  let list = await mysql.query(
    "selectByNameAndEmailUsers",
    [name, email],
    "users"
  );
  return list;
};

// 비밀번호 재설정
const modifyPwByUsernoUsers = async (user_no) => {
  let list = await mysql.query("updatePwByUsernoUsers", [user_no], "users");
  return list;
};

module.exports = {
  findByIdAndPwUsers,
  findByNameAndEmailUsers,
  addUsers,
  modifyPwByUsernoUsers,
};
