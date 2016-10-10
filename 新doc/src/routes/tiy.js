var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    res.redirect('/tiy/web/frame/index.html');
});

module.exports = router;