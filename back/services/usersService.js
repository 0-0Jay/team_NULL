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

// 기관 관리자 불러오기
const findByCnoUsersCenters = async () => {
  let list = await mysql.query("selectByCnoUsersCenters", null, "users");
  return list;
};

// 기관 관리자 페이지 - 기관 담당자 불러오기
const findByUserNoUsersManager = async () => {
  let list = await mysql.query("selectByUserNoUsersManager", null, "users");
  return list;
};

// 기관 관리자 페이지 - 기관 담당자 정보 수정
const modifyByUserNoUsers = async (userInfo, userNo) => {
  let { name, phone, email, password } = userInfo;
  let result = await mysql.query(
    "updateByUserNoUsers",
    [name, phone, email, password, userNo],
    "users"
  );

  let resObj = {};
  if (result.affectedRows > 0) {
    resObj = { status: "success", no: userNo };
  } else {
    resObj = { status: "fail" };
  }

  return resObj;
};

module.exports = {
  findByIdAndPwUsers,
  findByNameAndEmailUsers,
  addUsers,
  modifyPwByUsernoUsers,
  findByCnoUsersCenters,
  findByUserNoUsersManager,
  modifyByUserNoUsers,
};
