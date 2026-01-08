//planRouter.js - 작업완료

const express = require("express");
const router = express.Router();
const planService = require("../services/planService.js");

const multer = require("multer");

// 지원계획서 작성  - 데이터 검사 완료
router.post("/plan", async (req, res) => {
  const {
    title,
    content,
    file,
    plan_author,
    status,
    application_no,
    start,
    end,
  } = req.body;

  try {
    const list = await planService.addPlan(
      title,
      content,
      file,
      plan_author,
      status,
      application_no,
      start,
      end
    );
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버에러 발생");
  }
});

//승인된 지원계획서 조회 (일반, 관리자)  - 데이터 검사 완료
router.get("/plan/:application_no", async (req, res) => {
  const { application_no } = req.params; //어떤 신청서를 가져올건지 위함
  const { status } = req.query; // 0인지 1인지 판단
  const planList = await planService.findPlan(application_no, status); //달라고 요청
  res.send(planList); //결과 보여줌
});

// 반려된 지원계획서 조회
router.get("/plan/reject/:application_no", async (req, res) => {
  const { application_no } = req.params;
  const rejectList = await planService.findRejectPlan(application_no);
  res.send(rejectList);
});

//승인대기중인 지원계획서 조회  -  데이터 검사 완료
router.get("/plan/pending/:application_no", async (req, res) => {
  const { application_no } = req.params;
  const planPendingList = await planService.findPendingPlan(application_no);
  res.send(planPendingList);
});

// 지원계획서 승인 / 반려 (status 변경)
router.patch("/plan/status", async (req, res) => {
  try {
    const { application_no, status } = req.body;
    console.log("status 변경 요청:", application_no, status); //
    await planService.updatePlanStatus(application_no, status);
    res.send({ success: true });
  } catch (err) {
    console.error("updatePlanStatus 에러:", err); //     res.status(500).send("status값 변경 실패");
  }
});
module.exports = router;
