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

router.get('/noticelist', function(req, res, next) {
	res.render('noticelist.html', {title: 'Express'});
});

router.get('/bringnoticelist', function(req, res, next) {
     console.log('here');
	 conn.query("SELECT * FROM notice",[],function(err,result){
            if(err){          	
                console.log('query error');
                throw err;
            }else{
              console.log('alskdjfladfjlasdkf');
            	res.json(result);
                
            }
      });

});


module.exports = router;
