const express = require("express");
const router = express.Router();
const usersService = require("../services/usersService");

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

// 기관 관리자 불러오기
router.get("/users-manager", async (req, res) => {
  let list = await usersService.findByCnoUsersCenters();
  res.send(list);
});

// 기관 관리자 페이지 - 기관 담당자 불러오기
// pic : the person in charge
router.get("/users-pic", async (req, res) => {
  let list = await usersService.findByUserNoUsersManager();
  res.send(list);
});

// 기관 관리자 페이지 - 기관 담당자 정보 수정
router.put("/users-pic/:userNo", async (req, res) => {
  const userInfo = req.body;
  const userNo = req.params.userNo;

  let list = await usersService.modifyByUserNoUsers(userInfo, userNo);

  res.send(list);
});

module.exports = router;
