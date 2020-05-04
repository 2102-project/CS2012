var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
/* --- V7: Using Dot Env ---
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '********',
  port: 5432,
})
*/
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'select * from customers';

router.get('/', function (req, res, next) {
  sess = req.session;
  var sql_query2 = sql_query + sess.user;
  console.log("myquery " + sql_query2);
  res.render('customerProfile', { });
});

module.exports = router;
