// Table : center

// 기관 목록 불러오기
const selectAllCenter = `select name, address,
                                phone, email, manage,
                                created_date, closed_date
                         from center`;

module.exports = {
  selectAllCenter,
};
