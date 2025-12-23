// Table : users

// 로그인
const selectByIdAndPwUsers = `
SELECT user_no, status 
FROM users 
WHERE id = ? AND password = ?`;

// 회원가입
const insertUsers = `
INSERT INTO users(id, password, name, email, phone, address, address_detail, zipcode, type, c_no)
VALUES(?, ?, ? ,?, ?, ?, ? ,?, ?, ?)`;

// 아이디 찾기
const selectByNameAndEmailUsers = `
SELECT id
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

// 회원탈퇴
const updateStatusByUsernoUsers = `
UPDATE users
SET status = 2
WHERE user_no = ?`;

module.exports = {
  selectByIdAndPwUsers,
  insertUsers,
  selectByNameAndEmailUsers,
  selectByIdAndEmailUsers,
  updatePwByUsernoUsers,
  updateStatusByUsernoUsers,
};
