const express = require("express");
const app = express();
const port = 3000;

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

// 지원신청서 관련 라우터
const applicationRouter = require("./routers/applicationRouter.js");
app.use(`/api`, applicationRouter);
