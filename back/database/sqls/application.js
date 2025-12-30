// Table : application

// 지원신청서 생성
const insertApplication = `insert into application(a_no, version_id, status) values(?,?,0)`;

// 지원신청서 답변 작성
const insertApplicationAnswer = `insert into application_answer(application_no, q_no, answer)
                                        values(?,?,?)`;

// 지원신청서 답변 수정
const updateByQnoApplicationAnswer = `update application_answer set answer = ? where application_no = ? and q_no = ?`;

// 지원신청서 기본 정보 조회
const selectByAppNoApplication = `select a1.application_no, a1.a_no, a1.created_date, 
                                      a1.status, a1.approve_date,
                                      a2.name as ap_name,
                                      u1.name as g_name, c.name as c_name
                               from application a1
                               join applicant a2 on a1.a_no = a2.a_no
                               join users u1 on a2.user_no = u1.user_no
                               left join manager m on a1.a_no = m.a_no and m.unassign is null
                               left join users u2 on m.user_no = u2.user_no
                               left join center c on u2.c_no = c.c_no
                               order by a1.application_no`;

module.exports = {
  insertApplication,
  insertApplicationAnswer,
  updateByQnoApplicationAnswer,
  selectByAppNoApplication,
};
