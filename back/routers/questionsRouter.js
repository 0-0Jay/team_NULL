const express = require("express");
const router = express.Router();
const questionsService = require("../services/questionsService");

// faq 목록 조회
router.get("/questions", async (req, res) => {
  let faqList = await questionsService.findAllFaq();
  res.send(faqList);
});

// faq 상세 조회
router.get("/questions/:faq_no", async (req, res) => {
  const fno = req.params.faq_no;
  let faqDetail = await questionsService.findByFaqnoFaq(fno);
  res.send(faqDetail);
});

// faq 등록
router.post("/question", async (req, res) => {
  const { title, content, user_no } = req.body;
  let list = await questionsService.addFaq(title, content, user_no);
  res.send(list);
});

module.exports = router;
