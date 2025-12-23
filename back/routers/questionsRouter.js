const express = require("express");
const router = express.Router();
const questionsService = require("../services/questionsService");

// faq 목록 조회
router.get("/questions", async (req, res) => {
  let faqList = await questionsService.findAllFaq();
  res.send(faqList);
});

module.exports = router;
