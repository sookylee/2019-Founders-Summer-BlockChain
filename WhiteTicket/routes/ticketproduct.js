var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var dbOptions = {
    host: 'localhost',
    user: 'root',
    password: 'alsthd97!',
    database: 'project'
  };
  var conn = mysql.createConnection(dbOptions);
  conn.connect();

router.post('/login', function(req, res, next) {
	console.log("로그인 신청");


	var id = req.body.id;
	var password = req.body.password;
	 
	
     conn.query("SELECT * FROM project.user WHERE u_id=? and u_password=? ",[id,password],function(err,result){
            if(err){
            	
                throw err;
            }else{
                
            	
                var userData = result;
                /*
                if(userData[0].userpassword == password){
                    res.json(userData[0].accessToken);
                }
                */
                var loginResult = userData.length;
                res.json(loginResult);
            }
      });
 
	//res.render('ticketproduct.html');
});

router.get('/ticketproduct', function(req, res, next) {
	res.render('ticketproduct.html', {title: 'Express'});
});

router.get('/bringconsertlist', function(req, res, next) {
  console.log("콘서트 리스트 가져오기");
     conn.query("SELECT * FROM project.concert",[],function(err,result){
            if(err){
              
                throw err;
            }else{
               console.log("콘서트 리스트 성공");
              res.json(result);
                
            }
    });
  
});

module.exports = router;
