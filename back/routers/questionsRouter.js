const express = require("express");
const router = express.Router();
const questionsService = require("../services/questionsService");

// faq 목록 조회
router.get("/questions", async (req, res) => {
  let faqList = await questionsService.findAllFaq();
  res.send(faqList);
});

// faq 단건 조회
router.get("/questions/:faq_no", async (req, res) => {
  const fno = req.params.faq_no;
  let result = await questionsService.findByFaqnoFaq(fno);
  res.send(result);
});

// faq 등록
router.post("/questions", async (req, res) => {
  const faqInfo = req.body;
  let result = await questionsService.addFaq(faqInfo);
  res.send(result);
});

// faq 수정
router.put(`/questions/:faq_no`, async (req, res) => {
  const faqInfo = req.body;
  faqInfo.faq_no = req.params.faq_no;
  let result = await questionsService.modifyByFaqnoFaq(faqInfo);
  res.send(result);
});

// faq 삭제
router.delete(`/questions/:faq_no`, async (req, res) => {
  const fno = req.params.faq_no;
  let result = await questionsService.removeByFaqnoFaq(fno);
  res.send(result);
});

module.exports = router;
