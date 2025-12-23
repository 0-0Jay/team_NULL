// Table : result

//지원결과서 작성 - *주의 : 지원'계획서'번호를 받아와야함
const insertResult = `
INSERT INTO result(title, content, file, application_no, start, end)
VALUES(?, ?, ?, ?, ?, ?)`;

//지원결과서 조회(일반)
const selectResult = `
SELECT title, content, file, 'start', 'end', result_no, status, approve_date, result_author
FROM result`;

//지원 결과서 조회(=승인) (관리자)
const selectAdminResult = `
SElECT title, content, file, 'start', 'end', result_no, result_author
FROM result`;

module.exports = {
  insertResult,
  selectResult,
  selectAdminResult,
};
