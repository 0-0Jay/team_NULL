//모듈 생성
const mysql = require("../database/mappers.js");

//지원계획서 작성  -  데이터 테스트 완료

const addPlan = async (
  title,
  content,
  file,
  application_no,
  start,
  end,
  plan_author
) => {
  let list = await mysql.query(
    "insertPlan",
    [title, content, file, application_no, start, end, plan_author],
    "plan"
  );
  return list;
};

//승인된 지원계획서 조회 - 데이터 테스트 완료
const findPlan = async (application_no, status) => {
  let list = await mysql.query("selectPlan", [application_no, status], "plan");
  return list;
};

// const findPlan = async (title, content, file, start, end, plan_no, approve_date, plan_author) => {
//   let list = await mysql.query(
//     "selectPlan",
//     [title, content, file, plan_no, start, end, approve_date, plan_author],
//     "plan");
//   return list;
// };

//승인대기 중인 지원계획서 조회 (승인된 지원계획서랑 쿼리문이 달라서 나눠서 적은 것) - 데이터 테스트 완료
const findPendingPlan = async (application_no) => {
  let list = await mysql.query("selectPendingPlan", [application_no], "plan");
  return list;
};

// const findAdminPlan = async (title, content, file, start, end, plan_no, plan_author) => {
//   let list = await mysql.query(
//     "selectAdminPlan",
//     [title, content, file, start, end, plan_no, plan_author],
//     "plan"
//   );
//   return list;
// };

module.exports = {
  addPlan,
  findPlan,
  findPendingPlan,
};
