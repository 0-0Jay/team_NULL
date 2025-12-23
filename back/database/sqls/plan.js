// Table : plan

//지원 계획서 작성 - *주의 : 지원'신청서' 번호를 받아와야함
const insertPlan = `
INSERT INTO plan(title, content, file, application_no, start, end)
VALUES(?, ?, ?, ?, ?, ?)`;

//지원 계획서 조회(일반)
const selectPlan = `
SELECT title, content, file, 'start', 'end', plan_no, status, approve_date, plan_author
FROM plan`;

//지원 계획서 조회(=승인) (관리자)
const selectAdminPlan = `
SELECT title, content, file, 'start', 'end', plan_no, plan_author
FROM plan`;

module.exports = {
  insertPlan,
  selectPlan,
  selectAdminPlan,
};
