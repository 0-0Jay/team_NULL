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
const addApplication = async (data) => {
  const { user_no, type, a_no, version_id, answer } = data;

  // 지원 신청서 생성
  const appResult = await mysql.query(
    "insertApplication",
    [a_no, version_id],
    "application"
  );

  let resObj = {};

  if (appResult.insertId > 0) {
    const applicationNo = appResult.insertId;

    // 담당자가 작성했을 경우 담당자 자동 배정
    if (user_type == 1) {
      const mngResult = await mysql.query(
        "insertManager",
        [applicationNo, user_no],
        "application"
      );
    }

    // 지원 신청서 답변 작성
    Object.entries(answer).forEach(async ([key, value]) => {
      await mysql.query(
        "insertApplicationAnswer",
        [
          applicationNo,
          key,
          value.reason,
          value.ox,
          new Date(value.start),
          new Date(value.end),
        ],
        "application"
      );
    });
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
const findByAppNoApplication = async (applicationNo) => {
  // 신청서 기본 정보 + 담당자
  const result = await mysql.query(
    "selectByAppNoApplication",
    [applicationNo],
    "application"
  );

  return result;
};

// 지원신청서 답변 수정
const modifyApplicationAnswer = async (data) => {
  const { whoEdit, originAnswer, answer } = data;
  let result = 0;

  Object.keys(originAnswer).forEach(async (qNo) => {
    const origin = originAnswer[qNo];
    const modify = answer[qNo];
    const answer_no = origin.answer_no;
    const before = {};
    const after = {};

    Object.keys(origin).forEach((key) => {
      if (origin[key] != modify[key]) {
        before[key] = origin[key];
        after[key] = modify[key];
      }
    });

    const before_ans = JSON.stringify(before);
    const after_ans = JSON.stringify(after);
    if (Object.keys(before).length > 0) {
      const rows = await mysql.query(
        "updateByAnsNoApplicationAnswer",
        [
          modify.ox,
          modify.reason,
          new Date(modify.start),
          new Date(modify.end),
          answer_no,
        ],
        "application"
      );
      await mysql.query(
        "insertHistory",
        [answer_no, whoEdit, before_ans, after_ans],
        "application"
      );
      result += rows.affectedRows;
    }
  });

  let resObj = {};

  if (result > 0) {
    resObj = { status: "success", result };
  } else {
    resObj = { status: "fail" };
  }

  return resObj;
};

// 대기단계 선택 후 요청(담당자)
const requestApplicationStatus = async (applicationNo, status, user) => {
  // 담당자 권한 확인
  const manager = await mysql.query(
    "selectByAppNoAndUserNoManager",
    [applicationNo, user.user_no],
    "application"
  );

  if (manager.length === 0) {
    throw new Error("단계 요청 권한 없음");
  }

  // status 값 확인
  if (![1, 2, 3].includes(status)) {
    throw new Error("잘못된 대기단계 값");
  }

  // 승인 전 + 미요청 상태에서만 요청 가능
  const result = await mysql.query(
    "updateByAppNoApplication",
    [status, applicationNo],
    "application"
  );

  if (result.affectedRows === 0) {
    return {
      status: "fail",
      message: "이미 승인되었거나 승인 요청된 신청서입니다.",
    };
  }

  return {
    status: "success",
    applicationNo,
  };
};

// 담당자 지정
const addManager = async (applicationNo, mUserNo, user) => {
  // 기관 관리자만 가능
  if (user.type !== 2) {
    throw new Error("담당자 지정 권한 없음");
  }

  // 같은 기관 신청서인지 확인
  const res = await mysql.query(
    "selectByAppNoAndCnoApplication",
    [applicationNo, user.c_no],
    "application"
  );
  if (res.length === 0) {
    throw new Error("다른 기관 신청서");
  }

  // 현재 담당자 수 확인 (최대 2명)
  const cntRes = await mysql.query(
    "selectCurrentManager",
    [applicationNo],
    "application"
  );
  if (cntRes[0].cnt >= 2) {
    return {
      status: "fail",
      message: "담당자는 최대 2명까지 지정할 수 있습니다.",
    };
  }

  // 동일 담당자 중복 확인
  const dupRes = await mysql.query(
    "selectDuplicateManager",
    [applicationNo, mUserNo],
    "application"
  );
  if (dupRes.length > 0) {
    return {
      status: "fail",
      message: "이미 지정된 담당자입니다.",
    };
  }

  // 담당자 지정
  const result = await mysql.query(
    "insertManager",
    [applicationNo, mUserNo],
    "application"
  );

  if (result.affectedRows > 0) {
    return { status: "success", applicationNo };
  }

  return { status: "fail", message: "담당자 지정 실패" };
};

// 지원자 정보 불러오기
const findApplicantInfo = async (user) => {
  // console.log(user);
  if (user.type === 0)
    return mysql.query(
      "selectInfoByUserNoApplicant",
      [user.user_no],
      "application"
    );
  if (user.type === 1)
    return mysql.query(
      "selectInfoByCnoApplicantUsers",
      [user.c_no],
      "application"
    );
};

module.exports = {
  findAllApplication,
  addApplication,
  findByAppNoApplication,
  modifyApplicationAnswer,
  requestApplicationStatus,
  addManager,
  findApplicantInfo,
};
