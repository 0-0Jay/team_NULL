//resultRouter.js

const express = require("express");
const router = express.Router();
const resultService = require("../services/resultService.js");

//지원결과서 작성
router.post("/result", async (req, res) => {
  const { title, content, file, plan_no, start, end, result_author } = req.body;
  let list = await resultService.addResult(
    title,
    content,
    file,
    plan_no,
    start,
    end,
    result_author
  );
  res.send(list);
});

//승인된 지원결과서 조회(일반, 관리자)
router.get("/result/:plan_no", async (req, res) => {
  const { plan_no } = req.params;
  const { status } = req.query;
  const resultList = await resultService.findResult(plan_no, status);
  res.send(resultList);
});

//승인대기중인 지원결과서 조회 -
router.get("/result/pending/:plan_no", async (req, res) => {
  const { plan_no } = req.params;
  const resultPendingList = await resultService.findPendingResult(plan_no);
  res.send(resultPendingList);
});

module.exports = router;
