//resultRouter.js - 작업완료

const express = require("express");
const router = express.Router();
const resultService = require("../services/resultService.js");

//지원결과서 작성
router.post("/result", async (req, res) => {
  const { title, content, file, result_author, status, plan_no, start, end } =
    req.body;

  try {
    let list = await resultService.addResult(
      title,
      content,
      file,
      result_author,
      status,
      plan_no,
      start,
      end
    );
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버에러 발생");
  }
});

//승인된 지원결과서 조회(일반, 관리자)
router.get("/result/:plan_no", async (req, res) => {
  const { plan_no } = req.params;
  const { status } = req.query;
  const resultList = await resultService.findResult(plan_no, status);
  res.send(resultList);
});

//반려된 지원계획서 조회
router.get("/result/reject/:plan_no", async (req, res) => {
  const { plan_no } = req.params;
  const rejectList = await resultService.findRejectResult(plan_no);
  res.send(rejectList);
});

//승인대기중인 지원결과서 조회 -
router.get("/result/pending/:plan_no", async (req, res) => {
  const { plan_no } = req.params;
  const resultPendingList = await resultService.findPendingResult(plan_no);
  res.send(resultPendingList);
});

module.exports = router;
