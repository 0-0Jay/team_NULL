const express = require("express");
const router = express.Router();
const applicationService = require("../services/applicationService");

// 지원신청서 작성
router.post("/applications", async (req, res) => {
  const data = req.body;
  const result = await applicationService.addApplication(data);
  res.send(result);
});

// 지원신청서 수정
router.put("/applications", async (req, res) => {
  const data = req.body;
  const result = await applicationService.modifyApplicationAnswer(data);
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
  const result = await applicationService.findByAppNoApplication(applicationNo);
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

  const result = await applicationService.requestApplicationStatus(
    applicationNo,
    status,
    user
  );
  res.send(result);
});

// 담당자 지정
router.post("/applications/:applicationNo/manager", async (req, res) => {
  const applicationNo = req.params.applicationNo;
  const { mUserNo, user } = req.body;

  if (!user) {
    return res.send({
      status: "fail",
      message: "사용자 정보 없음",
    });
  }

  const result = await applicationService.addManager(
    applicationNo,
    mUserNo,
    user
  );
  res.send(result);
});

// 지원자 불러오기
router.post("/findApplicant", async (req, res) => {
  const { user } = req.body || {};

  if (!user || user.type === undefined) {
    return res.send({
      status: "fail",
      message: "사용자 정보 없음",
    });
  }

  const result = await applicationService.findApplicantInfo(user);
  res.send(result);
});

// 대기단계 승인 및 반려(관리자)
router.patch("/applications/:applicationNo/approve", async (req, res) => {
  const applicationNo = Number(req.params.applicationNo);
  const { action, reason, user } = req.body;
  console.log("approve API", {
    applicationNo,
    action,
    reason,
    user,
  });

  if (!user) {
    return res.send({
      status: "fail",
      message: "사용자 정보 없음",
    });
  }

  const result = await applicationService.approveApplicationStatus(
    applicationNo,
    action,
    reason,
    user
  );
  res.send(result);
});

module.exports = router;
