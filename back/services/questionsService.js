const mysql = require("../database/mappers.js");

// faq 목록 조회
const findAllFaq = async () => {
  let faqList = await mysql.query("selectAllFaq", null, "questions");
  return faqList;
};

// faq 단건 조회
const findByFaqnoFaq = async (faqNo) => {
  let faqDetail = await mysql.query("selectByFaqnoFaq", [faqNo], "questions");
  return faqDetail;
};

// faq 등록
const addFaq = async (title, content, user_no) => {
  let list = await mysql.query(
    "insertFaq",
    [title, content, user_no],
    "questions"
  );
};

module.exports = { findAllFaq, findByFaqnoFaq, addFaq };
