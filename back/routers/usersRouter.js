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

// 시스템 및 기관 관리자 페이지 - 기관 담당자 불러오기
router.post("/usersStaff", async (req, res) => {
  const { user } = req.body || {};
  console.log("user 정보 -> ", user);
  if (!user || user.type === undefined) {
    return res.send({
      status: "fail",
      message: "사용자 정보 없음",
    });
  }
  let list = await usersService.findByUserNoUsersManager(user);
  console.log(list);
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

// 권한별 마이페이지 - 나의 정보 조회
router.get("/users/:user_no", async (req, res) => {
  const user_no = req.params.user_no;
  // 1. 사용자 타입 조회
  const userType = await usersService.findTypeByuserNoUsers(user_no);
  if (userType == null) {
    return res.status(404).send({ message: "사용자 없음" });
  }
  const type = Number(userType);
  let result;

  // 2. 타입 기준으로 서비스 분기
  if (type === 0) {
    result = await usersService.findByUserNoUsers(user_no);
  } else if (type === 1 || type === 2) {
    result = await usersService.findByUserNoStaffUsers(user_no);
  } else {
    return res.status(403).send({ message: "권한 없음" });
  }
  res.send(result);
});

// 일반회원 마이페이지 - 나의 정보 수정
router.put("/users/:user_no", async (req, res) => {
  const generaluserInfo = req.body;
  generaluserInfo.user_no = req.params.user_no;
  let result = await usersService.modifyByUserNoGeneralUsers(generaluserInfo);
  res.send(result);
});

// 마이페이지 - 지원자 목록 조회
router.get("/users/:user_no/applicant", async (req, res) => {
  const user_no = req.params.user_no;
  // 1. 사용자 타입 조회
  const userType = await usersService.findTypeByuserNoUsers(user_no);
  if (userType == null) {
    return res.status(404).send({ message: "사용자 없음" });
  }
  const type = Number(userType);
  let result;

  // 2. 타입 기준으로 서비스 분기
  if (type === 0) {
    result = await usersService.findByUserNoApplicant(user_no);
  } else if (type === 1) {
    result = await usersService.findApplicantByStaff(user_no);
  } else {
    return res.status(403).send({ message: "권한 없음" });
  }
  res.send(result);
});

// 마이페이지 - 지원자 상세정보 조회
router.get("/users/applicant/:a_no", async (req, res) => {
  const a_no = req.params.a_no;
  let result = await usersService.findByANoApplicant(a_no);
  res.send(result);
});

// 마이페이지 - 지원자 상세정보 수정
router.put("/users/applicant/:a_no", async (req, res) => {
  const applicantInfo = req.body;
  applicantInfo.a_no = req.params.a_no;
  let result = await usersService.modifyByAnoApplicant(applicantInfo);
  res.send(result);
});

// 마이페이지 - 지원자 삭제
router.delete("/users/applicant/:a_no", async (req, res) => {
  const ano = req.params.a_no;
  let result = await usersService.removeByANoApplicant(ano);
  res.send(result);
});

// 마이페이지 - 지원자 등록
router.post("/users/applicant/new", async (req, res) => {
  const applicantInfo = req.body;
  let result = await usersService.addApplicant(applicantInfo);
  res.send(result);
});

// 기관관리자 마이페이지 - 기관정보 조회
router.get("/users/:user_no/center", async (req, res) => {
  const user_no = req.params.user_no;
  let result = await usersService.findCenterByManager(user_no);
  res.send(result);
});

// 기관관리자 마이페이지 - 기관 소속 담당자 목록
router.get("/users/:user_no/center/staff", async (req, res) => {
  const user_no = req.params.user_no;
  let result = await usersService.findStaffByManager(user_no);
  res.send(result);
});

// 기관관리자 마이페이지 - 기관 정보 수정
router.put("/users/:user_no/center", async (req, res) => {
  const centerInfo = req.body;
  centerInfo.user_no = req.params.user_no;
  let result = await usersService.modifyCenterByManager(centerInfo);
  res.send(result);
});

// 시스템 관리자 페이지 - 기관 담당자 등록
router.post("/users/staff/new", async (req, res) => {
  const staffInfo = req.body;
  const result = await usersService.addStaffByAdmin(staffInfo);
  res.send(result);
});

module.exports = router;
