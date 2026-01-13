// Table : faq, inquiries, inquiry_answer

// faq 목록 조회
const selectAllFaq = `SELECT faq_no, title, content, faq_date 
                      FROM faq`;

// faq 단건 조회
const selectByFaqnoFaq = `SELECT faq_no, title, content, faq_date 
                          FROM faq
                          WHERE faq_no = ?`;

// faq 등록
const insertFaq = `INSERT INTO faq (title, content, user_no)
                  VALUES (?, ?, ?)`;

// faq 수정
const updateByFaqnoFaq = `UPDATE faq
                          SET title = ?, content = ?, user_no = ?, faq_date = CURDATE()
                          WHERE faq_no = ?`;

// faq 삭제
const deleteByFaqnoFaq = `DELETE FROM faq
                          WHERE faq_no = ?`;

// 문의 등록
const insertInquiry = `insert into inquiries (user_no, a_no, type, title, content, status) 
                              values (?,?,?,?,?,0)`;

// 보호자의 지원자 여부 확인
const selectByUserNoApplicant = `select 1
                                 from applicant
                                 where a_no = ? and user_no = ? `;

// 문의 목록 및 상세보기(일반회원)
const selectByUserNoInquiry = `select i.*, u.name as writer_name
                               from inquiries i
                               join users u on i.user_no = u.user_no
                               where i.user_no = ?
                               order by i.inquiry_date`;

// 문의 목록 및 상세보기(담당자, 기관관리자)
const selectByCnoInquiry = `select i.*, u.name as writer_name
                            from inquiries i
                            join users u on i.user_no = u.user_no
                            where u.c_no = ?
                            order by i.inquiry_date`;

// 문의 상세보기(일반회원)
const selectByUserNoInquiryDetail = `select
  i.*,
  u.name as writer_name,
  a.content as answer_content
from inquiries i
join users u
  on i.user_no = u.user_no
left join inquiry_answer a
  on i.inquiry_no = a.inquiry_no
where i.inquiry_no = ?
  and i.user_no = ?
`;

// 문의 상세보기(담당자, 기관관리자)
const selectByCnoInquiryDetail = `select
  i.*,
  u.name as writer_name,
  a.content as answer_content
from inquiries i
join users u
  on i.user_no = u.user_no
left join inquiry_answer a
  on i.inquiry_no = a.inquiry_no
where i.inquiry_no = ?
  and u.c_no = ?
`;

// 문의 수정
const updateByInquiryNoInquiries = `update inquiries
                                    set a_no = ?, type = ?, title = ?, content = ?
                                    where inquiry_no = ? and user_no = ?`;

// 답변 존재 여부 확인
const selectInquiryAnswer = `select 1
                             from inquiry_answer
                             where inquiry_no = ?
                             limit 1`;

// 답변 등록
const insertInquiryAnswer = `insert into inquiry_answer(inquiry_no, user_no, content) values (?, ?, ?)`;

// 문의 상태 변경(답변 완료)
const updateInquiryStatus = `update inquiries
                             set status = 1
                             where inquiry_no = ?`;

// 답변 수정
const updateInquiryAnswer = `update inquiry_answer
                             set content = ?, answer_date = now()
                             where inquiry_no = ?`;

module.exports = {
  selectAllFaq,
  selectByFaqnoFaq,
  insertFaq,
  updateByFaqnoFaq,
  deleteByFaqnoFaq,
  insertInquiry,
  selectByUserNoApplicant,
  selectByUserNoInquiry,
  selectByCnoInquiry,
  selectByUserNoInquiryDetail,
  selectByCnoInquiryDetail,
  updateByInquiryNoInquiries,
  selectInquiryAnswer,
  insertInquiryAnswer,
  updateInquiryStatus,
  updateInquiryAnswer,
};
