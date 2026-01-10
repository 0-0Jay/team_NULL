// Table : plan

//지원 계획서 작성 - *주의 : 지원'신청서' 번호를 받아와야함 - 데이터 검사 완료
const insertPlan = `
INSERT INTO plan(title, content, plan_author, author_no, status, application_no, start, end)
VALUES(?, ?, ?, ?, 0, ?, ?, ?)`;

//승인된 지원 계획서 조회 - 데이터 검사 완료
const selectPlan = `
SELECT title, content, file, start, end, plan_no, status, approve_date, plan_author
FROM plan
WHERE application_no = ?
AND   status = 1`;

//반려된 지원 계획서 조회
const rejectPlan = `
SELECT application_no, title, content, file, start, end, plan_no, status, reject_date, plan_author
FROM plan
WHERE application_no = ?
AND   status = 2`;

//승인대기 지원계획서 조회  데이터 검사완료
const selectPendingPlan = `
SELECT plan_no, title, content, plan_author, author_no, status, application_no, start, end
FROM plan
WHERE application_no = ?
AND status = 0`;

// (기관관리자용) 지원계획서 승인
const updatePlanStatusApprove = `update plan
                                 set status = 1, approve_date = now()
                                 where plan_no = ? and status = 0`;

// (기관관리자용) 지원계획서 반려
const updatePlanStatusReject = `update plan 
                                set status = 2, reject_date = now(), reject = ?
                                where plan_no = ? and status = 0`;

// 지원계획서 승인, 반려, 검토 집계
const selectCountPlan = `select p.application_no,
                                sum(case when p.approve_date is null and p.reject_date is null then 1 else 0 end) as review_count,
                                sum(case when p.approve_date is not null then 1 else 0 end) as approve_count,
                                sum(case when p.reject_date is not null then 1 else 0 end) as reject_count,
                                count(p.plan_no) as plan_count

                         from plan p
                         group by p.application_no`;

module.exports = {
  insertPlan,
  selectPlan,
  rejectPlan,
  selectPendingPlan,
  updatePlanStatusApprove,
  updatePlanStatusReject,
  selectCountPlan,
};
