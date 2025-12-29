// 최신버전 조사지 조회
const selectAllSurvey = `
SELECT s.section, d.detail, d.info, q.question, q.type
FROM survey_version v
JOIN survey_section s ON s.version_id = v.version_id
JOIN survey_detail d ON d.sec_no = s.sec_no
JOIN survey_question q ON d.d_no = q.d_no
WHERE v.active = 1
ORDER BY s.sec_no, d.d_no, q.q_no`;

module.exports = {
  selectAllSurvey,
};
