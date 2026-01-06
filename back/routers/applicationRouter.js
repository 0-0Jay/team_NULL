const express = require("express");
const router = express.Router();
const applicationService = require("../services/applicationService");

// 지원 신청서 생성 + 답변 작성
// router.post("/applications", async (req, res) => {
//   let appInfo = req.body;
//   let result = await applicationService.addApplication(appInfo);
//   res.send(result);
// });

router.post("/applications", async (req, res) => {
  const { user, ...appInfo } = req.body;

  if (!user) {
    return res.send({
      status: "fail",
      message: "사용자 정보 없음",
    });
  }

  const result = await applicationService.addApplication(appInfo, user);
  res.send(result);
});

// 지원 신청서 답변 수정
router.put("/applications/:applicationNo/answers", async (req, res) => {
  const applicationNo = req.params.applicationNo;
  const { answers, user } = req.body;

  if (!user) {
    return res.send({
      status: "fail",
      message: "사용자 정보 없음",
    });
  }

  const result = await applicationService.modifyByQnoApplicationAnswer(
    applicationNo,
    answers,
    user
  );
  res.send(result);
});

// 지원신청내역 불러오기
router.post("/applicationList", async (req, res) => {
  const { user } = req.body || {};

  if (!user || user.type === undefined) {
    return res.send({
      status: "fail",
      message: "사용자 정보 없음",
    });
  }

  const result = await applicationService.findAllApplication(user);
  res.send(result);
});

// 지원신청서 조회
router.get("/applications/:applicationNo", async (req, res) => {
  const applicationNo = req.params.applicationNo;
  const { user } = req.body || {};

  if (!user) {
    return res.send({
      status: "fail",
      message: "사용자 정보 없음",
    });
  }

  const result = await applicationService.findByAppNoApplication(
    applicationNo,
    user
  );
  res.send(result);
});

// 대기단계 선택
router.patch("/applications/:applicationNo/status", async (req, res) => {
  const applicationNo = req.params.applicationNo;
  const { status, user } = req.body;

  if (!user) {
    return res.send({
      status: "fail",
      message: "사용자 정보 없음",
    });
  }

  const result = await applicationService.modifyApplicationStatus(
    applicationNo,
    status,
    user
  );
  res.send(result);
});

// 담당자 지정
router.post("/applications/:applicationNo/manager", async (req, res) => {
  const applicationNo = req.params.applicationNo;
  const { managerUserNo, user } = req.body;

  if (!user) {
    return res.send({
      status: "fail",
      message: "사용자 정보 없음",
    });
  }

  const result = await applicationService.addManager(
    applicationNo,
    managerUserNo,
    user
  );
  res.send(result);
});

module.exports = router;
