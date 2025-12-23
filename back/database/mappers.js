const mysql = require("mysql2/promise");
const usersSql = require("./sqls/users.js");
const centerSql = require("./sqls/centers.js");
const questionsSql = require("./sqls/questions.js");
require("dotenv").config();
// const ???Sql = require("./sqls/???.js");
// 테이블 별로 쿼리문 페이지 따로 생성

const pool = mysql.createPool({
  connectionLimit: 5,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const query = async (selected, values, type) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let executeSql = "";
    // type으로 사용할 메인 테이블 구분해서 쿼리문 접근
    if (type == "users") {
      executeSql = usersSql[selected];
    } else if (type == "center") {
      executeSql = centerSql[selected];
    } else if (type == "questions") {
      executeSql = questionsSql[selected];
    }
    // else if(type == ??) {
    //   executeSql = ???Sql[selected];
    // }
    console.info(selected, executeSql);
    let result = (await conn.query(executeSql, values))[0];
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  query,
};
