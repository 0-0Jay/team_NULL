const mysql = require("../database/mappers.js");

//####### db에 날짜를 YYYY-MM-DD의 형식으로 넣기 위함
const toDateString = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
};

//지원계획서 작성  -  데이터 테스트 완료
const addPlan = async (
  title,
  content,
  plan_author,
  author_no,
  application_no,
  start,
  end
) => {
  //###### db에 날짜를 YYYY-MM-DD의 형식으로 넣기 위함
  const startDate = toDateString(start);
  const endDate = toDateString(end);

  let list = await mysql.query(
    "insertPlan",
    [
      title,
      content,
      plan_author,
      author_no,
      application_no,
      startDate,
      endDate,
    ],
    "plan"
  );
  return list;
};

//승인된 지원계획서 조회 - 데이터 테스트 완료
const findPlan = async (application_no) => {
  let list = await mysql.query("selectPlan", [application_no], "plan");
  return list;
};

// 반려된 지원계획서 조회
const findRejectPlan = async (application_no) => {
  let list = await mysql.query("rejectPlan", [application_no], "plan");
  return list;
};

//승인대기 중인 지원계획서 조회 (승인된 지원계획서랑 쿼리문이 달라서 나눠서 적은 것) - 데이터 테스트 완료
const findPendingPlan = async (application_no) => {
  let list = await mysql.query("selectPendingPlan", [application_no], "plan");
  return list;
};

// (기관관리자용) 지원 계획서 승인/반려 처리
const changePlanStatus = async (plan_no, status, reject = null) => {
  let result;

  // 승인
  if (status === 1) {
    result = await mysql.query("updatePlanStatusApprove", [plan_no], "plan");
  }

  // 반려
  if (status === 2) {
    if (!reject || !reject.trim()) {
      throw new Error("반려 사유는 필수입니다.");
    }
    result = await mysql.query(
      "updatePlanStatusReject",
      [reject, plan_no],
      "plan"
    );
  }
  if (result.affectedRows === 0) {
    return { status: "fail", message: "승인/반려 처리 실패" };
  }
  return { status: "success" };
};

module.exports = {
  addPlan,
  findPlan,
  findRejectPlan,
  findPendingPlan,
  changePlanStatus,
};
