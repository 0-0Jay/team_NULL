// Table : users

// 로그인
const selectByIdAndPwUsers = `
SELECT u.user_no, u.name AS u_name, u.status, u.type, c.name AS c_name, u.c_no
FROM users u LEFT OUTER JOIN center c
ON u.c_no = c.c_no
WHERE u.id = ? AND u.password = ? AND status != 2`;

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

// 시스템 관리자
const selectByUserNoAllUsersManager = `select u.user_no, u.id, u.name, u.phone, u.email, u.c_no,
                                              c.name as center_name, u.created_date,
                                              u.status, count(m.application_no) as applicant_count
                                       from users u 
                                       left join center c on u.c_no = c.c_no
                                       left join manager m on u.user_no = m.user_no
                                                              and m.unassign is null
                                       where u.type = 1 and u.status != 2
                                       group by u.user_no, u.id, u.name, u.phone, u.email, u.c_no,
                                                c.name, u.created_date, u.status
                                       order by u.created_date desc`;

// 기관 관리자
const selectByUserNoUsersManager = `select u.user_no, u.id, u.name, u.phone, u.email,
                                           u.created_date, u.status,
                                           count(distinct ap.a_no) as applicant_count
                                    from users u
                                    left join manager m on u.user_no = m.user_no
                                                           and m.unassign is null
                                    left join application app on m.application_no = app.application_no
                                    left join applicant ap on app.a_no = ap.a_no
                                    where u.type = 1 and u.status != 2 and u.c_no = ?
                                    group by u.user_no, u.id, u.name, u.phone, u.email,
                                             u.created_date, u.status
                                    order by u.created_date desc`;

// 회원상태(사용승인)
const updateStatusApprove = `update users set status = 1 where user_no in (?)`;

// 회원상태(비활성화)
const updateStatusDeactivate = `update users u
                                set u.status = 2
                                where u.user_no in (?) 
                                      and not exists (select 1
                                                      from manager m
                                                      join application app
                                                        on m.application_no = app.application_no
                                                      join applicant ap
                                                        on app.a_no = ap.a_no
                                                      where m.user_no = u.user_no
                                                        and m.unassign is null)`;

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

// 회원 타입 조회
const selectTypeByuserNoUsers = `SELECT type FROM users WHERE user_no = ?`;

// 일반회원 마이페이지 - 나의 정보 조회
const selectByUserNoUsers = `SELECT name, id, password, phone, email, zipcode, address, address_detail, created_date, type
                             FROM users
                             WHERE user_no = ?`;

// 마이페이지 - 나의 정보 수정
const updateByUserNoGeneralUsers = `UPDATE users
                            SET name = ?, phone = ?, email = ?, zipcode = ?, address = ?, address_detail = ?
                            WHERE user_no = ?`;

// 일반회원 마이페이지 - 지원자 목록 조회
const selectByUserNoApplicant = `SELECT name, a_no
                                 FROM applicant
                                 WHERE user_no = ?`;

// 기관담당자 마이페이지 - 나의 정보 조회
const selectByUserNoStaffUsers = `SELECT u.type, u.name, u.id, u.password, u.phone, u.email, u.created_date, 
                                         c.name as center_name, concat_ws(' ', c.address, c.address_detail) as center_address, c.phone as center_phone
                                  FROM users u 
                                  JOIN center c
                                  ON u.c_no = c.c_no
                                  WHERE u.user_no = ?`;

// 기관담당자 마이페이지 - 기관 소속 지원자 목록 조회
const selectByCNoApplicant = `SELECT a_no, a.name
                              FROM applicant a
                              JOIN users g ON a.user_no = g.user_no
                              JOIN users m ON m.user_no = ?
                              WHERE g.c_no = m.c_no`;

// 기관담당자 마이페이지 - 담당 지원자 목록 조회
const selectApplicantByStaff = `SELECT a_no, name, 
                                       CASE WHEN SUM(type = 'direct') > 0 
                                       THEN 'direct'	
                                       ELSE 'assigned' 
                                       END AS type
                                 FROM (
                                   SELECT a.a_no, a.name, 'direct' AS type
                                   FROM applicant a
                                   JOIN users u
                                   ON a.user_no = u.user_no
                                   WHERE u.user_no = ?

                                   UNION ALL

                                   SELECT a.a_no, a.name, 'assigned' AS type
                                   FROM applicant a
                                   JOIN application app ON a.a_no = app.a_no
                                   JOIN manager m ON app.application_no = m.application_no
                                   JOIN users u ON m.user_no = u.user_no
                                   WHERE u.user_no = ?
                                 ) t
                                 GROUP BY a_no, name`;

// 마이페이지 - 지원자 상세 정보 조회
const selectByANoApplicant = `SELECT a.name, a.birth, a.gender, a.zipcode, a.address, a.address_detail, a.disability, a.created_date, 
                                     u.name as nok_name, u.phone as nok_phone, u.email as nok_email
                              FROM applicant a
                              JOIN users u ON a.user_no = u.user_no
                              WHERE a_no = ?`;

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

// 기관관리자 마이페이지 - 기관정보 조회 + 소속 담당자 수(COUNT)
const selectCenterByManager = `SELECT c.name, c.zipcode, c.address, c.address_detail, c.phone, 
                                      COUNT(*) AS staff_count
                               FROM center c
                               JOIN users u ON u.c_no = c.c_no
                               LEFT JOIN users s
                                 ON s.c_no = c.c_no
                                 AND s.type = 1
                               WHERE u.user_no = ?
                               GROUP BY c.c_no`;

// 기관관리자 마이페이지 - 기관 소속 담당자 정보
const selectStaffByManager = `SELECT name, phone
                              FROM users
                              WHERE c_no = (
                                  SELECT c_no FROM users
                                  WHERE user_no = ?
                              )
                              AND type = 1
                              ORDER BY name`;

// 기관관리자 마이페이지 - 기관 정보 수정
const updateCenterByManager = `UPDATE center
                               SET name = ?, phone = ?, zipcode = ?, address = ?, address_detail = ?
                               WHERE c_no = (
                                 SELECT c_no FROM users
                                 WHERE user_no = ?
                               )`;

// 지원신청내역 담당자 조회
const selectByUserNoManagerUsers = `select m.application_no,
                                           group_concat(u.name order by u.name separator ', ') as m_name,
                                           m.user_no
                                    from manager m
                                    join users u
                                      on m.user_no = u.user_no
                                    where m.unassign is null
                                    group by m.application_no`;

// 시스템관리자 - 기관 담당자 등록
const insertStaffByAdmin = `INSERT INTO users (id, password, name, email, phone, type, c_no, zipcode, address, address_detail, status)
                            SELECT ?, ?, ?, ?, ?, 1, c.c_no, c.zipcode, c.address, c.address_detail, 1
                            FROM center c
                            WHERE c.c_no = ?`;

module.exports = {
  selectByIdAndPwUsers,
  insertUsers,
  selectByNameAndEmailUsers,
  selectByIdAndEmailUsers,
  updatePwByUsernoUsers,
  selectByCnoUsersCenters,
  selectByUserNoAllUsersManager,
  selectByUserNoUsersManager,
  updateStatusByUsernoUsers,
  selectByIdUsers,
  selectByEmailUsers,
  updateStatusApprove,
  updateStatusDeactivate,
  selectTypeByuserNoUsers,
  selectByUserNoUsers,
  selectByCNoApplicant,
  updateByUserNoGeneralUsers,
  selectByUserNoStaffUsers,
  updateUserWithPw,
  updateUserWithoutPw,
  selectByUserNoApplicant,
  selectByANoApplicant,
  updateByANoApplicant,
  deleteByANoApplicant,
  insertApplicant,
  selectCenterByManager,
  selectStaffByManager,
  updateCenterByManager,
  selectByUserNoManagerUsers,
  selectApplicantByStaff,
  insertStaffByAdmin
};
