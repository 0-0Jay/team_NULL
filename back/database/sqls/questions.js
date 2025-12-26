// Table : faq

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

module.exports = {
  selectAllFaq,
  selectByFaqnoFaq,
  insertFaq,
  updateByFaqnoFaq,
  deleteByFaqnoFaq,
};
