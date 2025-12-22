const express = require("express");
const router = express.Router();
const usersService = require("../services/usersService.js");

// 로그인
router.get("/login", async (req, res) => {
  let list = await usersService.findByIdAndPw();
  res.send(list);
});
