// Table : application

// 지원신청서 생성
const insertApplication = `insert into application(a_no, version_id, status) values(?,?,0)`;

// 지원신청서 답변 작성
const insertApplicationAnswer = `insert into application_answer(application_no, q_no, answer)
                                        values(?,?,?)`;

// 지원신청서 답변 수정
const updateByQnoApplicationAnswer = `update application_answer set answer = ? where application_no = ? and q_no = ?`;

module.exports = {
  insertApplication,
  insertApplicationAnswer,
  updateByQnoApplicationAnswer,
};
