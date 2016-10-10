/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "chatstore.index";
    var rc_info = "chatstore_rc";
    var g_ssidArr= [];
    var g_appId,g_appSecret,g_weChatName;
    var g_del_Status = {};

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    
    function editTest(colData){
      // alert(1);
    }

    function deleteWifiShop(param){

        function delWifiShopSuc(data){
            console.log(data);
            if(data.errcode == 0){
                Frame.Msg.info(g_del_Status.suc);
                Utils.Base.refreshCurPage();
            }else{
                Frame.Msg.info(g_del_Status.fal,"error")
            }
        }

        function delWifiShopFail(err){
            console.log(err);
        }

        var delWifiShopOpt = {
            type:"POST",
            url:MyConfig.v2path+"/wifiShopDb/deleteWifiShop",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify({
                appId:g_appId,
                appSecret:g_appSecret,
                nasid:FrameInfo.Nasid,
                shop_id:param.shop_id
            }),
            onSuccess: delWifiShopSuc,
            onFailed: delWifiShopFail

        }
        Utils.Request.sendRequest(delWifiShopOpt);
    }

    function deleteShop(param){

        function delShopSuc(data){
            console.log(data);
            if(data.errcode == 0){
                if(param.shop_id){
                    deleteWifiShop(param);
                }else{
                    Frame.Msg.info(g_del_Status.suc)
                    Utils.Base.refreshCurPage();
                }

            }
        }
        function delShopFail(err){
            console.log(err);
        }

        var delShopOpt = {
            type:"POST",
            url:MyConfig.v2path+"/wifiShopDb/deleteShop",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify({
                appId:g_appId,
                appSecret:g_appSecret,
                nasid:FrameInfo.Nasid,
                poi_id:param.poi_id
            }),
            onSuccess: delShopSuc,
            onFailed: delShopFail

        }
        Utils.Request.sendRequest(delShopOpt);
    }


    function delTest(colData){
        deleteShop({poi_id:colData[0].poi_id,shop_id:colData[0].shop_id});
    }

    function showLink(row, cell, value, columnDef, dataContext, type)
    {
        var shop_id = dataContext.shop_id;
        var sid = dataContext.sid;
        var checkState = dataContext.checkState;

        if(!shop_id||!sid||checkState!=3){
            return '<i class="fa fa-cog" style="font-size: 20px"></i>';
        }

        return '<a class="list-link" data-sid = "'+sid+'" data-shopId ="'+shop_id+'" ><i class="fa fa-cog" style="font-size: 20px"></i></a>';
    }


    function redirectStroe(){

        Utils.Base.redirect ({np:"chatstore.storeinfomation"});
    }

    function onDisDetail()
    {
        var shopId = $(this).attr("data-shopId");
        var sid =  $(this).attr("data-sid");
        Utils.Base.redirect (
            {   np:"chatstore.config",
                sid:sid,
                shopId:shopId,
                appId:g_appId,
                appSecret:g_appSecret
            });
    }

    function showEnable(colData){
        var selecteVal = colData[0];
       /* if(selecteVal.poi_id&&selecteVal.shop_id){
            return true;
        }*/
        if(selecteVal.poi_id){
            return true;
        }
        return false;

    }

    function initGrid()
    {
        var opt = {
            colNames: getRcText ("chatStore_HEADER"),
            showOperation:true,
            pageSize:10,
            colModel: [
                {name:'name',datatype:"String"},
                {name:'chatName', datatype:"String"},
                {name:'ssidName',datatype:"String"},
                {name:'state',datatype:"String"},
                {name:'storeSet',datatype:"String",formatter:showLink}
            ],
            buttons:[
                {name:"edit",enable:false,action:editTest},
                {name:"delete",enable:showEnable,action:delTest},
                {name:"redirect",value:getRcText("redirectBtn"),action:redirectStroe}
            ]
        };
        $("#chatstoreList").SList ("head", opt);

        $("#chatstoreList").on('click', 'a.list-link', onDisDetail);
    }

    function initData()
    {
        getWechatList();
    }
    //获取微信公众号，列表
    function getWechatList(){
        function getChatListSuc(data){

            var aIntList = [];
            $.each(data.data,function(index, value) {
                aIntList.push(value.name);
            });

            $("#PublicWeixin").singleSelect("InitData",aIntList);
            $("#PublicWeixin").singleSelect("value",aIntList[0]);

            g_appId = data.data[0].appId;
            g_appSecret = data.data[0].appSecret;
            g_weChatName = aIntList[0];
            getChatStoreList();
        }

        function getChatListFail(err){
            console.log(err);
        }
        var getChatListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/weixinaccount/query?ownerName="+FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json",
            onSuccess: getChatListSuc,
            onFailed: getChatListFail

        }
        Utils.Request.sendRequest(getChatListOpt);
    }

    function getChatStoreList(){

        function getShopListSuc(data){
            console.log(data);
            if(data.errcode == 0){
                var available_state = getRcText("available_state").split(",");
                var chatStoreInfo = data.base_infos;
                var reDataArr = [];
                function getWifiShopListSuc(wifiData){
                    console.log(wifiData);
                    var refrshData = {};
                    var wifiDataArr = wifiData.datas;
                    $.each(chatStoreInfo,function(i,v){
                        var reData = {};
                        reData.name = v.business_name;
                        reData.chatName = g_weChatName;
                        reData.state = available_state[v.available_state];
                        reData.checkState = v.available_state;
                        reData.poi_id = v.poi_id||"";
                        reData.storeSet = "";
                        if(v.sid){
                           /* reData.ssidName = "";
                            reData.shop_id ="";
                            reData.sid ="";
                            reData.storeSet = "";*/
                            reData.sid = v.sid;
                            refrshData[v.sid] =reData
                        }else if(!v.branch_name)
                        {
                            refrshData[v.bussiness_name] =reData
                        }
                        else
                        {
                            refrshData[v.bussiness_name+"("+v.branch_name+")"] =reData
                        }

                       /* $.each(wifiData.datas,function(i,wifiValue){
                            /!*
                                先通过sid关联wifi门店和微信门店；还可以通过shopname比较；
                                规则：shopname=bussiness_name+"("+branch_name+")";
                             *!/
                            if(v.sid&&wifiValue.sid&&v.sid == wifiValue.sid){
                                if($.inArray(wifiValue.ssid,g_ssidArr)!= -1){
                                    reData.ssidName = wifiValue.ssid;
                                }
                                if(wifiValue.shop_id){
                                    reData.shop_id = wifiValue.shop_id;
                                }
                                reData.sid =v.sid;
                            }

                        });
                        reDataArr.push(reData);*/
                    })

                    $.each(wifiDataArr,function(i,v){
                        if(refrshData[v.sid]){
                            refrshData[v.sid].ssidName = v.ssid;
                            refrshData[v.sid].shop_id =v.shop_id;
                        }else if(refrshData[v.shop_name]){
                            refrshData[v.shop_name].ssidName = v.ssid;
                            refrshData[v.shop_name].shop_id =v.shop_id;
                        }

                    });
                    $.each(refrshData,function(key,v){
                        reDataArr.push(v);
                    })

                    $("#chatstoreList").SList ("refresh", reDataArr);

                }

                function getWifiShopListFail(wifiErr){
                    console.log(wifiErr);
                }

                var getWifiShopListOpt={
                    type:"POST",
                    url:MyConfig.v2path+"/wifiShopDb/queryWifiShopList",
                    contentType: "application/json",
                    dataType: "json",
                    data:JSON.stringify({
                        appId:g_appId,
                        appSecret:g_appSecret,
                        nasid:FrameInfo.Nasid
                    }),
                    onSuccess:getWifiShopListSuc,
                    onFailed:getWifiShopListFail
                };

                Utils.Request.sendRequest(getWifiShopListOpt);
            }
        }

        function getShopListFail(err){
            console.log(err);
        }


        var getShopListOpt={
            type:"POST",
            url:MyConfig.v2path+"/wifiShopDb/queryShopList",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify({
                appId:g_appId,
                appSecret:g_appSecret,
                nasid:FrameInfo.Nasid
            }),
            onSuccess:getShopListSuc,
            onFailed:getShopListFail
        }
        Utils.Request.sendRequest(getShopListOpt);
    }

    function checkWechatName(){

            function getShopListSuc(shopData){
                console.log(shopData);
                if(shopData.errcode==0){
                    getChatStoreList();
                }else if(shopData.errcode==-1){
                    Frame.Msg.info("该微信公众号不存在","error");
                    $("#chatstoreList").SList ("refresh", []);
                }else{
                    console.log(shopData);
                }
            }

            function getShopListFail(err){
                console.log(err);
            }

            var getShopListOpt={
                type:"POST",
                url:MyConfig.v2path+"/wifiShop/getShoplist",
                contentType: "application/json",
                dataType: "json",
                data:JSON.stringify({
                    appId:g_appId,
                    appSecret:g_appSecret,
                    begin:0,
                    limit:50
                }),
                onSuccess:getShopListSuc,
                onFailed:getShopListFail
            }

            Utils.Request.sendRequest(getShopListOpt);

    }

    function activeStore(){

        var chatName = $("#PublicWeixin").singleSelect("value");


        function getStoreInfoSuc(data){

            for(var i=0,len=data.data.length;i<len;i++){
                if(data.data[i].name==chatName){
                    g_appId = data.data[i].appId;
                    g_appSecret = data.data[i].appSecret;
                    g_weChatName = data.data[i].name;

                }
            }
            checkWechatName()
           // getChatStoreList();
        }

        function getStoreInfoFail(err){
            console.log(err);
        }

        var getStoreInfoOpt = {
            type: "GET",
            url: MyConfig.v2path+"/weixinaccount/query?ownerName="+FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                name:chatName
            }),
            onSuccess: getStoreInfoSuc,
            onFailed: getStoreInfoFail

        }
        Utils.Request.sendRequest(getStoreInfoOpt);
    }

    function initForm()
    {
        $("#filter_weixinstore").on("click", function(){
            $("#weixinstore_block").toggle();
            $("#PublicWeixin").on("change",activeStore)
        });
    }

    function getSIIDListInfo(){

        function getSSIDListSuc(data){
            console.log(data);
            $.each(data.ssid_list,function(i,v){
                g_ssidArr.push(v.ssid_name);
            });
            initData();
        }

        function getSSIDListFail(err){
            console.log(err);
        }
        var ssidListOpt = {
            type: "POST",
            url: MyConfig.v2path+"/getSSIDInfo",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                tenant_name: FrameInfo.g_user.attributes.name,
                dev_snlist: [FrameInfo.ACSN+""]
            }),
            onSuccess: getSSIDListSuc,
            onFailed:  getSSIDListFail
        }

        Utils.Request.sendRequest(ssidListOpt);
    }

    function _init(oPara)
    {
        
        g_del_Status.suc = getRcText("del_statu").split(",")[0];
        g_del_Status.fal = getRcText("del_statu").split(",")[1];

        initGrid();
        getSIIDListInfo();
        initForm();
    };

    function _destroy()
    {
        g_ssidArr= [];
        g_appId = "";
        g_appSecret = "";
        g_weChatName = "";
        Utils.Request.clearMoudleAjax(MODULE_NAME);
        g_Status = {};
    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect"],
        "utils": ["Base","Request","Device"]
    });
}) (jQuery);
