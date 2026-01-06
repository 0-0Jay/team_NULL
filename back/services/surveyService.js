const mysql = require("../database/mappers.js");

// 조사지 조회
const findAllSurvey = async () => {
  let list = await mysql.query("selectAllSurvey", null, "survey");
  const data = {};
  for (let i = 0; i < list.length; i++) {
    const sec_no = list[i].sec_no;
    const d_no = list[i].d_no;
    const q_no = list[i].q_no;

    if (!data[sec_no]) data[sec_no] = { section: list[i].section, details: {} };
    if (!data[sec_no]["details"][d_no])
      data[sec_no]["details"][d_no] = {
        detail: list[i].detail,
        info: list[i].info,
        questions: {},
      };
    data[sec_no]["details"][d_no]["questions"][q_no] = {
      question: list[i].question,
      type: list[i].type,
    };
  }
  return data;
};

// 조사지 버전 추가
const addSurvey = async (data) => {
  // 기존 버전 비활성화
  await mysql.query("updateSurveyVersion", null, "survey");
  // 새 버전 생성
  const { content, author, survey } = data;
  const verResult = await mysql.query(
    "insertSurveyVersion",
    [content, author],
    "survey"
  );
  const verId = verResult.insertId;
  await mysql.query(
    "updateSurveyVersionName",
    [`ver_${verId}`, verId],
    "survey"
  );
  // 조사지 항목 추가
  for (const secKey of Object.keys(survey)) {
    const sectionData = survey[secKey];
    const secResult = await mysql.query(
      "insertSurveySection",
      [sectionData.section, verId],
      "survey"
    );
    const secId = secResult.insertId;

    for (const detKey of Object.keys(sectionData.details)) {
      const detailData = sectionData.details[detKey];
      const detResult = await mysql.query(
        "insertSurveyDetail",
        [secId, detailData.detail, detailData.info],
        "survey"
      );
      const detId = detResult.insertId;

      for (const qKey of Object.keys(detailData.questions)) {
        const questionData = detailData.questions[qKey];
        await mysql.query(
          "insertSurveyQuestion",
          [detId, questionData.question, questionData.type],
          "survey"
        );
      }
    }
  }
  return verResult;
};

// 조사지 현 버전 수정
const modifySurvey = async (data) => {
  const { survey } = data;
  // 항목 업데이트
  for (const secKey of Object.keys(survey)) {
    const sectionData = survey[secKey];
    const secResult = await mysql.query(
      "updateSurveySection",
      [sectionData.section, secKey],
      "survey"
    );

    for (const detKey of Object.keys(sectionData.details)) {
      const detailData = sectionData.details[detKey];
      const detResult = await mysql.query(
        "updateSurveyDetail",
        [detailData.detail, detailData.info, detKey],
        "survey"
      );

      for (const qKey of Object.keys(detailData.questions)) {
        const questionData = detailData.questions[qKey];
        await mysql.query(
          "updateSurveyQuestion",
          [questionData.question, questionData.type, qKey],
          "survey"
        );
      }
    }
  }
  return {
    status: "success",
  };
};

module.exports = {
  findAllSurvey,
  addSurvey,
  modifySurvey,
};
