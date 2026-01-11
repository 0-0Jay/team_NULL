// Table : center

// 기관 목록 불러오기
const selectAllCenter = `select c_no, name, 
                         concat(sido, ' ', sigungu, ' ', address) as address, 
                         address_detail, zipcode,
                         phone, email, manage,
                         created_date, closed_date
                         from center `;

// 기관 검색 (자동완성용)
const selectByNameCenter = `select c_no, name
                            from center
                            where closed_date is null
                                  and name like concat('%', ?, '%')
                            order by name `;

// 회원 소속 기관 번호 불러오기
const selectByUsernoCenter = ` select c.name, c.phone
                               from center c join users u
                               where u.c_no = c.c_no and u.user_no = ?`;

// 기관 삭제(보류)
// const deleteByCnoCenter = `delete from center where c_no = ?`;

// 기관 주소 불러오기
const selectAllAddressCenter = `
SELECT sido, sigungu, name, c_no
FROM center
WHERE closed_date IS NULL
`;

// 기관 등록
const insertCenters = `
INSERT INTO center(name, sido, sigungu, address, address_detail, zipcode, phone, email, manage)
VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

// 시스템 관리자 - 기관 정보 수정
const updateByCNoCenter = `UPDATE center
                           SET name = ?, sido = ?, sigungu = ?, address = ?, address_detail = ?, 
                               zipcode = ?, phone = ?, email = ?, manage = ?, 
                               closed_date = CASE
                                  WHEN ? = 0 THEN NOW()
                                  ELSE NULL
                               END
                           WHERE c_no = ?`;

module.exports = {
  selectAllCenter,
  selectByUsernoCenter,
  selectAllAddressCenter,
  selectByNameCenter,
  insertCenters,
  updateByCNoCenter,
};
