// Table : result

//지원결과서 작성
const insertResult = `
INSERT INTO result(plan_no, title, content, start, end, status, result_author, author_no)
VALUES(?, ?, ?, ?, ?, 0, ?, ?)`;

// 지원결과서 조회
const selectResult = `
SELECT p.application_no, r.*
FROM plan p JOIN result r ON p.plan_no = r.plan_no
WHERE p.application_no = ?`;

// 지원결과서 승인/반려
const rejectResult = `
UPDATE result
SET status = ?, reject = ?, reject_date = CURDATE()
WHERE result_no = ?`;

const approveResult = `
UPDATE result
SET status = ?, approve_date = CURDATE()
WHERE result_no = ?`;

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
  approveResult,
  selectCountResult,
};
