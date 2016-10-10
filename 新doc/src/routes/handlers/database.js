/**
 * Created by Administrator on 2015/12/22.
 */

var config = require('wlanpub').config,
    dbhd  = require('wlanpub').dbhd,
    //mongoConnParas = 'mongodb://127.0.0.1:27017/webdoc_db';
    mongoConnParas = config.get('mongoConnParas');

dbhd.connectMongoose(mongoConnParas);

var db = dbhd.mongo,
    Schema = dbhd.Schema;

var schema_webdoc = new Schema({   //???
    Name:String,
    DocIndex: String,
    AllItems :[],
    time:Number,
    author:String,
    description:String
});
global.table_webdoc = db.model("webdoc", schema_webdoc);

exports.addwebdoc = function(oOriginal, callback)
{
    var odata =oOriginal.body;
    var message = "";
    var retCode = 0;
    console.log(odata);
    if (odata.Name === undefined || odata.DocIndex === undefined || odata.AllItems === undefined){
        retCode = 1; //error
        message = "webdoc updata data is undefined";
        callback(message, retCode);
    }

    if (odata.AllItems.length === 0){
        retCode = 1; //error
        message = "webdoc updata AllItems length is 0";
        callback(message, retCode);
    }

    try
    {
        var oMatch = {
            DocIndex:odata.DocIndex};
        var oUpdate = {$set: {
             Name :odata.Name,
             DocIndex:odata.DocIndex,
             AllItems:odata.AllItems
             }
        };

        table_webdoc.update(oMatch,oUpdate,{upsert: true},function (error)
        {
            if (error)
            {
                retCode = 1; //error
                message = "webdoc updata database error";
                callback(message, retCode);
            }
            else{
                console.log("wloc_map_add() success");
                message = "webdoc add success";
                retCode = 0; //success
                callback(message, retCode);
                table_webdoc.find(function(err,oDoc)
                {
                    for(var i = 0; i < oDoc.length; i++)
                    {
                        console.log(oDoc[i]);
                    }
                });
            }
        });

    }
    catch(error) {
        retCode = 1; //error
        message = "add webdoc error catch";
        callback(message, retCode);
        console.log("wloc_map_add() error:" + error);
    }


};

function getDocindex(docname){
    var omatch = {$match :{Name :docname}};
    var ogroup = {$group :{_id: "$DocIndex",time : {$max:"$time"}}};
    var Arrey = [];
    table_webdoc.aggregate(omatch,ogroup,function(err, oDoc){
        if (err){
            return Arrey;
        }
        else{
            return oDoc;
        }
    })
};

exports.addwebdocnew = function(oOriginal,res)
{
    var odata =oOriginal.body;
    var obackMsg ={};

    //if (odata.Name === undefined || odata.DocIndex === undefined || odata.AllItems === undefined
    //   || odata.author ===undefined || odata.description === undefined){
    //    obackMsg.retCode = 1; //error
    //    obackMsg.message = "webdoc updata data is undefined";
    //    res.write(JSON.stringify(obackMsg));
    //    res.statusCode = 200;
    //    res.end();
    //    return;
    //}


    var omatch = {$match :{Name :odata.Name}};
    var ogroup = {$group :{_id: "$DocIndex",time : {$max:"$time"}}};
    try {
        table_webdoc.aggregate(omatch,ogroup,function(err, oDoc){
            if (err){
                obackMsg.retCode = 1; //error
                obackMsg.message = "webdoc addwebdocnew aggregate faile";
                res.write(JSON.stringify(obackMsg));
                res.statusCode = 200;
                res.end();
                return;
            }
            else{
                if (oDoc.length == 0)
                {
                    var DocIndex = odata.DocIndex
                }
                else{
                    console.log(oDoc);
                    var DocIndex = oDoc[0]._id;
                }
                try
                {
                    var time = new Date().getTime();
                    console.log("time " + DocIndex);
                    var oUpdate =  {
                        Name :odata.Name,
                        DocIndex:DocIndex,
                        AllItems:odata.AllItems,
                        time :time,
                        author:odata.author,
                        description: odata.description
                    };
                    var insert = new table_webdoc(oUpdate);
                    insert.save(function(err){
                        if (err){
                            console.log("add webdoc faile");
                            obackMsg.retCode = 1; //error
                            obackMsg.message = "add webdoc faile";
                            res.write(JSON.stringify(obackMsg));
                            res.statusCode = 200;
                            res.end();
                            return;

                        }else{
                            obackMsg.retCode = 0; //error
                            obackMsg.message = "add webdoc success";
                            obackMsg.DocIndex = DocIndex;
                            res.write(JSON.stringify(obackMsg));
                            res.statusCode = 200;
                            res.end();
                            return;
                        }
                    });

                }
                catch(error) {
                    obackMsg.retCode = 1; //error
                    obackMsg.message = "add webdoc error catch";
                    console.error("wloc_map_add() error:" + error);
                    res.write(JSON.stringify(obackMsg));
                    res.statusCode = 200;
                    res.end();
                    return;
                }
            }
        });
    }
    catch(err){
        console.error("addwebdocnew  table_webdoc.aggregate faile : " + err);
    }
};

exports.addone = function(oOriginal,callback){
    var retcode = 0;
    var message = "";
    if (typeof oOriginal.items.index == "undefined"){
        retcode = 1;
        message = "addone oOriginal.items.index is undefined";
        callback(message,retcode);
    }
    table_webdoc.find({DocIndex: oOriginal.DocIndex},function(err, oDoc){
        oDoc[0].AllItems.push(oOriginal.items);
        var oMatch = {
            DocIndex:oOriginal.DocIndex};
        var oUpdate = {$set: {
            AllItems:oDoc[0].AllItems
        }
        };
        table_webdoc.update(oMatch,oUpdate,{upsert: false},function (err){
            if (err){
                retcode = 1;
                message = "addone faile";
                callback(message,retcode);
            }
            else{
                retcode = 0;
                message = "addone success";
                callback(message,retcode);
            }

        });

    });
};

exports.modifydoc = function(oOriginal,callback){
    var retcode = 0;
    var message = "";
    if (typeof oOriginal.items.index == "undefined"){
        retcode = 1;
        message = "modifydoc oOriginal.items.index is undefined";
        callback(message,retcode);
    }
    table_webdoc.find({DocIndex: oOriginal.DocIndex},function(err, oDoc){
        var AllItems = oDoc[0].AllItems;
        for (var i = 0; i < AllItems.length; i ++){
            if (AllItems[i].index == oOriginal.items.index){
                AllItems[i] = oOriginal.items;
            }
        }
        var oMatch = {
            DocIndex:oOriginal.DocIndex};
        var oUpdate = {$set: {
            AllItems:AllItems
            }
        };
        table_webdoc.update(oMatch,oUpdate,{upsert: false},function (err){
            if (err){
                retcode = 1;
                message = "modifydoc faile";
                callback(message,retcode);
            }
            else{
                retcode = 0;
                message = "modifydoc success";
                callback(message,retcode);
            }

        });

    });
};

function db_aggregate(oCondation ,odata ,returndata,res)
{
    var filter;
    var message = "";
    var errMsg = "";
    var retCode = 0;
    var condtion2 = {};
    var obackMsg = {};
    for (var i = 0 ; i < returndata.length; i ++)
    {
        condtion2[returndata[i]] = true;
    }
    condtion2["_id"] = false;
    filter = {$project:condtion2};
    table_webdoc.aggregate(oCondation,filter,function(error, adoc)
    {
        if (adoc.length == 0)
        {
            obackMsg.message = "adoc is null";
            obackMsg.retCode = 1;
            res.write(JSON.stringify(obackMsg));
            res.statusCode = 200;
            res.end();
            return;
        }
        if(error)
        {
            obackMsg.retCode = 1; //error
            obackMsg.message = "getwebdocNew DocIndex is undefined";
            res.write(JSON.stringify(obackMsg));
            res.statusCode = 200;
            res.end();
            return;
        }
        else
        {
            //debug.log("wloc_client_get() success", "", __filename);
            var httpmsg = {
                Name :adoc[0].Name,
                DocIndex:adoc[0].DocIndex,
                AllItems:adoc[0].AllItems,
                author:adoc[0].author,
                description:adoc[0].description,
                retcode:0
            };
            res.write(JSON.stringify(httpmsg));
            res.statusCode = 200;
            res.end();
            return;
        }
    });
}

exports.getwebdoc = function(odata, callback)
{
    var oCondation1 = {};
    if(odata.DocIndex === undefined)
    {
        oCondation1 = {$match:{}};
    }
    else
    {
        oCondation1 = {$match:{DocIndex:odata.DocIndex}};
    }
    var returndata = ["Name", "DocIndex", "AllItems"];
    db_aggregate(oCondation1, odata, callback, returndata);
};

exports.getwebdocNew = function(odata,res)
{
    var oCondation1 = {};
    var obackMsg = {};
    if(odata.DocIndex === undefined)
    {
        obackMsg.retCode = 1; //error
        obackMsg.message = "getwebdocNew DocIndex is undefined";


        res.write(JSON.stringify(obackMsg));
        res.statusCode = 200;
        res.end();
        return;
    }
    else
    {
        oCondation1 = {$match:{DocIndex:odata.DocIndex}};
        var ogroup = {$group : {_id : "$DocIndex", time :{$max : "$time"}}};
        table_webdoc.aggregate(oCondation1, ogroup, function(err, oDoc){
            if (oDoc.length != 0){
                oCondation1 = {$match:{DocIndex:odata.DocIndex , time : oDoc[0].time}};
                var returndata = ["Name", "DocIndex", "AllItems", "author", "time", "description"];
                var obackMsg = db_aggregate(oCondation1, odata, returndata,res);
                return obackMsg;
            }

        });
    }
};



exports.deldocweb = function(odata,res){
    var obackMsg = {};

    table_webdoc.remove({DocIndex: odata.DocIndex},function(err,oDoc){
            if (err){
                console.log("remove webdoc faile");
                obackMsg.message = "del webdoc faile";
                obackMsg.retCode = 1;
                res.write(JSON.stringify(obackMsg));
                res.statusCode = 200;
                res.end();
                return;
            }
            else{
                obackMsg.message = "del webdoc success";
                obackMsg.retCode = 0;
                res.write(JSON.stringify(obackMsg));
                res.statusCode = 200;
                res.end();
                return;
            }
        });
};

exports.getwebdoclist = function (odata, callback) {
    var oCondation1 = {$match:{}};
    var returndata = ["DocIndex" , "Name"];
    db_aggregate(oCondation1, odata, callback, returndata);
};

exports.getwebdoclistnew = function (res) {
    //var oCondation1 = {$match:{}};
    var obackMsg = {};
    var Array = [];
    var ogourp = {$group : {_id : "$DocIndex" , Name :{$max :"$Name"} , time: {$max:"$time"}}};
    table_webdoc.aggregate(ogourp,function(error, adoc){
        var count = 0;
        if (error){
            obackMsg.message = "getwebdoclistnew faile";
            obackMsg.retCode = 1;
            res.write(JSON.stringify(obackMsg));
            res.statusCode = 200;
            res.end();
            return;
        }else{
            if (typeof adoc.length === "undefined"){

            }
            else{
                for (var i = 0 ; i < adoc.length; i++)
                {
                    var msg = {};
                    msg.DocIndex =adoc[i]._id;
                    msg.Name = adoc[i].Name;
                    msg.time = adoc[i].time;
                    table_webdoc.find({DocIndex: msg.DocIndex , time: msg.time},function(error, oDoc){
                        count ++;
                        if (error)
                        {
                            obackMsg.message = "getwebdoclistnew find faile ";
                            obackMsg.retCode = 1;
                            res.write(JSON.stringify(obackMsg));
                            res.statusCode = 200;
                            res.end();
                            return;
                        }
                        else{
                            var msg = {};
                            msg.DocIndex =oDoc[0].DocIndex;
                            msg.Name = oDoc[0].Name;
                            msg.time = oDoc[0].time;
                            Array.push(msg);
                        }
                        if (count == (adoc.length)){
                            obackMsg.doclist = Array;
                            obackMsg.retCode = 0;
                            console.log(JSON.stringify(obackMsg));
                            res.write(JSON.stringify(obackMsg));
                            res.statusCode = 200;
                            res.end();
                            return;
                        }
                    });
                }
            }

        }

    });
};

exports.gethistroylist = function (odata,res) {
    var oCondation1 = {$match:{DocIndex : odata.DocIndex}};
    var returndata = ["DocIndex" , "Name", "time"];
    db_aggregate(oCondation1, odata, returndata, res);
};

exports.gethistroydoc = function (odata, res) {
    var oCondation1 = {$match:{DocIndex : odata.DocIndex , time : odata.time * 1}};
    var returndata = ["Name", "DocIndex", "AllItems", "author", "time"];
    console.log(typeof  oCondation1);
    db_aggregate(oCondation1, odata, returndata,res);
};

