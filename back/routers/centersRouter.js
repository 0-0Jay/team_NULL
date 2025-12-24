const express = require("express");
const router = express.Router();
const centersService = require("../services/centersService");

// 기관 목록 불러오기
router.get("/centers", async (req, res) => {
  let centerList = await centersService.findAllCenter();
  res.send(centerList);
});

// 회원 소속 기관 불러오기
router.get(`/userCenter/:user_no`, async (req, res) => {
  const user_no = req.params.user_no;
  let list = await centersService.findByUsernoCenter(user_no);
  res.send(list);
});

module.exports = router;
