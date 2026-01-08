// Table : application

// 지원신청서 생성
const insertApplication = `insert into application(a_no, version_id, status) values(?,?,0)`;

// 지원신청서 답변 작성
const insertApplicationAnswer = `insert into application_answer(application_no, q_no, reason, OX, start, end)
                                        values(?,?,?,?,?,?)`;

// 지원신청서 답변 수정
const updateByAnsNoApplicationAnswer = `
UPDATE application_answer
SET OX = ?, reason = ?, start = ?, end = ?
WHERE answer_no = ?`;

// 지원신청서 답변 수정 이력 저장
const insertHistory = `
INSERT INTO history(answer_no, author, before_ans, after_ans)
VALUES(?, ?, ?, ?)`;

// 지원신청서 답변 조회
const selectByAppNoApplication = `
SELECT answer_no, q_no, reason, OX, start, end
FROM application_answer
WHERE application_no = ?`;

// 시스템 관리자용 전체 조회
const selectAllApplication = `select distinct a1.application_no,
                                              a1.a_no, a1.created_date, a1.status,
                                              a1.approve_date, a2.name as ap_name,
                                              u1.name as g_name, c.name as c_name,
                                              a2.gender, a2.birth, a2.disability
                              from application a1
                              join applicant a2 on a1.a_no = a2.a_no
                              join users u1 on a2.user_no = u1.user_no
                              left join manager m on a1.application_no = m.application_no and m.unassign is null
                              left join users u2 on m.user_no = u2.user_no
                              left join center c on u2.c_no = c.c_no
                              order by a1.application_no`;

// 기관 관리자용 조회
const selectByCenterApplication = `select a1.application_no, a1.a_no, a1.created_date, a1.status,
                                          a1.approve_date, a2.name as ap_name, u1.name as g_name,
                                          c.name as c_name, a2.gender, a2.birth, a2.disability
                                   from application a1
                                   join applicant a2 on a1.a_no = a2.a_no
                                   join users u1 on a2.user_no = u1.user_no 
                                   join center c on u1.c_no = c.c_no
                                   where u1.c_no = ?
                                   order by a1.application_no`;

// 기관 담당자용 조회
const selectByManagerApplication = `select distinct a1.application_no,
                                                    a1.a_no, a1.created_date, a1.status,
                                                    a1.approve_date, a2.name as ap_name,
                                                    u1.name as g_name, c.name as c_name,
                                                    a2.gender, a2.birth, a2.disability
                                    from application a1
                                    join applicant a2 on a1.a_no = a2.a_no
                                    join users u1 on a2.user_no = u1.user_no
                                    join manager m
                                      on a1.application_no = m.application_no
                                    and m.unassign is null
                                    join users u2 on m.user_no = u2.user_no
                                    left join center c on u2.c_no = c.c_no
                                    where m.user_no = ?
                                    order by a1.application_no`;

// 일반 회원용 조회
const selectByUserApplication = ` select a1.application_no, a1.a_no,
                                         a1.created_date, a1.status,
                                         a1.approve_date, a2.name as ap_name,
                                         u1.name as g_name, null as c_name,
                                         a2.gender, a2.birth, a2.disability
                                  from application a1
                                  join applicant a2 on a1.a_no = a2.a_no
                                  join users u1 on a2.user_no = u1.user_no
                                  where a2.user_no = ?
                                  order by a1.application_no`;

// 보호자의 지원자 여부 확인
const selectByUserNoApplicant = `select 1
                                 from applicant
                                 where a_no = ? and user_no = ? `;

// 현재 담당자 수 조회
const selectCurrentManager = `select count(*) as cnt
                              from manager
                              where application_no = ? and unassign is null`;

// 동일 담당자 중복 체크
const selectDuplicateManager = `select 1
                                from manager
                                where application_no = ? and user_no = ? and unassign is null`;

// 담당자 지정(담당자가 직접 신청하는 경우 + 기관관리자가 지정하는 경우)
const insertManager = `insert into manager(application_no, user_no) values (?,?)`;

// 담당자 해제(일단 넣어둠)
const updateUnassignManager = `update manager
                               set unassign = now()
                               where application_no = ? and user_no = ? and unassign is null`;

// 권한 체크
// 보호자
const selectByAppNoAndUserNoApplication = `select 1
                                           from application a1
                                           join applicant a2 on a1.a_no = a2.a_no
                                           where a1.application_no = ? and a2.user_no = ?`;

// 담당자
const selectByAppNoAndUserNoManager = `select 1
                                       from manager
                                       where application_no = ?
                                             and user_no = ?
                                             and unassign_date is null`;

// 기관 관리자
const selectByAppNoAndCnoApplication = `select 1
                                        from application a1
                                        join applicant a2 on a1.a_no = a2.a_no
                                        join users u on a2.user_no = u.user_no
                                        where a1.application_no = ?
                                              and u.c_no = ?`;
// 대기단계 설정
const updateByAppNoApplication = `update application set status = ? where application_no = ?`;

// 지원자 정보 불러오기
// 일반회원
const selectInfoByUserNoApplicant = `select * from applicant where user_no = ?`;

// 기관 담당자
const selectInfoByCnoApplicantUsers = `select a.*
                                       from applicant a
                                       join users u on a.user_no = u.user_no
                                       where u.c_no = ?`;

module.exports = {
  insertApplication,
  insertApplicationAnswer,
  updateByAnsNoApplicationAnswer,
  insertHistory,
  selectByAppNoApplication,
  selectByUserNoApplicant,
  selectCurrentManager,
  selectDuplicateManager,
  insertManager,
  selectByAppNoAndUserNoApplication,
  selectByAppNoAndUserNoManager,
  selectByAppNoAndCnoApplication,
  updateByAppNoApplication,
  selectAllApplication,
  selectByCenterApplication,
  selectByManagerApplication,
  selectByUserApplication,
  selectInfoByUserNoApplicant,
  selectInfoByCnoApplicantUsers,
  updateUnassignManager,
};
