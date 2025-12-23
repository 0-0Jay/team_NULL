//planRouter.js

const express = require("express");
const router = express.Router();
const planService = require("../services/planService.js");

// 지원계획서 작성
router.post("/plan", async (req, res) => {
  const { title, content, file, application_no, start, end } = req.body;
  let list = await planService.addPlan(
    title,
    content,
    file,
    application_no,
    start,
    end
  );
  res.send(list);
});

//승인된 지원계획서 조회 (일반, 관리자)
router.post("/plan/approved", async (req, res) => {
  const { application_no } = req.body;
  const planList = await planService.findPlan(application_no);
  res.send(planList);
});

//승인대기 지원계획서 조회(관리자 판단)
router.post("/plan/pending", async (req, res) => {
  const { title, content, file, start, end, plan_no, plan_author } = req.body;
  const planAdminList = await planService.findAdminPlan(
    title,
    content,
    file,
    start,
    end,
    plan_no,
    plan_author
  );
  res.send(planAdminList);
});

module.exports = router;
