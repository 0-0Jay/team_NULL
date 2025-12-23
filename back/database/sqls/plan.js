// Table : plan

//지원 계획서 작성 - *주의 : 지원'신청서' 번호를 받아와야함
const insertPlan = `
INSERT INTO plan(title, content, file, application_no, start, end)
VALUES(?, ?, ?, ?, ?, ?)`;

//지원 계획서 조회
const selectedplan = `
INESERT INTO plan(title, content, file, start, end, plan_no, status, approve_date)
VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

module.exports = {
  insertPlan,
  selectedplan,
};
