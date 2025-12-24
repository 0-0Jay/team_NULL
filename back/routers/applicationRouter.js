const express = require("express");
const router = express.Router();
const applicationService = require("../services/applicationService");

// 지원 신청서 생성 + 답변 작성
router.post("/applications", async (req, res) => {
  let appInfo = req.body;
  let result = await applicationService.addApplication(appInfo);
  res.send(result);
});

// 지원 신청서 답변 수정
router.put("/applications/:applicationNo/answers", async (req, res) => {
  let applicationNo = req.params.applicationNo;
  let answers = req.body;

  let result = await applicationService.modifyByQnoApplicationAnswer(
    applicationNo,
    answers
  );
  res.send(result);
});

module.exports = router;
