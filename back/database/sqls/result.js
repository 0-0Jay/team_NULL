// Table : result

//지원결과서 작성 - *주의 : 지원'계획서'번호를 받아와야함
const insertResult = `
INSERT INTO result(title, content, file, result_author, status, plan_no, start, end )
VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

//승인된 지원 결과서 조회
const selectResult = `
SELECT plan_no, title, content, file, start, end, result_no, status, approve_date, result_author
FROM result
WHERE plan_no = ? 
AND   status = 1`;

//반려된 지원계획서 조회
const rejectResult = `
SELECT plan_no, title, content, file, start, end, result_no, status, reject_date, result_author
FROM result
WHERE plan_no = ?
AND   status = 2`;

//승인대기 지원결과서 조회
const selectPendingResult = `
SELECT plan_no, title, content, file, start, end, result_no, status, result_author
FROM result
WHERE plan_no = ?
AND   status = 0`; // 대기중인 것만 불러 올려고 0 삽입  // 지원계획서를 기준으로 결과서를 작성해서 plan_no를 가져옴

// 지원결과서 승인, 반려, 검토, 결과 집계
const selectCountResult = `select p.application_no,
                                  sum(case when r.result_no is not null and r.approve_date is null and r.reject_date is null then 1 else 0 end) as review_count,
                                  sum(case when r.result_no is not null and r.approve_date is not null then 1 else 0 end) as approve_count,
                                  sum(case when r.result_no is not null and r.reject_date is not null then 1 else 0 end) as reject_count,
                                  count(r.result_no) as result_count
                           from plan p
                           left join result r on p.plan_no = r.plan_no
                           group by p.application_no`;

module.exports = {
  insertResult,
  selectResult,
  rejectResult,
  selectPendingResult,
  selectCountResult,
};
