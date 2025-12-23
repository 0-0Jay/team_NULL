const express = require("express");
const router = express.Router();
const questionsService = require("../services/questionsService");

// faq 목록 조회
router.get("/questions", async (req, res) => {
  let faqList = await questionsService.findAllFaq();
  res.send(faqList);
});

// faq 단건 등록
router.post("/question", async (req, res) => {
  const faqInfo = req.body;
  let result = await questionsService.addFaq(faqInfo);
  res.send(result);
});

// faq 단건 삭제
router.delete(`/questions/:faq_no`, async (req, res) => {
  const fno = req.params.faq_no;
  let faqInfo = await questionsService.removeByFaqnoFaq(fno);
  res.send(faqInfo);
});

module.exports = router;
