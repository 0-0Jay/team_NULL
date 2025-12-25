// Table : center

// 기관 목록 불러오기
const selectAllCenter = `select c_no, name, address,
                                phone, email, manage,
                                created_date, closed_date
                         from center`;

// 회원 소속 기관 번호 불러오기
const selectByUsernoCenter = `
SELECT c.name, c.phone
FROM center c JOIN users u
WHERE u.c_no = c.c_no AND u.user_no = ?`;

module.exports = {
  selectAllCenter,
  selectByUsernoCenter,
};
