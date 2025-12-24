//모듈 생성

const mysql = require("../database/mappers.js");

//지원결과서 작성 - 데이터 검사 완료

const addResult = async (
  title,
  content,
  file,
  plan_no,
  start,
  end,
  result_author
) => {
  let list = await mysql.query(
    "insertResult",
    [title, content, file, plan_no, start, end, result_author],
    "result"
  );
  return list;
};

//승인된 지원결과서 조회 - 테이터 검사 완료
const findResult = async (plan_no, status) => {
  let list = await mysql.query("selectResult", [plan_no, status], "result");
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
  findPendingResult,
};
