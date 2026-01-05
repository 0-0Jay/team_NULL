// Table : counsel (counsel_no, application_no, title, content, counsel_date, file, save, counsel_author)

// 상담내역 작성 - file은 일단 제외함 /데이터 테스트 확인완료
const insertCounsel = `
INSERT INTO counsel(application_no, title, content, save, counsel_date, counsel_author)
VALUES(?, ?, ?, ?, ?, ?)`;

// 상담내역 조회
const selectCounsel = `
SELECT application_no, title, content, save, counsel_date, save, counsel_author
FROM counsel
WHERE application_no = ?
AND   save = ?`; // 임시저장 여부는 쿼리문이 동일해서 따로 쿼리문 안 만듦

module.exports = {
  insertCounsel,
  selectCounsel,
};
