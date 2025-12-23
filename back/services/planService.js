//모듈 생성

const mysql = require("../database/mappers.js");

//지원계획서 작성

const addPlan = async (title, content, file, application_no, start, end) => {
  let list = await mysql.query(
    "insertPlan",
    [title, content, file, application_no, start, end],
    "plan"
  );
  return list;
};

//지원계획서 '조회' (일반)
const findPlan = async (
  title,
  content,
  file,
  start,
  end,
  plan_no,
  status,
  approve_date
) => {
  let list = await mysql.query(
    "selectPlan",
    [
      title,
      content,
      file,
      plan_no,
      start,
      end,
      status,
      approve_date,
      plan_author,
    ],
    "plan"
  );
  return list;
};

//지원계획서 '조회'(=승인) (관리자)
const findAdminPlan = async (
  title,
  content,
  file,
  start,
  end,
  plan_no,
  plan_author
) => {
  let list = await mysql.query(
    "selectAdminPlan",
    [title, content, file, start, end, plan_no, plan_author],
    "plan"
  );
  return list;
};

module.exports = {
  addPlan,
  findPlan,
  findAdminPlan,
};
