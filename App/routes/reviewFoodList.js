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
var sql_query = 'delete from reviews where flid = ';
var sql_query2 = 'insert into reviews values (\'';
// GET
router.get('/', function (req, res, next) {
        res.render('reviewFoodList');
});

// POST
router.post('/', function (req, res, next) {

        console.log(req.body.entering + " is req body entering value");

        if (req.body.entering == "true") {
                var reviewFlid = req.body.reviewFlid;
                console.log("I am here");
                res.render('reviewFoodList', { reviewFlid: reviewFlid})

        } else {
                // Retrieve Information
                sess = req.session;
                var flid = req.body.reviewFlid;
                console.log("flid  is" + flid);
                var feedback = req.body.feedback;
                // Construct Specific SQL Query
                var delete_query = sql_query + flid;
                console.log("deletequery = " + delete_query);
                var insert_query = sql_query2 + feedback + '\',' + flid + ')';
                console.log("insertquery = " + insert_query);
                if (feedback == null || feedback == 'undefined' || flid == 'undefined' || flid == null) {
                        res.render('reviewFoodList', { reviewFlid: reviewFlid});
                } else {
                        pool.query(delete_query, (err, data) => {
                                pool.query(insert_query, (err, data2) => {
                                        if (err) {
                                                console.log(err.stack);
                                                sess = req.session;
                                                var errormessage = err.stack;
                                                sess.error = errormessage;
                                                res.redirect('/customerProfile');
                                        }
                                        else {
                                                sess = req.session;
                                                sess.error = null;
                                                res.redirect('/customerProfile');
                                        }
                                });
                        });
                }

        }
});

module.exports = router;
