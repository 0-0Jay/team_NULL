const express = require("express");
const router = express.Router();
const usersService = require("../services/usersService");

// 로그인
router.post("/login", async (req, res) => {
  const { id, pw } = req.body;
  let list = await usersService.findByIdAndPwUsers(id, pw);
  res.send(list);
});

// 회원가입
router.post("/signUp", async (req, res) => {
  const data = req.body;
  let result = await usersService.addUsers(data);
  res.send(result);
});

// 아이디 찾기
router.post("/findId", async (req, res) => {
  const { name, email } = req.body;
  let list = await usersService.findByNameAndEmailUsers(name, email);
  res.send(list);
});

// 비밀번호 찾기
router.post("/findPw", async (req, res) => {
  const { id, email } = req.body;
  let list = await usersService.findByIdAndEmailUsers(id, email);
  res.send(list);
});

// 비밀번호 재설정
router.put("/findPw", async (req, res) => {
  const { user_no, pw } = req.body;
  let result = await usersService.modifyPwByUsernoUsers(user_no, pw);
  res.send(result);
});

// 회원탈퇴 ->
router.put("/users", async (req, res) => {
  const { user_no } = req.body;
  let result = await usersService.modifyStatusByUsernoUsers(user_no);
  res.send(result);
});

module.exports = router;
