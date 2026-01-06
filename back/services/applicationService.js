const mysql = require("../database/mappers.js");

// 지원신청내역 조회
const findAllApplication = async (user) => {
  let appList = [];

  console.log("user 타입 : ", user.type);
  console.log("user 기관번호 : ", user.c_no);
  if (user.type === 3) {
    appList = await mysql.query("selectAllApplication", [], "application");
  } else if (user.type === 2) {
    appList = await mysql.query(
      "selectByCenterApplication",
      [user.c_no],
      "application"
    );
  } else if (user.type === 1) {
    appList = await mysql.query(
      "selectByManagerApplication",
      [user.user_no],
      "application"
    );
  } else {
    appList = await mysql.query(
      "selectByUserApplication",
      [user.user_no],
      "application"
    );
  }

  const managerList = await mysql.query(
    "selectByUserNoManagerUsers",
    [],
    "users"
  );
  const planList = await mysql.query("selectCountPlan", [], "plan");
  const resultList = await mysql.query("selectCountResult", [], "result");
  const counselList = await mysql.query("selectCountCounsel", [], "counsel");

  return {
    appList,
    managerList,
    planList,
    resultList,
    counselList,
  };
};

// 권한 확인
// 조회 가능 여부, 수정 가능 여부, 하위 데이터 접근 여부
const checkPermission = async (applicationNo, user) => {
  // 시스템관리자
  if (user.type === 3) {
    return true;
  }

  // 보호자
  if (user.type === 0) {
    const res = await mysql.query(
      "selectByAppNoAndUserNoApplication",
      [applicationNo, user.user_no],
      "application"
    );
    if (res.length > 0) return true;
  }

  // 기관담당자
  if (user.type === 1) {
    const res = await mysql.query(
      "selectByAppNoAndUserNoManager",
      [applicationNo, user.user_no],
      "application"
    );
    if (res.length > 0) return true;
  }

  // 기관관리자
  if (user.type === 2) {
    const res = await mysql.query(
      "selectByAppNoAndCnoApplication",
      [applicationNo, user.c_no],
      "application"
    );
    if (res.length > 0) return true;
  }

  return false;
};

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

// 지원신청서 조회
const findByAppNoApplication = async (applicationNo, user) => {
  // 권한 확인
  const hasPermission = await checkPermission(applicationNo, user);
  if (!hasPermission) {
    throw new Error("조회 권한 없음");
  }

  // 신청서 기본 정보 + 담당자
  const result = await mysql.query(
    "selectByAppNoApplication",
    [applicationNo],
    "application"
  );

  return result;
};

// 지원신청서 답변 수정
const modifyByQnoApplicationAnswer = async (applicationNo, answers, user) => {
  // 권한 확인
  const hasPermission = await checkPermission(applicationNo, user);
  if (!hasPermission) {
    throw new Error("수정 권한 없음");
  }

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

// 대기단계 선택
const modifyApplicationStatus = async (applicationNo, status, user) => {
  // 담당자만 가능
  const res = await mysql.query(
    "selectByAppNoAndUserNoManager",
    [applicationNo, user.user_no],
    "application"
  );

  if (res.length === 0) {
    throw new Error("단계 변경 권한 없음");
  }

  const result = await mysql.query(
    "updateByAppNoApplication",
    [status, applicationNo],
    "application"
  );

  let resObj;

  if (result.affectedRows > 0) {
    resObj = { status: "success", applicationNo };
  } else {
    resObj = { status: "fail" };
  }

  return resObj;
};

// 담당자 지정
const addManager = async (applicationNo, managerUserNo, user) => {
  // 기관관리자만 가능
  if (user.type !== 2) {
    throw new Error("담당자 지정 권한 없음");
  }

  // 같은 기관인지 확인
  const res = await mysql.query(
    "selectByAppNoAndCnoApplication",
    [applicationNo, user.c_no],
    "application"
  );
  if (res.length === 0) {
    throw new Error("다른 기관 신청서");
  }

  const result = await mysql.query(
    "insertManager",
    [applicationNo, managerUserNo],
    "application"
  );

  let resObj;

  if (result.affectedRows > 0) {
    resObj = { status: "success", applicationNo };
  } else {
    resObj = { status: "fail" };
  }

  return resObj;
};

module.exports = {
  findAllApplication,
  addApplication,
  findByAppNoApplication,
  modifyByQnoApplicationAnswer,
  modifyApplicationStatus,
  addManager,
};
