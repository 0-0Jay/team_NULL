// Table : plan

//지원 계획서 작성 - *주의 : 지원'신청서' 번호를 받아와야함 - 데이터 검사 완료
const insertPlan = `
INSERT INTO plan(title, content, plan_author, status, file, application_no, start, end)
VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

//승인된 지원 계획서 조회 (일반, 관리자) - 데이터 검사 완료
const selectPlan = `
SELECT title, content, file, start, end, plan_no, status, approve_date, plan_author
FROM plan
WHERE application_no = ?
AND   status = ?`; // 일단은 다 불러 올려고 ? 삽입

//승인대기 지원계획서 조회 (관리자판단) - 대기부분은 구조가 달라서 나눈 것임 - 데이터 검사완료
const selectPendingPlan = `
SELECT title, content, file, start, end, plan_no, plan_author
FROM plan
WHERE application_no = ?
AND   status = 0`; // 대기중인 것만 불러 올려고 0 삽입

module.exports = {
  insertPlan,
  selectPlan,
  selectPendingPlan,
};
