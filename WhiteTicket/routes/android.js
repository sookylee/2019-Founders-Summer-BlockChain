var express = require('express');
var router = express.Router();

router.post('/android', function(req, res, next) {

   console.log("안드로이드 들어옴");
   var id = req.body.id;
   var pw = req.body.pw;
   var phone = "01053226962";
   console.log(req.body.id);
   console.log(req.body.pw);
   var data = {"id":id,"pw":pw, "phone": phone};
   res.json(data);
});

router.get('/android', function(req, res, next) {

   console.log("안드로이드 들어옴");
   var id = req.body.id;
   var pw = req.body.pw;
   console.log(req.body.id);
   console.log(req.body.pw);
   var data = {"id":id,"pw":pw};
   res.json(data);
});

module.exports = router;