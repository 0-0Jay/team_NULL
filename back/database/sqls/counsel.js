// Table : counsel (counsel_no, application_no, title, content, counsel_date, file, save, counsel_author)

// 상담내역 작성 - file은 일단 제외함 /데이터 테스트 확인완료
const insertCounsel = `
INSERT INTO counsel(application_no, title, content, counsel_date, counsel_author)
VALUES(?, ?, ?, ?, ?)`;

const selectCounsel = `
SELECT application_no, title, content, counsel_date, save, counsel_author
FROM counsel
WHERE application_no = ?` // 지원계획서에 할당된 상담내역을 불러오기 위함

module.exports = {
    insertCounsel,
    selectCounsel,
};
