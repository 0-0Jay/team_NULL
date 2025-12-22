// Table : users

// 로그인
const selectByIdAndPw = `
SELECT user_no, status 
FROM users 
WHERE id = ? AND password = ?`;

// 회원가입
const insertUser = `
INSERT INTO users(id, password, name, email, phone, address, address_detail, zipcode, type, c_no)
VALUES(?, ?, ? ,?, ?, ?, ? ,?, ?, ?)`;

// 아이디 찾기
const selectByNameAndEmail = `
SELECT id
FROM users
WHERE name = ? AND email = ?`;

module.exports = {
  selectByIdAndPw,
  insertUser,
  selectByNameAndEmail,
};
