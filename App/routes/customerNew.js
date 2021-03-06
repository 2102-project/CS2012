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
var sql_query = `CREATE or REPLACE procedure addCustomer (ccnumber text, usernamething text, passwordthing text)
AS $$

declare
    maxInt int;
    usernamecheck text;
begin

SELECT username into usernamecheck
FROM customerLogin
WHERE username = usernamething;

if usernamecheck IS NOT NULL then
    raise exception 'This username is taken. Choose another username!';
end if;

select coalesce(max(cid), 0) into maxInt from Customer;
insert into customer (Cid, Reward_pts, CC_no) values (maxInt+1, 0, ccnumber);
insert into customerlogin (username, password, Cid) values (usernamething,passwordthing,maxInt+1);

end
$$ language plpgsql;

call addCustomer(`;

// GET
router.get('/', function (req, res, next) {
	sess = req.session;
	var errormessagething = sess.error;
	var errortypecheck = sess.errortype
	if (errormessagething && errormessagething != null && errortypecheck == 'usernamewrong') {
		console.log("HEREERERERE");
		sess.error = null;
		sess.errortype = null;
		res.render('customerNew', { title: 'Add new user', error: errormessagething});
	}
	else {
		res.render('customerNew', { title: 'Add new user', error: null });
	}
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	var ccNo = req.body.ccNo;
	var username = req.body.username;
	var password = req.body.password;

	// Construct Specific SQL Query
	var insert_query = sql_query + '\'' + ccNo + '\', \'' + username + '\', \'' + password + '\')';
	console.log(insert_query);


	pool.query(insert_query, (err, data) => {
		if (err) {
			console.log(err.stack);
			//alert(err.stack);
			sess = req.session;
			var errormessage = err.stack;
			sess.error = errormessage;
			sess.errortype = 'usernamewrong';
			res.redirect('/customerNew');
		}
		else {
			sess = req.session;
			sess.login = 1;
			sess.customer = 1;
			sess.error = null;
			var sql_query = 'SELECT Cid FROM customerLogin WHERE Username = \'';
			insert_query = sql_query + username + '\'';
			var data23;
			pool.query(insert_query, (err, data2) => {
				res.redirect('/customer');
			});
			
		}

	});
});

module.exports = router;
