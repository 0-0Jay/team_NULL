// Table : plan

//지원 계획서 작성
const insertPlan = `
INSERT INTO plan(title, content, file, application_no, start, end)
VALUES(?, ?, ?, ?, ?, ?)`;

module.exports = {
  insertPlan,
};
