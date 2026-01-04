// Table : users

// 로그인
const selectByIdAndPwUsers = `
SELECT u.user_no, u.name AS u_name, u.status, u.type, c.name AS c_name
FROM users u LEFT OUTER JOIN center c
ON u.c_no = c.c_no
WHERE u.id = ? AND u.password = ?`;

// 회원가입
const insertUsers = `
INSERT INTO users(id, password, name, email, phone, address, address_detail, zipcode, type, c_no)
VALUES(?, ?, ? ,?, ?, ?, ? ,?, ?, ?)`;

// 아이디 중복 확인
const selectByIdUsers = `
SELECT id
FROM users
WHERE id = ?`;

// 이메일 중복 확인
const selectByEmailUsers = `
SELECT email
FROM users
WHERE email = ?`;

// 아이디 찾기
const selectByNameAndEmailUsers = `
SELECT id, name
FROM users
WHERE name = ? AND email = ?`;

// 비밀번호 찾기
const selectByIdAndEmailUsers = `
SELECT user_no
FROM users
WHERE id = ? AND email = ?`;

// 비밀번호 변경
const updatePwByUsernoUsers = `
UPDATE users 
SET password = ? 
WHERE user_no = ?`;

// 기관 관리자 불러오기
const selectByCnoUsersCenters = `select u.user_no, u.name as user_name, u.id, c.name as center_name, 
                                        u.phone, u.email, 
                                        u.created_date, u.status
                                 from users u
                                 join center c on u.c_no = c.c_no
                                 where u.status != 2 and u.type = 2`;

// 기관 관리자 페이지 - 기관 담당자 불러오기
const selectByUserNoUsersManager = `select u.user_no, u.id, u.name, u.phone, u.email,
                                           u.c_no, c.name as center_name,
                                           count(m.a_no) as applicant_count,
                                           u.created_date, u.status
                                    from users u
                                    left join manager m
                                        on u.user_no = m.user_no
                                        and m.unassign is null
                                    left join center c on u.c_no = c.c_no
                                    where u.type = 1 and u.status != 2
                                    group by u.user_no, u.id, u.name,
                                             u.phone, u.email, c.name,
                                             u.created_date, u.status
                                    order by u.created_date desc`;

// 회원상태(사용승인 및 비활성화)
const updateStatusUsers = `update users set status = ? where user_no in (?)`;

// 비밀번호 포함 수정
const updateUserWithPw = `
  update users
  set name = ?, phone = ?, email = ?, c_no = ?, password = ?
  where user_no = ?
`;

// 비밀번호 제외 수정
const updateUserWithoutPw = `
  update users
  set name = ?, phone = ?, email = ?, c_no = ?
  where user_no = ?
`;

// 회원탈퇴
const updateStatusByUsernoUsers = `
UPDATE users
SET status = 2
WHERE user_no = ?`;

// 일반회원 마이페이지 - 나의 정보 조회
const selectByUserNoUsers = `SELECT name, id, phone, email, concat (address, ' ', address_detail) address, created_date
                             FROM users
                             WHERE user_no = ?`;

// 마이페이지 - 지원자 목록 조회
const selectByUserNoApplicant = `SELECT name, a_no
                                 FROM applicant
                                 WHERE user_no = ?`;

// 마이페이지 - 지원자 상세 정보 조회
const selectByANoApplicant = `SELECT name, birth, gender, zipcode, address, address_detail, disability, created_date
                              FROM applicant
                              WHERE a_no= ?`;

// 마이페이지 - 지원자 상세 정보 수정
const updateByANoApplicant = `UPDATE applicant
                              SET name = ?, birth = ?, gender = ?, zipcode = ?, address = ?, address_detail = ?, disability = ?
                              WHERE a_no = ?`;

// 마이페이지 - 지원자 삭제
const deleteByANoApplicant = `DELETE FROM applicant 
                              WHERE a_no = ?`;

// 마이페이지 -지원자 등록
const insertApplicant = `INSERT INTO applicant (
                         user_no, name, birth, gender, zipcode, address, address_detail, disability
                         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

// 지원신청서 담당자 조회
const selectByUserNoManagerUsers = `select m.a_no,
                                           group_concat(u.name order by u.name separator ', ') as m_name
                                    from manager m
                                    join users u
                                      on m.user_no = u.user_no
                                    where m.unassign is null
                                    group by m.a_no`;

module.exports = {
  selectByIdAndPwUsers,
  insertUsers,
  selectByNameAndEmailUsers,
  selectByIdAndEmailUsers,
  updatePwByUsernoUsers,
  selectByCnoUsersCenters,
  selectByUserNoUsersManager,
  updateStatusByUsernoUsers,
  selectByIdUsers,
  selectByEmailUsers,
  updateStatusUsers,
  selectByUserNoUsers,
  updateUserWithPw,
  updateUserWithoutPw,
  selectByUserNoApplicant,
  selectByANoApplicant,
  updateByANoApplicant,
  deleteByANoApplicant,
  insertApplicant,
  selectByUserNoManagerUsers,
};
