// Table : faq

// faq 목록 조회
const selectAllFaq = `SELECT title, u.name, faq_date 
                      FROM faq f 
                      JOIN users u 
                      ON f.user_no = u.user_no`;

// faq 단건 조회
const selectByFaqnoFaq = `SELECT title, u.name, faq_date, content 
                          FROM faq f 
                          JOIN users u 
                          ON f.user_no = u.user_no
                          WHERE faq_no = ?`;

// faq 등록
const insertFaq = `INSERT INTO faq (title, content, user_no)
                  VALUES (?, ?, ?)`;

module.exports = {
  selectAllFaq,
  selectByFaqnoFaq,
  insertFaq,
};
