const express = require("express");
const router = express.Router();
const usersService = require("../services/usersSerivce");

// 로그인
router.post("/login", async (req, res) => {
  const { id, pw } = req.body;
  let list = await usersService.findByIdAndPwUsers(id, pw);
  res.send(list);
});

// 아이디 찾기
router.post("/findId", async (req, res) => {
  const { name, email } = req.body;
  let list = await usersService.findByNameAndEmailUsers(name, email);
  res.send(list);
});

module.exports = router;
