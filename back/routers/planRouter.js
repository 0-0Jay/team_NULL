//planRouter.js
//sql에서 작성한 파라미터 값 그대로 들고와야함

const express = require("express");
const router = express.Router();
const planService = require("../services/planService.js");

// 지원계획서 작성
router.post("/plan", async (req, res) => {
  const { title, content, file, application_no, start, end } = req.body;
  let list = await planService.addplan(
    title,
    content,
    file,
    application_no,
    start,
    end
  );
  res.send(list);
});

//지원계획서 조회
router.post("/plan", async (req, res) => {
  const { title, content, file, start, end, plan_no, status, approve_date } =
    req.body;
  let list = await planService.findplan(
    title,
    content,
    file,
    start,
    end,
    plan_no,
    status,
    approve_date
  );
  res.send(list);
});

module.exports = router;
