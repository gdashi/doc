/**
 * Created by Administrator on 2016/5/27.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

router.get('/', function(req, res, next) {
    res.redirect('/test/index.html');
});

module.exports = router;
