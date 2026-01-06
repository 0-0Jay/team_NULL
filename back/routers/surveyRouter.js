const express = require("express");
const router = express.Router();
const surveyService = require("../services/surveyService.js");

// 조사지 전체 조회
router.get("/survey", async (req, res) => {
  let data = await surveyService.findAllSurvey();
  res.send(data);
});

// 조사지 새 버전 추가
router.post("/survey", async (req, res) => {
  const data = req.body;
  let result = await surveyService.addSurvey(data);
  res.send(result);
});

// 조사지 기존 버전 수정
router.put("/survey", async (req, res) => {
  const data = req.body;
  let result = await surveyService.modifySurvey(data);
  res.send(result);
});

module.exports = router;
