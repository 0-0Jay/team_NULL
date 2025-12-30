// 최신버전 조사지 조회
const selectAllSurvey = `
SELECT s.section, d.detail, d.info, q.question, q.type
FROM survey_version v
JOIN survey_section s ON s.version_id = v.version_id
JOIN survey_detail d ON d.sec_no = s.sec_no
JOIN survey_question q ON d.d_no = q.d_no
WHERE v.active = 1
ORDER BY s.sec_no, d.d_no, q.q_no`;

// 조사지 새 버전 추가
const insertSurveyVersion = `
INSERT INTO survey_version(active, content, author)
VALUES(1, ?, ?)`;

// 조사지 새 버전 지원서 항목 추가
const insertSurveySection = `
INSERT INTO survey_section(section, version_id)
VALUES(?, ?)`;

// 조사지 새 버전 세부 항목 추가
const insertSurveyDetail = `
INSERT INTO survey_detail(sec_no, detail, info)
VALUES(?, ?, ?)`;

// 조사지 새 버전 문항 추가
const insertSurveyQuestion = `
INSERT INTO survey_question(d_no, question, type)
VALUES(?, ?, ?)`;

module.exports = {
  selectAllSurvey,
  insertSurveyDetail,
  insertSurveyQuestion,
  insertSurveySection,
  insertSurveyVersion,
};
