const mysql = require("../database/mappers.js");

// faq 목록 조회
const findAllFaq = async () => {
  let faqList = await mysql.query("selectAllFaq", null, "questions");
  return faqList;
};

// faq 단건 조회
const findByFaqnoFaq = async (faqNo) => {
  let result = await mysql.query("selectByFaqnoFaq", [faqNo], "questions");
  return result;
};

// faq 등록
const addFaq = async ({ title, content, user_no } = {}) => {
  if (!title?.trim() || !content?.trim() || user_no == null) {
    return { status: "error", message: "invalid input" };
  }
  let result = await mysql.query(
    "insertFaq",
    [title, content, user_no],
    "questions"
  );
  let resObj = {};
  if (result.insertId > 0) {
    resObj = { status: "success", faq_no: result.insertId };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

// faq 수정
const modifyByFaqnoFaq = async ({ title, content, user_no, faq_no } = {}) => {
  if (!title?.trim() || !content?.trim() || user_no == null || faq_no == null) {
    return { status: "error", message: "invalid input" };
  }
  let result = await mysql.query(
    "updateByFaqnoFaq",
    [title, content, user_no, faq_no],
    "questions"
  );
  let resObj = {};
  if (result.affectedRows > 0) {
    resObj = { status: "success", faq_no };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

// faq 삭제
const removeByFaqnoFaq = async (faqNo) => {
  let faqInfo = await mysql.query("deleteByFaqnoFaq", [faqNo], "questions");
  let resObj = {};
  if (faqInfo.affectedRows > 0) {
    resObj = { status: "success", faq_no: faqNo };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};

// 문의 등록
const addInquiry = async ({ userNo, aNo, type, title, content } = {}) => {
  if (
    userNo == null ||
    aNo == null ||
    type == null ||
    !title?.trim() ||
    !content?.trim()
  ) {
    return { status: "error", message: "invalid input" };
  }

  // 지원자 소유 검증
  const isValidApplicant = await mysql.query(
    "selectByUserNoApplicant",
    [aNo, userNo],
    "questions"
  );
  if (!isValidApplicant) {
    return { status: "fail", message: "invalid applicant access" };
  }
  console.log(userNo, aNo, type, title, content);
  const result = await mysql.query(
    "insertInquiry",
    [userNo, aNo, type, title, content],
    "questions"
  );

  let resObj = {};
  if (result.insertId > 0) {
    resObj = {
      status: "success",
      inquiry_no: result.insertId,
    };
  } else {
    resObj = { status: "fail" };
  }

  return resObj;
};

// 문의 목록 조회
const findInquiryList = async ({ userNo, type, cNo } = {}) => {
  if (type == null) {
    return { status: "error", message: "invalid user type" };
  }

  let result = [];

  // 일반회원(보호자)
  if (type === 0) {
    result = await mysql.query("selectByUserNoInquiry", [userNo], "questions");
  }
  // 담당자 / 관리자
  else if (type === 1 || type === 2) {
    result = await mysql.query("selectByCnoInquiry", [cNo], "questions");
  } else {
    return { status: "error", message: "unknown user type" };
  }

  return result;
};

// 문의 상세 조회
const findInquiryDetail = async ({ inquiryNo, userNo, type, cNo } = {}) => {
  if (!inquiryNo || type == null) {
    return { status: "error", message: "invalid request" };
  }

  let result = [];

  // 일반회원(보호자)
  if (type === 0) {
    result = await mysql.query(
      "selectByUserNoInquiryDetail",
      [inquiryNo, userNo],
      "questions"
    );
  }
  // 담당자 / 관리자
  else if (type === 1 || type === 2) {
    result = await mysql.query(
      "selectByCnoInquiryDetail",
      [inquiryNo, cNo],
      "questions"
    );
  } else {
    return { status: "error", message: "unknown user type" };
  }

  return result[0];
};

// 문의 수정
const modifyInquiry = async (
  inquiryNo,
  { userNo, userType, aNo, inquiryType, title, content }
) => {
  if (userType !== 0) {
    return { status: "error", message: "권한 없음" };
  }

  const result = await mysql.query(
    "updateByInquiryNoInquiries",
    [aNo, inquiryType, title, content, inquiryNo, userNo],
    "questions"
  );

  if (result.affectedRows === 0) {
    return { status: "fail", message: "수정 실패" };
  }

  return { status: "success" };
};

const addInquiryAnswer = async ({ inquiryNo, userNo, userType, content }) => {
  // 권한 체크
  if (userType !== 1 && userType !== 2) {
    return { status: "error", message: "권한 없음" };
  }
  if (!content?.trim()) {
    return { status: "error", message: "invalid content" };
  }

  // 이미 답변 있는지 확인
  const exists = await mysql.query(
    "selectInquiryAnswer",
    [inquiryNo],
    "questions"
  );

  if (exists.length > 0) {
    return { status: "error", message: "이미 답변 존재" };
  }

  // 답변 등록
  const insertResult = await mysql.query(
    "insertInquiryAnswer",
    [inquiryNo, userNo, content],
    "questions"
  );

  if (insertResult.affectedRows === 0) {
    return { status: "fail", message: "답변 등록 실패" };
  }

  // 문의 상태 변경
  await mysql.query("updateInquiryStatus", [inquiryNo], "questions");

  return { status: "success" };
};

const modifyInquiryAnswer = async ({ inquiryNo, userType, content }) => {
  if (userType !== 1 && userType !== 2) {
    return { status: "error", message: "권한 없음" };
  }

  if (!content?.trim()) {
    return { status: "error", message: "invalid content" };
  }

  const result = await mysql.query(
    "updateInquiryAnswer",
    [content, inquiryNo],
    "questions"
  );

  if (result.affectedRows === 0) {
    return { status: "fail", message: "답변 수정 실패" };
  }

  return { status: "success" };
};

module.exports = {
  findAllFaq,
  findByFaqnoFaq,
  addFaq,
  modifyByFaqnoFaq,
  removeByFaqnoFaq,
  addInquiry,
  findInquiryList,
  findInquiryDetail,
  modifyInquiry,
  addInquiryAnswer,
  modifyInquiryAnswer,
};
