const express = require("express");
const router = express.Router();
const centersService = require("../services/centersService");

// 기관 목록 불러오기
router.get("/centers", async (req, res) => {
  let centerList = await centersService.findAllCenter();
  res.send(centerList);
});

// 기관 등록
router.post("/centers", async (req, res) => {
  const data = req.body;
  console.log(data);
  let result = await centersService.addCenter(data);
  res.send(result);
});

// 기관 검색 (자동완성용)
router.get("/searchCenter", async (req, res) => {
  const { name } = req.query;

  if (!name) return res.send([]);

  let list = await centersService.findByNameCenter(name);
  res.send(list);
});

// 회원 소속 기관 불러오기
router.get(`/userCenter/:user_no`, async (req, res) => {
  const user_no = req.params.user_no;
  let list = await centersService.findByUsernoCenter(user_no);
  res.send(list);
});

// 기관 주소 불러오기
router.get(`/address`, async (req, res) => {
  let list = await centersService.findAllAddressCenter();
  res.send(list);
});

module.exports = router;
