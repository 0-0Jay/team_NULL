//resultRouter.js

const express = require("express");
const router = express.Router();
const resultService = require("../services/resultService.js");

//지원결과서 작성
router.post("/result", async (req, res) => {
  const { title, content, file, application_no, start, end } = req.body;
  let list = await resultService.addResult(
    title,
    content,
    file,
    application_no,
    start,
    end
  );
  res.send(list);
});

//지원결과서 조회 (일반)
router.post("/result", async (req, res) => {
  const { title, content, file, start, end, result_no, status, approve_date } =
    req.body;
  let list = await resultService.findResult(
    title,
    content,
    file,
    start,
    end,
    result_no,
    status,
    approve_date
  );
  res.send(list);
});

//지원결과서 조회 (=승인) (관리자)
router.post("/result", async (req, res) => {
  const { title, content, file, start, end, result_no, result_author } =
    req.body;
  let list = await resultService.findAdminResult(
    title,
    content,
    file,
    start,
    end,
    result_no,
    result_author
  );
  res.send(list);
});

module.exports = router;
