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
// var sql_query = 'with totalworkinghours as (with fulltimers as (with fulltime as (select riderid, 40 hours from fulltimeriders) select riderid, case when hours is null then 0 else hours end from riders left join fulltime using (riderid)), parttimers as (select riderid, case when sum(totalhours) is null then 0 else sum(totalhours) end totalhours from riders left join ((holds natural join sessions) natural join wws) using (riderid) group by riderid order by riderid) select riderid, hours + totalhours totalhours from fulltimers natural join parttimers), totalsalary as (with riderbasesalary as (SELECT distinct riderid, CASE WHEN wwsid IS NOT NULL then weeklybasesalary ELSE monthlybasesalary END AS salary FROM (riders LEFT JOIN fulltimeriders using (riderid) LEFT JOIN parttimeriders USING (riderid) left join wws using (riderid)) ), ridernumdeliveries as (select riderid, count(*) numofdeliveries from delivers group by riderid) select riderid, case when numofdeliveries is null then salary else (salary + (numofdeliveries * 5)) end totalsalary, salary, case when numofdeliveries is null then 0 else numofdeliveries end from riderbasesalary left join ridernumdeliveries using(riderid) order by riderid) select *, case when riderid in (select riderid from parttimeriders) then \'part timer\' when riderid in (select riderid from fulltimeriders) then \'full timer\' else \'error\' end as status, ridername from(totalworkinghours natural join totalsalary) natural join riders where riderid = '
var sql_query = 'with x as(select r.rname, r.promoid, f.fname, r.minimalcost from restaurants r natural join Foods f) select * from (x natural join foods f) natural join promotions where rname = \''
var sql2_query = 'with x as(select r.rname, r.promoid, f.fname, f.dailylimit, r.minimalcost from restaurants r natural join Foods f) select distinct promoid, startdate, enddate, minimalcost from (x natural join foods f) natural join promotions where rname = \''
router.get('/', function (req, res, next) {
  sess = req.session;
  console.log("sess.rname " + sess.rname);
  var sql_query2 = sql_query + sess.rname + '\'' + 'order by fname';
  var sql2_query2 = sql_query + sess.rname + '\'';
  console.log("myquery: " + sql_query2);
  console.log("sess.username: " + sess.username);
  
  // console.log("minicost: " + sess.minimalcost);
  pool.query(sql_query2, (err, data) => {
    pool.query(sql2_query2, (err, data2) => {

    var format1 = data.startdate;
    console.log("format1: " + format1);
		res.render('restaurantProfile', {restaurantdata: data.rows, restaurantdata: data.rows});
	  });
  });
});



module.exports = router;
 