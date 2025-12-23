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

//지원결과서 조회
router.post("/result", async (req, res) => {
  const { title, content, file, start, end, result_no, status, approve_date } =
    req.body;
  let list = await resultService.findresult(
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
module.exports = router;
