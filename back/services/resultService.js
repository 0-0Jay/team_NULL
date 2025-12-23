//모듈 생성

const mysql = require("../database/mappers.js");

//지원결과서 작성

const addResult = async (title, content, File, application_no, start, end) => {
  let list = await mysql.query(
    "insertresult",
    [title, content, File, application_no, start, end],
    "result"
  );
  return list;
};

//지원결과서 '조회' (관리자)
const findresult = async (
  title,
  content,
  file,
  start,
  end,
  result_no,
  status,
  approve_date
) => {
  let list = await mysql.query(
    "selectresult",
    [title, content, file, result_no, start, end, status, approve_date],
    "result"
  );
  return list;
};

module.exports = {
  addResult,
  findresult,
};
