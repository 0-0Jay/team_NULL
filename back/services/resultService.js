//모듈 생성

const mysql = require("../database/mappers.js");

//지원결과서 작성 - 데이터 검사 완료

//####### db에 날짜를 YYYY-MM-DD의 형식으로 넣기 위함
const toDateString = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
};

const addResult = async (
  title,
  content,
  result_author,
  status,
  plan_no,
  start,
  end,
) => {

  //###### db에 날짜를 YYYY-MM-DD의 형식으로 넣기 위함
  const startDate = toDateString(start);
  const endDate = toDateString(end);

  let list = await mysql.query(
    "insertResult",
    [title, content, result_author, status, plan_no, startDate, endDate ],
    "result"
  );
  return list;
};

//승인된 지원결과서 조회 - 테이터 검사 완료
const findResult = async (plan_no, status) => {
  let list = await mysql.query("selectResult", [plan_no, status], "result");
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
