/**
 * Created by Administrator on 2016/5/20.
 */
var express = require('express'),
    router = express.Router(),
    docx = require('./handlers/makedocx'),
    database = require('./handlers/database'),
    fs = require('fs'),
    url = require('url'),
    multiparty = require('multiparty'),
    docpath = "./public/api/tmp/import";
/* GET home page. */
router.get('/makedocx',function(req,res){
    var param =  url.parse(req.url,true);
    var DocIndex = param.query.DocIndex;
    var sendMsg = {};
    sendMsg.url     = req.url;
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.action = "getDoc";
    sendMsg.DocIndex = DocIndex;
    var jsonData = database.getwebdocNew(sendMsg);

    if (jsonData.retCode == 0)
    {
        var httpmsg = {
            Name :jsonData.message[0].Name,
            DocIndex:jsonData.message[0].DocIndex,
            AllItems:jsonData.message[0].AllItems,
            retcode:jsonData.retCode
        };
        docx.makedocx(httpmsg, res);
    }
    else{
        res.write(JSON.stringify(jsonData));
        res.statusCode = 200;
        res.end();
        return;
    }
});

router.get('/doc/gethisdocapi',function(req, res){
    var param =  url.parse(req.url,true);
    var DocIndex = param.query.DocIndex;
    var time = param.query.time;
    var sendMsg = {};
    sendMsg.url     = req.url;
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.action = "gethisdoc";
    sendMsg.DocIndex = DocIndex;
    sendMsg.time = time;
    mqhd.sendMsg("webdoc", JSON.stringify(sendMsg), function(jsonData) {
        console.warn('  render wloc_Map msg...');
        console.log(JSON.stringify(jsonData));
        delete jsonData.url;
        if (jsonData.retCode == 0)
        {
            var httpmsg = {
                Name :jsonData.data[0].Name,
                DocIndex:jsonData.data[0].DocIndex,
                AllItems:jsonData.data[0].AllItems,
                author:jsonData.data[0].author,
                time: jsonData.data[0].time,
                retcode:jsonData.retCode
            };
            res.write(JSON.stringify(httpmsg));
            res.statusCode = 200;
            res.end();
        }
        else{
            res.write(JSON.stringify(jsonData));
            res.statusCode = 200;
            res.end();
        }
    });
});

router.get('/getdoclist',function(req, res){
    var sendMsg = {};
    sendMsg.url     = req.url;
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.action = "getdoclist";
    database.getwebdoclistnew(res);

});

router.get('/getdocapi',function(req, res){
    var param =  url.parse(req.url,true);
    var DocIndex = param.query.DocIndex;
    var sendMsg = {};
    sendMsg.url     = req.url;
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.action = "getDoc";
    sendMsg.DocIndex = DocIndex;
    database.getwebdocNew(sendMsg, res);

});

router.get('/delete',function(req, res){
    if (typeof req.cookies.userName === "undefined"){
        var backmsg = {error : 1};
        res.write(JSON.stringify(backmsg));
        res.end();
        return;
    }
    var param =  url.parse(req.url,true);
    var DocIndex = param.query.DocIndex;
    var sendMsg = {};
    sendMsg.url     = req.url;
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.action = "delDoc";
    sendMsg.DocIndex = DocIndex;

    database.deldocweb(sendMsg,res);

});

router.post('/addapi',function(req, res){
    if (typeof req.cookies.userName === "undefined"){
        console.log("addapi");
        var backmsg = {error : 1};
        res.write(JSON.stringify(backmsg));
        res.end();
        return;
    }
    var sendMsg = {};
    sendMsg.url     = req.url;
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.action = "addDoc";
    sendMsg.body = req.body;
    database.addwebdocnew(sendMsg,res);
});

/* 格式化JSON源码(对象转换为JSON文本) */
function formatJson(txt, compress /*是否为压缩模式*/ ) {
    var indentChar = '    ';
    if (/^\s*$/.test(txt)) {
        console.error('data is null! ');
        return;
    }
    try {
        var data = eval('(' + txt + ')');
    } catch (e) {
        console.error('info error: ' + e , 'err');
        return;
    };
    var draw = [],
        last = false,
        This = this,
        line = compress ? '' : '\n',
        nodeCount = 0,
        maxDepth = 0;

    var notify = function(name, value, isLast, indent /*缩进*/ , formObj) {
        nodeCount++; /*节点计数*/
        for (var i = 0, tab = ''; i < indent; i++) tab += indentChar; /* 缩进HTML */
        tab = compress ? '' : tab; /*压缩模式忽略缩进*/
        maxDepth = ++indent; /*缩进递增并记录*/
        if (value && value.constructor == Array) { /*处理数组*/
            draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line); /*缩进'[' 然后换行*/
            for (var i = 0; i < value.length; i++)
                notify(i, value[i], i == value.length - 1, indent, false);
            draw.push(tab + ']' + (isLast ? line : (',' + line))); /*缩进']'换行,若非尾元素则添加逗号*/
        } else if (value && typeof value == 'object') { /*处理对象*/
            draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line); /*缩进'{' 然后换行*/
            var len = 0,
                i = 0;
            for (var key in value) len++;
            for (var key in value) notify(key, value[key], ++i == len, indent, true);
            draw.push(tab + '}' + (isLast ? line : (',' + line))); /*缩进'}'换行,若非尾元素则添加逗号*/
        } else {
            if (typeof value == 'string') value = '"' + value + '"';
            draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line);
        };
    };
    var isLast = true,
        indent = 0;
    notify('', data, isLast, indent, false);
    return draw.join('').replace(/(\/\/.*)\"\,/g, '",<code>$1</code>').replace(/(\/\/.*)\"/g, '"<code>$1</code>');
}

function switchMsg(oJsonTem, sdocindex){
    var msg = {};
    msg.DocIndex = sdocindex;
    msg.Name = oJsonTem.name;
    msg.description = oJsonTem.desc;
    msg.author = oJsonTem.author;
    msg.AllItems = [];
    for (var i = 0; i < oJsonTem.aggregate.length; i ++){
        var aggregateName = oJsonTem.aggregate[i].name;
        var aggregatedesc = oJsonTem.aggregate[i].desc;
        for (var j= 0; j < oJsonTem.aggregate[i].items.length; j ++){
            var oTem = {};
            oTem.ItemName = aggregateName;
            oTem.Itemdesc = aggregatedesc;
            oTem.SubItem = oJsonTem.aggregate[i].items[j].name;
            oTem.subitemdesc = oJsonTem.aggregate[i].items[j].desc;
            oTem.Method = oJsonTem.aggregate[i].items[j].method;
            oTem.author = oJsonTem.aggregate[i].items[j].author;
            var jsontem = formatJson(JSON.stringify(oJsonTem.aggregate[i].items[j].return));
            oTem.Return = jsontem;

            for (var h =0; h < oJsonTem.aggregate[i].items[j].params.length; h++){
                console.log(oJsonTem.aggregate[i].items[j].params[h].description );
                oJsonTem.aggregate[i].items[j].params[h].description = formatJson(JSON.stringify(oJsonTem.aggregate[i].items[j].params[h].description));
            }
            oTem.Parameters = oJsonTem.aggregate[i].items[j].params;
            oTem.Error = oJsonTem.aggregate[i].items[j].errors;
            oTem.Path = oJsonTem.aggregate[i].items[j].path;
            msg.AllItems.push(oTem);
        }

    }

    return msg;

}

router.post('/load', function(req, res){
    if (typeof req.cookies.userName === "undefined"){
        var backmsg = {error : 1};
        res.write(JSON.stringify(backmsg));
        res.end();
        return;
    }
    var form = new multiparty.Form({uploadDir: docpath});
    form.parse(req, function(err, fields, files) {
        console.log(fields);
        if(err){
            var message = "doc/load From is error, error is  " + err;
            console.warn('parse error: ' + err);
            res.write(JSON.stringify(message));
            res.statusCode = 200;
            res.end();
            return;
        }
        else{
            if (typeof fields.docindex === "undefined")
            {
                res.write(JSON.stringify(message));
                res.statusCode = 200;
                res.end();
                return;
            }
            else{
                var docindex = fields.docindex[0];
                var inputFile = files.file[0];//.upload[0];
                var loadpath = inputFile.path;
                fs.readFile(loadpath,function(err, data){
                    var sJsonstr = data.toString();
                    var body = {};
                    try{
                        /*如果*/
                        var strdate = data.toString();
                        if (strdate[0] !== '{'){
                            var strdate = strdate.substring(1);
                            console.log(strdate);
                            console.log("55555");
                        }
                        var oJsonTem = JSON.parse(strdate);
                        body = switchMsg(oJsonTem, docindex);
                    }catch(err){
                        res.write("load file is illegal");
                        res.statusCode = 200;
                        res.end();
                        console.error("load  load file is illegal" + err);
                        return;
                    }

                    var sendMsg = {};
                    sendMsg.url     = req.url;
                    sendMsg.method  = req.method;
                    sendMsg.headers = req.headers;
                    sendMsg.cookies = req.cookies;
                    sendMsg.session = req.session;
                    sendMsg.action = "addDoc";
                    sendMsg.body = body;
                    database.addwebdocnew(sendMsg,res);
                });
            }
        }

    });

});

module.exports = router;