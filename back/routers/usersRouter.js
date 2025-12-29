const express = require("express");
const router = express.Router();
const usersService = require("../services/usersService");

// 로그인
router.post("/login", async (req, res) => {
  const { id, pw } = req.body;
  console.log(id, pw);
  let list = await usersService.findByIdAndPwUsers(id, pw);
  res.send(list);
});

// 회원가입
router.post("/signUp", async (req, res) => {
  const data = req.body;
  let result = await usersService.addUsers(data);
  res.send(result);
});

// 아이디 중복 확인
router.post("/idCheck", async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  let result = await usersService.findByIdUsers(id);
  res.send(result);
});

// 이메일 중복 확인
router.post("/emailCheck", async (req, res) => {
  const { email } = req.body;
  let result = await usersService.findByEmailUsers(email);
  res.send(result);
});

// 인증번호 발송
router.post("/sendCode", async (req, res) => {
  const { email } = req.body;
  let result = await usersService.sendCode(email);
  res.send(result);
});

// 아이디 찾기
router.post("/findId", async (req, res) => {
  const { name, email } = req.body;
  let list = await usersService.findByNameAndEmailUsers(name, email);
  res.send(list);
});

// 기관 관리자 불러오기
router.get("/usersManager", async (req, res) => {
  let list = await usersService.findByCnoUsersCenters();
  res.send(list);
});

// 기관 관리자 페이지 - 기관 담당자 불러오기
// pic : the person in charge
router.get("/usersStaff", async (req, res) => {
  let list = await usersService.findByUserNoUsersManager();
  res.send(list);
});

// 기관 관리자 페이지 - 기관 담당자 정보 수정
router.put("/usersStaff/:userNo", async (req, res) => {
  console.log("params.userNo:", req.params.userNo);
  console.log("body:", req.body);
  const userInfo = req.body;
  const userNo = req.params.userNo;

  let list = await usersService.modifyByUserNoUsers(userInfo, userNo);

  res.send(list);
});

// 회원상태(사용승인 및 비활성화)
router.put("/users/status", async (req, res) => {
  const { userNos, status } = req.body;

  if (
    !Array.isArray(userNos) ||
    userNos.length == 0 ||
    ![1, 2].includes(status)
  ) {
    return res.status(400).send({ status: "fail", message: "invalid request" });
  }

  let list = await usersService.modifyStatusUsers(userNos, status);
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

// 회원탈퇴 -> 실제 delete가 아닌 상태값 변경
router.put("/users", async (req, res) => {
  const { user_no } = req.body;
  let result = await usersService.modifyStatusByUsernoUsers(user_no);
  res.send(result);
});

// 일반회원 마이페이지 - 나의 정보 조회
router.get("/users/:user_no", async (req, res) => {
  const user_no = req.params.user_no;
  let result = await usersService.findByUserNoUsers(user_no);
  res.send(result);
});

module.exports = router;
