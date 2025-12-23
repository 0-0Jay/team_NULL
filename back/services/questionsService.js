const mysql = require("../database/mappers.js");

// faq 목록 조회
findAllFaq = async () => {
  const faqList = await mysql.query("selectAllFaq", null, "questions");
  return faqList;
};

module.exports = { findAllFaq };
