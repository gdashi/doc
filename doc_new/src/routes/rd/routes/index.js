/**
 * Created by Administrator on 2016/1/15.
 */
var express    = require('express');
var path       = require('path');
var uuid       = require('uuid');
var bodyParser = require('body-parser');

var ssoUrl = require('./renderRegist');
//var web = require('./web');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, '../../public')));

//连接跳转到sso登录认证页面认证成功跳转的页面（进行认证处理）
router.use('/home', function(req, res, next) {
    //sso第一次 登录成功，之后将通过cookie校验
    if(req.query.ResponseTicket){
        var result ={};
        try{
            result =ssoUrl.Deserialize(req.query.ResponseTicket);
            result.res = true;
        }catch(err){
            console.log("0");
            console.warn('web:ResponseTicket===' + err);
            result.res = false;
        }
        var SSOAuth_Cookie = uuid.v1().split("-").join("");
        res.cookie('SSOAuth_Cookie', SSOAuth_Cookie, {path: '/api'});
        //解析userInfo
        if(result.res&&result.userInfo){
            console.log("1");
            console.log(result.userInfo);
            res.cookie('userName', result.userInfo, {path: '/api'});
            res.redirect('/api/index.html');
        }else{
            console.log("2");
            res.redirect('/rd/logout');
        }
      /*  var SSOAuth_Cookie = uuid.v1().split("-").join("");
        res.cookie('SSOAuth_Cookie', SSOAuth_Cookie, {path: '/rd'});
        res.redirect('/rd/web/frame/index.html');*/
    }else if(req.cookies&&req.cookies.SSOAuth_Cookie){
        res.cookie('userName', req.cookies.userInfo, {path: '/api'});
        res.cookie('SSOAuth_Cookie', req.cookies.SSOAuth_Cookie, {path: '/api'});
        res.redirect('/api/index.html');
        res.redirect('/rd/web/frame/index.html');
    }else{
        console.log("4");
        res.redirect('/rd');
    }
});

//连接跳转到sso登录认证页面认证成功跳转的页面（进行认证处理）
router.use('/logout', function(req, res, next) {
    res.clearCookie('SSOAuth_Cookie', {path: '/api'});
    res.clearCookie('userName', {path: '/api'});
    var logutRedict="http://sso.h3c.com/Logoutsso.aspx?RequestUrl=https://"+req.headers.host+"/api";
    res.redirect("/api/index.html");

});

//连接跳转到sso登录认证页面
router.use('/',function(req, res, next){
    console.log("/rd yuanyuekun");
    console.log(req.cookies);
    console.log(req.cookies.SSOAuth_Cookie);
    console.log(req.cookies && req.cookies.SSOAuth_Cookie);
    if (req.cookies && req.cookies.SSOAuth_Cookie){
        console.log("sba");
    }
    else{
        console.log("sbg");
    }
    if(req.cookies && req.cookies.SSOAuth_Cookie){
        if (req.cookies === "" && req.cookies.SSOAuth_Cookie === ""){
            var ssoAuthUrl = ssoUrl.Serialize(req.headers.host);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.redirect(ssoAuthUrl);
            return;
        }
        if (req.cookies.userName) {
            console.log("yuanyuekun1");
            console.log(req.cookies);
            res.cookie('userName', req.cookies.userName, {path: '/api'});
            res.redirect('/api/index.html');
        }else {
            res.redirect('/rd/norights.html');
        }
    }else{
        console.log(req.cookies);
        console.log(req.cookies.SSOAuth_Cookie);
        var ssoAuthUrl = ssoUrl.Serialize(req.headers.host);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.redirect(ssoAuthUrl);
       /* var SSOAuth_Cookie = uuid.v1().split("-").join("");
        res.cookie('SSOAuth_Cookie', SSOAuth_Cookie, {path: '/rd'});
         res.redirect('/rd/home');*/
    }
});

function isLegalUser(user) {
    var userArray = ['g10815','fkf5862', 'l10018', 'pkf5911', 'x07476', 'z04434', 'w11273', 'y09014', 'f02720', 'w02212', 'j03349', 'ckf6103', 'jkf6102', 'skf6435', 'w08156', 'lkf5951', 'lkf6050', 'y04460', 'y08675', 'z00835', 'w04855', 'j09980', 'h03819', 'ykf5851', 'rkf5783', 'zkf6537', 'pkf5580', 'lkf6417', 'hkf6425', 'zkf4789', 'l09810', 'x04730', 'q04356', 'y10159', 'z07742', 'z09093'];

    for (var i = 0; i < userArray.length; i++) {
        if (user == userArray[i]) {
            return true;
        }
    }

    return false;
}

module.exports = router;