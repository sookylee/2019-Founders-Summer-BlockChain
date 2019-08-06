var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var mysqlStore = require('express-mysql-session')(session);

var dbOptions = {
   host: 'localhost',
   user: 'root',
   password: 'alsthd97!',
   database: 'project'
};
var conn = mysql.createConnection(dbOptions);
conn.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
   console.log("test");
  res.render('index.html', { title: 'Express' });

});


router.post('/', async function(req,res,next){
   var id = req.body.id;
   var password = req.body.password;

   var sql = 'SELECT * FROM user WHERE u_id=?';
   console.log('id', id);
   console.log('password',password);
   conn.query(sql, [id], function(err,results){
    console.log('1 : ',results[0].u_password);
    console.log('2: ',password);
      console.log(results);
      if(err){
         console.log(err);
         return res.send('login fail');
      }
      if(!results[0]) return res.send('please check your id');
    else if(results[0].u_password != password) return res.send('please check your pw.');
    else{
      //req.session.name = id;
      console.log('success!');
      res.json(1);
    }
         console.log('success');
      
   });
});

module.exports = router;