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

// 문의 등록 (일반회원)
router.post("/inquiries", async (req, res) => {
  const inquiryInfo = req.body;
  console.log("받은 body:", req.body);
  const result = await questionsService.addInquiry(inquiryInfo);
  res.send(result);
});

// 문의 목록
router.post("/inquiries/list", async (req, res) => {
  const result = await questionsService.findInquiryList(req.body);
  res.send(result);
});

// 문의 상세 조회
router.post("/inquiries/detail/:inquiry_no", async (req, res) => {
  const inquiryNo = Number(req.params.inquiry_no);
  const { userNo, type, cNo } = req.body;

  const result = await questionsService.findInquiryDetail({
    inquiryNo,
    userNo,
    type,
    cNo,
  });

  res.send(result);
});

// 문의 수정
router.put("/inquiries/:inquiryNo", async (req, res) => {
  const inquiryNo = Number(req.params.inquiryNo);

  const { userNo, type: userType, aNo, inquiryType, title, content } = req.body;

  const result = await questionsService.modifyInquiry(inquiryNo, {
    userNo,
    userType,
    aNo,
    inquiryType,
    title,
    content,
  });

  res.send(result);
});

// 답변 등록 (담당자/관리자)
router.post("/inquiries/:inquiryNo/answer", async (req, res) => {
  const inquiryNo = Number(req.params.inquiryNo);

  const { userNo, type: userType, content } = req.body;

  const result = await questionsService.addInquiryAnswer({
    inquiryNo,
    userNo,
    userType,
    content,
  });

  res.send(result);
});

// 답변 수정 (담당자/관리자)
router.put("/inquiries/:inquiryNo/answer", async (req, res) => {
  const inquiryNo = Number(req.params.inquiryNo);

  const { type: userType, content } = req.body;

  const result = await questionsService.modifyInquiryAnswer({
    inquiryNo,
    userType,
    content,
  });

  res.send(result);
});

module.exports = router;
