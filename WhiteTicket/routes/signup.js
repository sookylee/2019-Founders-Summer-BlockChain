var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var mysqlStore = require('express-mysql-session')(session);
var router = express.Router();

var dbOptions = {
   host: 'localhost',
   user: 'root',
   password: 'alsthd97!',
   database: 'project'
};
var conn = mysql.createConnection(dbOptions);
conn.connect();

router.get('/signup', function(req, res, next) {
   res.render('signup.html', {title: 'Express'});
});

router.post('/signup', async function(req,res,next){
   var id = req.body.id;
   var password = req.body.password;
   var address = req.body.address;

   var sql = 'INSERT INTO user (u_id,u_password,u_address) VALUES ("' + id + '","' + password + '","' + address + '")';
   console.log(sql);
   console.log('id', id);
   console.log('password',password);
   conn.query(sql, function(err,rows){
      console.log(rows);
      if(err){
         console.log(err);
         res.json(0);
      }
      else{
         res.json(1);
         console.log('success');
      }
   });
});

module.exports = router;