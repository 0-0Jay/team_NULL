const express = require("express");
const app = express();
const port = 3000;
//--------------------------------------------------------

//-------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Done");
});

// 회원관리 라우터
const usersRouter = require("./routers/usersRouter.js");
app.use(`/api`, usersRouter);

// 기관관리 라우터
const centersRouter = require("./routers/centersRouter.js");
app.use(`/api`, centersRouter);

// 문의관리 라우터
const questionsRouter = require("./routers/questionsRouter.js");
app.use(`/api`, questionsRouter);

// 지원계획서 라우터
const planRouter = require("./routers/planRouter.js");
app.use(`/api`, planRouter);

// 지원결과서 라우터
const resultRouter = require("./routers/resultRouter.js");
app.use(`/api`, resultRouter);

// 지원신청서 관련 라우터
const applicationRouter = require("./routers/applicationRouter.js");
app.use(`/api`, applicationRouter);

// 조사지 관련 라우터
const surveyRouter = require("./routers/surveyRouter.js");
app.use(`/api`, surveyRouter);
