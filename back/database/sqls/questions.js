// Table : faq

// faq 목록 조회
const selectAllFaq = `SELECT title, u.name, faq_date 
                      FROM faq f 
                      JOIN users u 
                      ON f.user_no = u.user_no`;

module.exports = {
  selectAllFaq,
};
