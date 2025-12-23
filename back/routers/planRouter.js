//planRouter.js

const express = require("express");
const router = express.Router();
const planService = require("../services/planService.js");

// 지원계획서 작성
router.post("/plan", async (req, res) => {
  const { application_no } = req.body;
  let list = await planService.addplan(application_no);
  res.send(list);
});

module.exports = router;
