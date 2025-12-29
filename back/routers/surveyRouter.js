const express = require("express");
const router = express.Router();
const surveyService = require("../services/surveyService.js");

// 조사지 전체 조회
router.get("/survey", async (req, res) => {
  let data = await surveyService.findAllSurvey();
  res.send(data);
});

module.exports = router;
