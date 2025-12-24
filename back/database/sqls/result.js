// Table : result

//지원결과서 작성 - *주의 : 지원'계획서'번호를 받아와야함
const insertResult = `
INSERT INTO result(title, content, file, plan_no, start, end, result_author)
VALUES(?, ?, ?, ?, ?, ?, ?)`;

//승인된 지원 결과서 조회 (일반, 관리자)
const selectResult = `
SELECT title, content, file, start, end, result_no, status, approve_date, result_author
FROM result
WHERE plan_no = ? 
AND   status = ?`; // 일단은 다 불러 올려고 ? 삽입    // 지원계획서를 기준으로 결과서를 작성해서 plan_no를 가져옴

//승인대기 지원결과서 조회 (관리자판단) - 대기부분은 구조가 달라서 나눈것임
const selectPendingResult = `
SElECT title, content, file, start, end, result_no, result_author
FROM result
WHERE plan_no = ?
AND   status = 0`; // 대기중인 것만 불러 올려고 0 삽입  // 지원계획서를 기준으로 결과서를 작성해서 plan_no를 가져옴

module.exports = {
  insertResult,
  selectResult,
  selectPendingResult,
};
