// 최신버전 조사지 조회
const selectAllSurvey = `
SELECT s.sec_no, s.section, d.d_no, d.detail, d.info, q.q_no, q.question, q.type
FROM survey_version v
JOIN survey_section s ON s.version_id = v.version_id
JOIN survey_detail d ON d.sec_no = s.sec_no
JOIN survey_question q ON d.d_no = q.d_no
WHERE v.active = 1
ORDER BY s.sec_no, d.d_no, q.q_no`;

// 조사지 구버전 비활성화
const updateSurveyVersion = `
UPDATE survey_version SET active = 0`;

// 조사지 새 버전 추가
const insertSurveyVersion = `
INSERT INTO survey_version(active, content, author)
VALUES(1, ?, ?)`;

// 조사지 새버전 이름 생성
const updateSurveyVersionName = `
UPDATE survey_version SET version_name = ? WHERE version_id = ?`;

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

// 조사지 현 버전 지원서 항목 수정
const updateSurveySection = `
UPDATE survey_section
SET section = ?
WHERE sec_no = ?`;

// 조사지 현 버전 세부 항복 수정
const updateSurveyDetail = `
UPDATE survey_detail
SET detail = ?, info = ?
WHERE d_no = ?`;

// 조사지 현 버전 문항 수정
const updateSurveyQuestion = `
UPDATE survey_question
SET question = ?, type = ?
WHERE q_no = ?`;

module.exports = {
  selectAllSurvey,
  updateSurveyVersion,
  updateSurveyVersionName,
  insertSurveyDetail,
  insertSurveyQuestion,
  insertSurveySection,
  insertSurveyVersion,
  updateSurveySection,
  updateSurveyDetail,
  updateSurveyQuestion,
};
