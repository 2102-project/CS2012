var express = require('express');
var router = express.Router();

const {Pool} = require('pg')

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// });
//
// /* SQL Query */
// var sql_query = 'select * from managerlogin where username = \'';

router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
    }
    // var sql_query2 = sql_query + sess.username + '\'';
    // console.log("myquery " + sql_query2);
    // pool.query(sql_query2, (err, data) => {
    res.render('deliveryStatistics', {})
    // });
});

module.exports = router;
