const mysql = require("../database/mappers.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const mail_config = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
};

// 로그인
const findByIdAndPwUsers = async (id, pw) => {
  let list = await mysql.query("selectByIdAndPwUsers", [id, pw], "users");
  return list;
};

// 회원가입
const addUsers = async (data) => {
  const {
    id,
    pw,
    name,
    email,
    phone,
    address,
    address_detail,
    zipcode,
    type,
    center,
  } = data;
  let result = await mysql.query(
    "insertUsers",
    [
      id,
      pw,
      name,
      email,
      phone,
      address,
      address_detail,
      zipcode,
      type,
      center,
    ],
    "users"
  );
  let resObj = {};
  if (result.insertId > 0) {
    resObj = { status: "success", user_no: result.insertId };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};
// 아이디 중복 확인
const findByIdUsers = async (id) => {
  let list = await mysql.query("selectByIdUsers", [id], "users");
  return list;
};

// 이메일 중복 확인
const findByEmailUsers = async (email) => {
  let list = await mysql.query("selectByEmailUsers", [email], "users");
  console.log(list);
  return list;
};
// 인증번호 발송
const sendCode = async (email) => {
  const code = crypto.randomInt(100000, 1000000);
  return new Promise((resolve, reject) => {
    let transport = nodemailer.createTransport(mail_config);
    transport.sendMail(
      {
        from: `"team_null" <${process.env.EMAIL_AUTH_USER}>`,
        to: email,
        subject: "발달장애인 지원 프로그램 아이디 찾기 인증번호 입니다.",
        text: `${code}`,
      },
      (err, info) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        console.log(info);
        if (info.accepted.length >= 1) {
          resolve({ receiver: info.accepted[0], msg: "정상발송", code: code });
        } else {
          resolve({ receiver: "없음", msg: "수신자가 없음" });
        }
      }
    );
  });
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

// 비밀번호 찾기
const findByIdAndEmailUsers = async (id, email) => {
  let list = await mysql.query("selectByIdAndEmailUsers", [id, email], "users");
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
  const { name, phone, email, c_no, password } = userInfo;
  let result;

  // 비밀번호는 있을 때만
  if (password) {
    result = await mysql.query(
      "updateUserWithPw",
      [name, phone, email, c_no, password, userNo],
      "users"
    );
  } else {
    result = await mysql.query(
      "updateUserWithoutPw",
      [name, phone, email, c_no, userNo],
      "users"
    );
  }

  let resObj = {};
  if (result.affectedRows > 0) {
    resObj = { status: "success", userNo: userNo };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

// 회원상태(사용승인 및 비활성화)
const modifyStatusUsers = async (userNos, status) => {
  let result = await mysql.query(
    "updateStatusUsers",
    [status, userNos],
    "users"
  );
  let resObj = {};
  if (result.affectedRows > 0) {
    resObj = { status: "success", userNos: userNos };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

// 비밀번호 재설정
const modifyPwByUsernoUsers = async (user_no, pw) => {
  console.log(user_no, pw);
  let result = await mysql.query(
    "updatePwByUsernoUsers",
    [pw, user_no],
    "users"
  );
  let resObj = {};
  if (result.affectedRows > 0) {
    resObj = { status: "success", user_no: result.insertId };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

// 회원탈퇴
const modifyStatusByUsernoUsers = async (user_no) => {
  let result = await mysql.query(
    "updateStatusByUsernoUsers",
    [user_no],
    "users"
  );
  let resObj = {};
  if (result.affectedRows > 0) {
    resObj = { status: "success", user_no: user_no };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

// 회원 타입 조회
const findTypeByuserNoUsers = async (user_no) => {
  let rows = await mysql.query("selectTypeByuserNoUsers", [user_no], "users");
  return rows[0]?.type ?? null;
};

// 일반회원 마이페이지 - 나의 정보 조회
const findByUserNoUsers = async (user_no) => {
  let result = await mysql.query("selectByUserNoUsers", [user_no], "users");
  return result;
};

// 일반회원 마이페이지 - 지원자 목록 조회
const findByUserNoApplicant = async (user_no) => {
  let result = await mysql.query("selectByUserNoApplicant", [user_no], "users");
  return result;
};

// 마이페이지 - 나의 정보 수정
const modifyByUserNoGeneralUsers = async ({
  name,
  phone,
  email,
  zipcode,
  address,
  address_detail,
  user_no,
} = {}) => {
  if (
    !name?.trim() ||
    !phone?.trim() ||
    !email?.trim() ||
    zipcode == null ||
    !address?.trim() ||
    user_no == null
  ) {
    return { status: "error", message: "invalid input" };
  }
  let result = await mysql.query(
    "updateByUserNoGeneralUsers",
    [name, phone, email, zipcode, address, address_detail, user_no],
    "users"
  );
  let resObj = {};
  if (result.affectedRows > 0) {
    resObj = { status: "success", user_no: user_no };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

// 기관담당자 마이페이지 - 나의 정보 조회
const findByUserNoStaffUsers = async (user_no) => {
  let result = await mysql.query(
    "selectByUserNoStaffUsers",
    [user_no],
    "users"
  );
  return result;
};

// 기관담당자 마이페이지 - 기관 소속 지원자 목록 조회
const findByCNoApplicant = async (user_no) => {
  let result = await mysql.query("selectByCNoApplicant", [user_no], "users");
  return result;
};

// 마이페이지 - 지원자 상세정보 조회
const findByANoApplicant = async (a_no) => {
  let result = await mysql.query("selectByANoApplicant", [a_no], "users");
  return result;
};

// 마이페이지 - 지원자 상세정보 수정
const modifyByAnoApplicant = async ({
  name,
  birth,
  gender,
  zipcode,
  address,
  address_detail,
  disability,
  a_no,
} = {}) => {
  if (
    !name?.trim() ||
    !birth ||
    gender === undefined ||
    zipcode == null ||
    !address?.trim() ||
    !disability?.trim() ||
    a_no == null
  ) {
    return { status: "error", message: "invalid input" };
  }
  let result = await mysql.query(
    "updateByANoApplicant",
    [name, birth, gender, zipcode, address, address_detail, disability, a_no],
    "users"
  );
  let resObj = {};
  if (result.affectedRows > 0) {
    resObj = { status: "success", a_no: a_no };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

// 마이페이지 - 지원자 삭제
const removeByANoApplicant = async (a_no) => {
  let result = await mysql.query("deleteByANoApplicant", [a_no], "users");
  let resObj = {};
  if (result.affectedRows > 0) {
    resObj = { status: "success", a_no: a_no };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

// 마이페이지 - 지원자 등록
const addApplicant = async ({
  user_no,
  name,
  birth,
  gender,
  zipcode,
  address,
  address_detail,
  disability,
} = {}) => {
  if (
    !user_no ||
    !name?.trim() ||
    !birth ||
    gender === undefined ||
    zipcode == null ||
    !address?.trim() ||
    !disability?.trim()
  ) {
    return { status: "error", message: "invalid input" };
  }
  let result = await mysql.query(
    "insertApplicant",
    [
      user_no,
      name,
      birth,
      gender,
      zipcode,
      address,
      address_detail,
      disability,
    ],
    "users"
  );
  let resObj = {};
  if (result && result.insertId) {
    resObj = { status: "success", a_no: result.insertId };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

module.exports = {
  findByIdAndPwUsers,
  findByNameAndEmailUsers,
  addUsers,
  findByIdAndEmailUsers,
  modifyPwByUsernoUsers,
  findByCnoUsersCenters,
  findByUserNoUsersManager,
  modifyByUserNoUsers,
  modifyStatusByUsernoUsers,
  findByIdUsers,
  findByEmailUsers,
  sendCode,
  modifyStatusUsers,
  findTypeByuserNoUsers,
  findByUserNoUsers,
  modifyByUserNoGeneralUsers,
  findByUserNoStaffUsers,
  findByUserNoApplicant,
  findByANoApplicant,
  modifyByAnoApplicant,
  removeByANoApplicant,
  addApplicant,
  findByCNoApplicant,
};
