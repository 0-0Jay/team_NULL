// Table : result

//지원결과서 작성 - *주의 : 지원'계획서'번호를 받아와야함
const insertResult = `
INSERT INTO result(title, content, file, application_no, start, end)
VALUES(?, ?, ?, ?, ?, ?)`;

//지원결과서 조회
const selectedresult = `
INSERT INTO result(title, content, file, start, end, result_no, status, approve_date)
VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

module.exports = {
  insertResult,
  selectedresult,
};
