//모듈 생성

const mysql = require("../database/mappers.js");

//지원결과서 작성 - 데이터 검사 완료

//####### db에 날짜를 YYYY-MM-DD의 형식으로 넣기 위함
const toDateString = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
};

const addResult = async (data) => {
  const {plan_no, author_no, author, title, content, startDate, endDate} = data;

  let result = await mysql.query(
    "insertResult",
    [plan_no, title, content, new Date(startDate), new Date(endDate), author, author_no],
    "result"
  );

  let resObj = {};
  if (result.insertId > 0) {
    resObj = { status: "success", user_no: result.insertId };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

//지원결과서 전체 조회
const findResult = async (applicationNo) => {
  let list = await mysql.query("selectResult", [applicationNo], "result");
  return list;
};

// 반려된 지원결과서 조회
const findRejectResult = async (plan_no) => {
  let list = await mysql.query("rejectResult", [plan_no], "result");
  return list;
};

//승인대기 중인 지원결과서 조회 - 테이터 검사 완료
const findPendingResult = async (plan_no) => {
  let list = await mysql.query("selectPendingResult", [plan_no], "result");
  return list;
};

module.exports = {
  addResult,
  findResult,
  findRejectResult,
  findPendingResult,
};
