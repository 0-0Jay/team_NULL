//모듈 생성

const mysql = require("../database/mappers.js");

//지원결과서 작성

const addResult = async (title, content, File, application_no, start, end) => {
  let list = await mysql.query(
    "insertResult",
    [title, content, File, application_no, start, end],
    "result"
  );
  return list;
};

//지원결과서 '조회' (관리자)
const findResult = async (
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
    "selectResult",
    [
      title,
      content,
      file,
      result_no,
      start,
      end,
      status,
      approve_date,
      result_author,
    ],
    "result"
  );
  return list;
};

//지원결과서 '조회' (=승인) (관리자)
const findAdminResult = async (
  title,
  content,
  file,
  start,
  end,
  result_no,
  result_author
) => {
  let list = await mysql.query(
    "selectAdminResult",
    [title, content, file, start, end, result_no, result_author],
    "result"
  );
  return list;
};

module.exports = {
  addResult,
  findResult,
  findAdminResult,
};
