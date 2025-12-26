// Table : center

// 기관 목록 불러오기
const selectAllCenter = `select c_no, name, 
                         concat(sido, ' ', sigungu, ' ', address) as address, 
                         phone, email, manage,
                         created_date, closed_date
                         from center `;

// 회원 소속 기관 번호 불러오기
const selectByUsernoCenter = ` select c.name, c.phone
                               from center c join users u
                               where u.c_no = c.c_no and u.user_no = ?`;

// 기관 삭제(보류)
// const deleteByCnoCenter = `delete from center where c_no = ?`;

module.exports = {
  selectAllCenter,
  selectByUsernoCenter,
};
