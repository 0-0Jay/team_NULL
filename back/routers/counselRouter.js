//counselRouter.js

const express = require("express");
const router = express.Router();
const counselService = require("../services/counselService.js");

//상담내역 작성
router.post("/counsel", async (req, res) => {
  const {application_no, title, content, counsel_date, counsel_author} = 
  req.body;

  console.log("router", req.body);

  try {
    const list = await counselService.addCounsel({
      application_no,
      title,
      content,
      counsel_date,
      counsel_author
  });
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send("상담등록 중 오류 발생");
  }
});

//상담내역 조회
router.get("/counsel/:application_no", async (req, res) => {
    const {application_no} = req.params;
    const counselList = await counselService.findCounsel(application_no)
    res.send(counselList);
});

module.exports = router;