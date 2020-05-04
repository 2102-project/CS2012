var express = require('express');
var router = express.Router();

const {Pool} = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'select * from riderlogin natural join Riders';

router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
    }
    console.log("myquery " + sql_query);
    pool.query(sql_query, (err, data) => {
        res.render('allRiders', {riderdata: data.rows})
    });
});

module.exports = router;
