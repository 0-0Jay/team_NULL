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

// 기관 검색 (자동완성용)
const findByNameCenter = async (name) => {
  const list = await mysql.query("selectByNameCenter", [name], "center");
  return list;
};

// 기관 등록
const addCenter = async (data) => {
  const {
    centerName,
    postcode,
    fullAddress,
    addressDetail,
    email,
    phone,
    operation,
  } = data;
  const [sido, sigungu, ...rest] = fullAddress.split(" ");
  const address = rest.join(" ");
  let result = await mysql.query(
    "insertCenters",
    [
      centerName,
      sido,
      sigungu,
      address,
      addressDetail,
      postcode,
      phone,
      email,
      operation,
    ],
    "center"
  );
  let resObj = {};
  if (result.insertId > 0) {
    resObj = { status: "success", user_no: result.insertId };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

// 시스템 관리자 - 기관 정보 수정
const modifyByCNoCenter = async (data) => {
  const {
    centerName,
    postcode,
    fullAddress,
    addressDetail,
    email,
    phone,
    operation,
    c_no,
  } = data;

  // 시도/시군구만 분리
  let sido = "",
    sigungu = "";
  if (fullAddress?.trim()) {
    const parts = fullAddress.split(" ");
    sido = parts[0] || "";
    sigungu = parts[1] || "";
  }

  // DB에 넣을 주소는 분리 전 전체 문자열 그대로
  const address = fullAddress;

  let resObj = {};

  try {
    // 1. center 테이블 업데이트
    const result1 = await mysql.query(
      "updateByCNoCenter",
      [
        centerName,
        sido,
        sigungu,
        address,
        addressDetail,
        postcode,
        phone,
        email,
        operation,
        operation,
        c_no,
      ],
      "center"
    );
    if (result1.affectedRows > 0) {
      resObj = { status: "success", c_no };
    } else {
      resObj = { status: "fail" };
    }
  } catch (err) {
    console.error(err);
    resObj = { status: "error", message: err.message };
  }
  return resObj;
};

module.exports = {
  findAllCenter,
  findByUsernoCenter,
  findAllAddressCenter,
  findByNameCenter,
  addCenter,
  modifyByCNoCenter,
};
