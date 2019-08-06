var express = require('express');
var router = express.Router();



router.get('/goodsproduct', function(req, res, next) {
	res.render('goodsproduct.html', {title: 'Express'});
});

module.exports = router;
