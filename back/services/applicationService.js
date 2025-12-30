const mysql = require("../database/mappers.js");

// 지원 신청서
const addApplication = async (appInfo) => {
  const { aNo, versionId, answers } = appInfo;

  // 지원 신청서 생성
  const appResult = await mysql.query(
    "insertApplication",
    [aNo, versionId],
    "application"
  );

  let resObj = {};

  if (appResult.insertId > 0) {
    const applicationNo = appResult.insertId;

    // 지원 신청서 답변 작성
    for (let answer of answers) {
      await mysql.query(
        "insertApplicationAnswer",
        [applicationNo, answer.qNo, answer.answer],
        "application"
      );
    }

    resObj = {
      status: "success",
      applicationNo,
    };
  } else {
    resObj = { status: "fail" };
  }

  return resObj;
};

// 지원신청서 답변 수정
const modifyByQnoApplicationAnswer = async (applicationNo, answers) => {
  let cnt = 0;

  for (let answer of answers) {
    const result = await mysql.query(
      "updateByQnoApplicationAnswer",
      [answer.answer, applicationNo, answer.qNo],
      "application"
    );
    if (result.affectedRows > 0) cnt++;
  }

  let resObj = {};

  if (cnt == answers.length) {
    resObj = { status: "success", applicationNo };
  } else {
    resObj = { status: "fail" };
  }

  return resObj;
};

// 지원신청서 내역 조회
const findAllApplication = async () => {
  const appList = await mysql.query(
    "selectByAppNoApplication",
    [],
    "application"
  );
  const managerList = await mysql.query(
    "selectByUserNoManagerUsers",
    [],
    "users"
  );
  const planList = await mysql.query("selectCountPlan", [], "plan");
  const resultList = await mysql.query("selectCountResult", [], "result");

  return { appList, managerList, planList, resultList };
};

module.exports = {
  addApplication,
  modifyByQnoApplicationAnswer,
  findAllApplication,
};
