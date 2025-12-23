const mysql = require("../database/mappers.js");

// faq 목록 조회
const findAllFaq = async () => {
  let faqList = await mysql.query("selectAllFaq", null, "questions");
  return faqList;
};

// faq 단건 등록
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

// faq 단건 삭제
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

module.exports = { findAllFaq, addFaq, removeByFaqnoFaq };
