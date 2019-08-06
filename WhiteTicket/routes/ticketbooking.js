var express = require('express');
var soketio = require('socket.io');
var router = express.Router();

router.get('/ticketbooking', function(req, res, next) {
   res.render('ticketbooking.html', {title: 'Express'});
});

router.post('/ticketbooking', async function(req,res,next){
   //var arr = req.body.allSeatsVals;
   ;
});

module.exports = router;