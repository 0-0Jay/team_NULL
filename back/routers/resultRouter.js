//resultRouter.js - 작업완료

const express = require("express");
const router = express.Router();
const resultService = require("../services/resultService.js");

//지원결과서 작성
router.post("/result", async (req, res) => {
  const data = req.body;
  const result = await resultService.addResult(data);
  res.send(result);
});

//지원결과서 조회
router.get("/result/:application_no", async (req, res) => {
  const applicationNo = req.params.application_no;
  const list = await resultService.findResult(applicationNo);
  res.send(list);
});

// 지원결과서 승인/반려
router.put("/result", async (req, res) => {
  const data = req.body;
  const result = await resultService.modifyResult(data);
  res.send(result);
});

module.exports = router;
