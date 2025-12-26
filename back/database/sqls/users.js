// Table : users

// 로그인
const selectByIdAndPwUsers = `
SELECT u.user_no, u.name AS u_name, u.status, u.type, c.name AS c_name
FROM users u JOIN center c
WHERE u.id = ? AND u.password = ? AND u.c_no = c.c_no`;

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
const selectByUserNoUsersManager = `select u.id, u.name, u.phone, u.email,
                                       count(m.a_no) as applicant_count,
                                       u.created_date, u.status
                                from users u
                                left join manager m on u.user_no = m.user_no
                                                       and m.unassign is null
                                where u.type = 1
                                group by u.user_no, u.id, u.name, u.phone,
                                         u.email, u.created_date, u.status
                                order by u.created_date desc`;

// 기관 관리자 페이지 - 기관 담당자 정보 수정
const updateByUserNoUsers = `update users
                             set name = ?, phone = ?, email = ?, 
                                 password = ?
                             where user_no = ?`;

// 회원상태(사용승인 및 비활성화)
const updateStatusUsers = `update users set status = ? where user_no in (?)`;

// 회원탈퇴
const updateStatusByUsernoUsers = `
UPDATE users
SET status = 2
WHERE user_no = ?`;

// 일반회원 마이페이지 - 정보 조회

module.exports = {
  selectByIdAndPwUsers,
  insertUsers,
  selectByNameAndEmailUsers,
  selectByIdAndEmailUsers,
  updatePwByUsernoUsers,
  selectByCnoUsersCenters,
  selectByUserNoUsersManager,
  updateByUserNoUsers,
  updateStatusByUsernoUsers,
  selectByIdUsers,
  selectByEmailUsers,
  updateStatusUsers,
};
