//counselRouter.js

const express = require("express");
const router = express.Router();
const counselService = require("../services/counselService.js");

//상담내역 작성 - 테스트 완료
router.post("/counsel", async (req, res) => {
  const { application_no, title, content, save, counsel_date, counsel_author } =
    req.body;

  console.log("router", req.body);

  try {
    const list = await counselService.addCounsel({
      application_no,
      title,
      content,
      save,
      counsel_date,
      counsel_author,
    });
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send("상담등록 중 오류 발생");
  }
});

//상담내역 조회 - 테스트 완료
router.get("/counsel/:application_no", async (req, res) => {
  try {
    const { application_no } = req.params;
    const { save } = req.query; // 임시저장 여부 판단
    const counselList = await counselService.findCounsel(application_no, save);
    res.send(counselList);
  } catch (err) {
    console.error(err);
    res.status(500).send("상담내역 조회 중 오류 발생");
  }
});

module.exports = router;
