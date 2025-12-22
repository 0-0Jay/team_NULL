const express = require("express");
const router = express.Router();
const centersService = require("../services/centersService");

// 기관 목록 불러오기
router.get("/centers", async (req, res) => {
  let centerList = await centersService.findAllCenter();
  res.send(centerList);
});

module.exports = router;
