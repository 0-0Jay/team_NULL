const mysql = require("../database/mappers.js");

//db에 날짜 형식 YYYY-MM-DD로 넣기 위함
const toDateString = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
};

//상담내역 작성  -  데이터 테스트 확인완료

const addCounsel = async ({
  application_no,
  title,
  content,
  save,
  counsel_date,
  counsel_author,
}) => {
  const counselDate = toDateString(counsel_date);

  console.log("service", counsel_author);
  let list = await mysql.query(
    "insertCounsel",
    [application_no, title, content, save, counselDate, counsel_author],
    "counsel"
  );
  return list;
};

// 작성된 상담내역 조회 - 데이터 테스트 완료
const findCounsel = async (application_no, save) => {
  let list = await mysql.query(
    "selectCounsel",
    [application_no, save],
    "counsel"
  );
  console.log("findCounsel result:", list);
  return list;
};

module.exports = {
  addCounsel,
  findCounsel,
};
