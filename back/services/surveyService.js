const mysql = require("../database/mappers.js");

const findAllSurvey = async () => {
  let list = await mysql.query("selectAllSurvey", null, "survey");
  const data = {};
  for (let i = 0; i < list.length; i++) {
    const section = list[i].section;
    const detail = list[i].detail + "*" + list[i].info;

    if (!data[section]) data[section] = {};
    if (!data[section][detail]) data[section][detail] = [];
    data[section][detail].push({
      question: list[i].question,
      type: list[i].type,
    });
  }
  return data;
};

const addSurvey = async (data) => {
  // 1. 조사지 버전 추가
  //   - 기존 버전 비활성화
  const activeCtrl = await mysql.query("updateSurveyVersion", null, "survey");
  const { content, author, survey } = data;
  const verResult = await mysql.query(
    "insertSurveyVersion",
    [content, author],
    "survey"
  );
  const verId = verResult.insertId;
  const verNaming = await mysql.query("updateSurveyVersionName", [`ver_${verId}`, verId], "survey"); 
  // 2. 조사지 항목 추가
  for (const section of Object.keys(survey)) {
    const secResult = await mysql.query(
      "insertSurveySection",
      [section, verId],
      "survey"
    )
    const secId = secResult.insertId;
    const sectionData = survey[section];

    for (const detailInfo of Object.keys(sectionData)) {
      const [detail, info] = detailInfo.split("*");
      const detResult = await mysql.query(
        "insertSurveyDetail",
        [secId, detail, info],
        "survey"
      )
      const detId = detResult.insertId;
      const detaildata = sectionData[detailInfo];

      for (const q of detaildata) {
        const {question, type} = q;
        const questionResult = await mysql.query(
          "insertSurveyQuestion",
          [detId, question, type],
          "survey"
        )
      }
    }
  }
  console.log(verResult);
};

module.exports = {
  findAllSurvey,
  addSurvey,
};
