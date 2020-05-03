// var express = require('express');
// var router = express.Router();

// const { Pool } = require('pg')
// /* --- V7: Using Dot Env ---
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: '********',
//   port: 5432,
// })
// */
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
// });

// /* SQL Query */
// // var sql_query = 'select did, deliveryfee, customerplaceorder, ridergotorest, rideratrest, riderleftrest, riderdeliverorder, rating from delivers d where d.riderid = ';
// router.get('/', function (req, res, next) {
//   sess = req.session;
//   console.log("sess.staffname is = " + sess.staffname);
//   console.log("sess.rname is = " + sess.rname);
//   // var sql_query2 = sql_query + sess.user;
//   // console.log("myquery2 " + sql_query2);
//   pool.query(sql_query2, (err, data) => {
// 		// res.render('riderPastDeliveries', {deliverydata: data.rows });
// 	});
// });

// module.exports = router;


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


// project=# insert into foods (fname, rname, dailylimit, isavailable, category, price) values ('AAAAAAAA', 'Bank of America Corporation', 14, true, 'category_3', 57.11); 
/* SQL Query */
var sql_query = `CREATE or REPLACE procedure addFood (fnamething text, rname text, dailylimitthing Integer, isavailablething boolean, categorything text, pricething decimal)
AS $$

declare
    maxInt int;
    foodnamecheck text;
begin

SELECT fname into foodnamecheck
FROM foods
WHERE fname = fnamething;

if foodnamecheck IS NOT NULL then
    raise exception 'This food is already in menu, pls add another food';
end if;

insert into foods (fname, rname, dailylimit, isavailable, category, price) values (fnamething, rname, dailylimitthing, isavailablething, categorything, pricething);

end
$$ language plpgsql;

call addFood(`;

// GET
router.get('/', function (req, res, next) {
	sess = req.session;
	if (sess.error && sess.error != null && sess.errortype == 'usernamewrong') {
		console.log("HEREERERERE");
		res.render('addFood', { title: 'Add new food', error: sess.error});
		sess.error = null;
	}
	else {
		res.render('addFood', { title: 'Add new food', error: null });
	}
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	var fname = req.body.fname;
	var dailylimit = req.body.dailylimit;
  var isavailable = req.body.isavailable;
  var category = req.body.category;
  var price = req.body.price;
  var rname = sess.rname;

  // Construct Specific SQL Query
  // fname, rname, dailylimit, isavailable, category, price
  // var insert_query = sql_query + '\'' + ccNo + '\', \'' + username + '\', \'' + password + '\')';
  console.log("restaurantName: " + rname);
	var insert_query = sql_query + '\'' + fname + '\', \'' + rname + '\', ' + dailylimit + ', ' + isavailable + ', \'' + category + '\', ' + price + ')';
	console.log(insert_query);


	pool.query(insert_query, (err, data) => {
		if (err) {
			console.log(err.stack);
			//alert(err.stack);
			sess = req.session;
			var errormessage = err.stack;
			sess.error = errormessage;
			sess.errortype = 'foodnamewrong';
			res.redirect('/addFood');
		}
		else {
      res.redirect('/restaurantProfile');
			// sess = req.session;
			// sess.rname = 1;
			// sess.staffname = 1;
      // sess.error = null;
      // console.log("------------------------------------------------------------------------------");

			// var sql_query = 'SELECT Cid FROM customerLogin WHERE Username = \'';
			// insert_query = sql_query + username + '\'';
      // var data23;
      
			// pool.query(insert_query, (err, data2) => {
			// 	var data3 = data2.rows;
			// 	data23 = data3[0].cid;
			// 	req.session.user = data23;
      //   console.log(req.session.user);
      //   console.log("created new food");
			// 	res.redirect('/');
			// });
			
		}

	});
});

module.exports = router;
