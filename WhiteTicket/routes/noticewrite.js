var express = require('express');
var router = express.Router();

router.get('/noticewrite', function(req, res, next) {
	res.render('noticewrite.html', {title: 'Express'});
});

module.exports = router;
