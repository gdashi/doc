/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "chatstore.storeinfomation";
    var rc_info = "storeinfomation_rc";
    var g_wifiShopList,g_ShopList;
    var g_appId = "";
    var g_appSecret="";
    var v2path = MyConfig.v2path;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }
    /*function editTest(){
        alert(1);
    }
    function redirectStroe(){

        Utils.Base.redirect ({np:"chatstore.storeinfomation"});
    }*/

    function comeback(){

        Utils.Base.redirect ({np:"chatstore.index"});
    }

   /* function updateLvzhouShop(shopInfo)
    {
        function updataShopSuc(data)
        {
            console.log(data);
            if(data.errcode == 0){
                //TODO
                Frame.Msg.info("to lvzhou success");
            }else{
                //TODO
                Frame.Msg.info("to lvzhou error","error");
            }
        }

        function updataShopFail(err)
        {
            console.log(err);
        }

        var updateShop= {
            type: "POST",
            url: MyConfig.v2path+"/wifiShopDb/updateShop",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                nasid:FrameInfo.Nasid,
                appId:g_appId,
                appSecret:g_appSecret,
                base_info:shopInfo
            }),
            onSuccess: updataShopSuc,
            onFailed: updataShopFail
        };

        Utils.Request.sendRequest(updateShop);
    }

    function updateLvzhouWifiShop(shopInfo,wifiShopInfo)
    {
        function updateWifiShopSuc(data)
        {
            console.log(data);
            if(data.errcode == 0){
                //TODO
               // updateLvzhouShop(shopInfo,wifiShopInfo);
            }
        }

        function updateWifiShopFail(err)
        {
            console.log(err);
        }

        var updateWifiShop= {
            type: "POST",
            url: MyConfig.v2path+"/wifiShopDb/updateWifiShop",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                nasid:FrameInfo.Nasid,
                appId:g_appId,
                appSecret:g_appSecret,
                data:wifiShopInfo
            }),
            onSuccess: updateWifiShopSuc,
            onFailed: updateWifiShopFail
        };

        Utils.Request.sendRequest(updateWifiShop);
    }

    function getLvzhouWifiShopInfo(shopInfo,wifiShopInfo)
    {

        function getWifiShopSuc(data)
        {
            console.log(data);
            if(data.errcode == 0){

                if(!data.data)
                {
                    //TODO
                    getSecretKey(shopInfo,wifiShopInfo);
                }
                else
                {
                    //TODO
                    Frame.Msg.info("lvzhouWifiShop exist","error")
                   // getSecretKey(shopInfo,wifiShopInfo,1);
                }

            }else{
                Frame.Msg.info(" getlvzhouWifiShop error","error")
            }
        }

        function getWifiShopFail(err)
        {
            console.log(err);
        }

        if(!wifiShopInfo.shop_id){
            Frame.Msg.info("wifiShopInfo.shop_id empty","error")
            return
        }
        var getWifiShopOpt= {
            type: "POST",
            url: MyConfig.v2path+"/wifiShopDb/queryWifiShop",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                nasid:FrameInfo.Nasid,
                appId:g_appId,
                appSecret:g_appSecret,
                shop_id:wifiShopInfo.shop_id
            }),
            onSuccess: getWifiShopSuc,
            onFailed: getWifiShopFail
        }

        Utils.Request.sendRequest(getWifiShopOpt);

    }*/

    /*单一持久化保存数据接口*/

    function saveLvzhouWifiShopInfo(wifiShop)
    {
        function saveLvzhouWifiShopSuc(data)
        {
            console.log(data);
            var resultTips = getRcText("updateResult").split(",");

            if(data.errcode == 0)
            {
                Frame.Msg.info(resultTips[0]);
            }
            else
            {
                Frame.Msg.info(resultTips[1]);
            }
        }

        function saveLvzhouWifiShopFail(err)
        {
            console.log(err);
        }

        var savWifiShop= {
            type: "POST",
            url: MyConfig.v2path+"/wifiShopDb/saveWifiShop",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                nasid:FrameInfo.Nasid,
                appId:g_appId,
                appSecret:g_appSecret,
                data:wifiShop
            }),
            onSuccess: saveLvzhouWifiShopSuc,
            onFailed: saveLvzhouWifiShopFail
        }
        Utils.Request.sendRequest(savWifiShop);
    }

    function getSecretKey(wifiShopInfo)
    {

        function getSecretKeySuc(data)
        {
            console.log(data);
            if(data.errcode == 0){
                //TODO
                saveLvzhouWifiShopInfo(wifiShopInfo);
            }

        }

        function getSecretKeyail(err)
        {
            console.log(err);
        }

        var getSecretKeyOpt= {
            type: "POST",
            url: MyConfig.v2path+"/wifiShop/getWifishopSecretkey",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                appId:g_appId,
                appSecret:g_appSecret,
                shop_id:wifiShopInfo.shop_id,
                ssid:wifiShopInfo.ssid,
                reset:false
            }),
            onSuccess: getSecretKeySuc,
            onFailed: getSecretKeyail
        }

        Utils.Request.sendRequest(getSecretKeyOpt);
    }

    function getSidFunction(shopInfo,wifiShopInfo){
        function getUUIDSuc(data){
            console.log(data);
            if(data.errcode == 0){
                var uuid = data.uuid
                getLvzhouShopInfo(shopInfo,wifiShopInfo,uuid);
            }
        }

        function getUUIDFail(err){
            console.log(data);
        }

        var getUUidOpt={
            type:"GET",
            url:v2path+"/weixinUtils/utils?type=getuuid",
            contentType: "application/json",
            dataType: "json",
            onSuccess:getUUIDSuc,
            onFailed:getUUIDFail
        };

        Utils.Request.sendRequest(getUUidOpt);
    }

    function saveLvzhouShop(shopInfo,wifiShopInfo,flag)
    {
        var resultTips = getRcText("updateResult").split(",");

        function saveLvzhouShopSuc(data)
        {
            console.log(data);
            if(data.errcode == 0)
            {
                if(flag == 1)
                {
                    getSecretKey(wifiShopInfo);
                }
                else
                {
                    Frame.Msg.info(resultTips[0]);
                }
            }
            else
            {
                Frame.Msg.info(resultTips[1],"error");
            }
        }

        function saveLvzhouShopFail(err)
        {
            console.log(err);
        }

        var saveShop= {
            type: "POST",
            url: MyConfig.v2path+"/wifiShopDb/saveShop",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                nasid:FrameInfo.Nasid,
                appId:g_appId,
                appSecret:g_appSecret,
                base_info:shopInfo
            }),
            onSuccess: saveLvzhouShopSuc,
            onFailed: saveLvzhouShopFail
        }
        Utils.Request.sendRequest(saveShop);
    }


    function getLvzhouShopInfo(shopInfo,wifiShopInfo,uuid)
    {
        function getShopSuc(data){
            console.log(data);
            if(data.errcode == 0){

                function getWifiShopSuc(wifidata)
                {

                    if(wifidata.errcode == 0)
                    {
                        if(!wifidata.data&&data.base_info)
                        {
                            //TODO 只是保存wifishop
                            if(data.base_info.sid){
                                wifiShopInfo.sid = data.base_info.sid
                            }else if(!data.base_info.sid){
                                wifiShopInfo.sid = uuid
                            }
                            if(!wifiShopInfo.ssid){
                                wifiShopInfo.ssid = "aaa";
                            }
                            getSecretKey(wifiShopInfo);
                        }
                        else if(wifidata.data&&!data.base_info)
                        {
                            //TODO only saveshop 标识0
                            if(wifidata.data.sid){
                                wifiShopInfo.sid = wifidata.data.sid;
                                shopInfo.sid = wifidata.data.sid;
                            }else if(!data.base_info.sid){
                                wifiShopInfo.sid = uuid;
                                shopInfo.sid = uuid;
                            }
                            if(!wifiShopInfo.ssid){
                                wifiShopInfo.ssid = "aaa";
                            }
                            saveLvzhouShop(shopInfo,wifiShopInfo,0);

                        }
                        else if(!wifidata.data&&!data.base_info)
                        {
                            //TODO  saveshop and savewifishop 标识1
                            wifiShopInfo.sid = uuid;
                            shopInfo.sid = uuid;
                            if(!wifiShopInfo.ssid){
                                wifiShopInfo.ssid = "aaa";
                            }
                            saveLvzhouShop(shopInfo,wifiShopInfo,1);
                        }
                        else
                        {
                            Frame.Msg.info(getRcText("shopExist"));
                        }

                    }else{
                        Frame.Msg.info(getRcText("getLvzhouwifi_Err"),"error")
                    }
                }

                function getWifiShopFail(err)
                {
                    console.log(err);
                }

                if(!wifiShopInfo.shop_id){
                    Frame.Msg.info("wifiShopInfo.shop_id empty","error")
                    return
                }
                var getWifiShopOpt= {
                    type: "POST",
                    url: MyConfig.v2path+"/wifiShopDb/queryWifiShop",
                    dataType: "json",
                    contentType: "application/json",
                    data:JSON.stringify({
                        nasid:FrameInfo.Nasid,
                        appId:g_appId,
                        appSecret:g_appSecret,
                        shop_id:wifiShopInfo.shop_id
                    }),
                    onSuccess: getWifiShopSuc,
                    onFailed: getWifiShopFail
                }

                Utils.Request.sendRequest(getWifiShopOpt);


            }else{
                Frame.Msg.info(getRcText("getLvzhouShop_Err"),"error")
            }
        }
        function getShopFail(err){
            console.log(err);
        }

        if(!shopInfo.poi_id){
            Frame.Msg.info(getRcText("poiIdNotExist_Err"),"error");
            return
        }

        var getShopOpt= {
            type: "POST",
            url: MyConfig.v2path+"/wifiShopDb/queryShop",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                nasid:FrameInfo.Nasid,
                appId:g_appId,
                appSecret:g_appSecret,
                poi_id:shopInfo.poi_id
            }),
            onSuccess: getShopSuc,
            onFailed: getShopFail
        }

        Utils.Request.sendRequest(getShopOpt);
    }


   /* function saveUpdateShopToLvzhou(shopInfo,wifiShopInfo)
    {

         function saveAllShopInfoSuc(data){
            console.log(data);
             if(data.errcode == 0)
             {
                 Frame.Msg.info("save lvzhou success");
             }
             else
             {
                 Frame.Msg.info("save lvzhou error","error");
             }
         }

         function saveAllShopInfoFail(err){
            console.log(err);
         }
         var saveAllShopInfoOpt={
         type:"POST",
         url:MyConfig.v2path+"/wifiShopDb/saveAllShopInfo",
         contentType: "application/json",
         dataType: "json",
         data:JSON.stringify({
             appId:g_appId,
             appSecret:g_appSecret,
             nasid:FrameInfo.Nasid,
             shop_info:shopInfo,
             wifishop_info:wifiShopInfo
         }),
         onSuccess:saveAllShopInfoSuc,
         onFailed:saveAllShopInfoFail
         }

         Utils.Request.sendRequest(saveAllShopInfoOpt);
    }*/

    function insert (datainfo) {

       var shopInfo = {};
        var wifiShopInfo = {};
        $.each(g_ShopList,function(i,v){
            if(v.base_info.poi_id&& v.base_info.poi_id == datainfo[0].poi_id){
                shopInfo = v.base_info;
            }
        })
        $.each(g_wifiShopList,function(i,v){
            if(v.shop_id&& v.shop_id == datainfo[0].shop_id){
                wifiShopInfo = v;
            }
        })
        getSidFunction(shopInfo,wifiShopInfo);

       // saveUpdateShopToLvzhou(shopInfo,wifiShopInfo);

      /*  function getShopInfoSuc(data)
        {
            var saveinfo=data.business.base_info;*/
            /*function saveWithUpdataShopSuc(data){
                var resultTips = getRcText("updateResult").split(",");
                if(data.errcode == 0){

                    function saveWifiShopSuc(wifData){
                        console.log(wifData);
                    }

                    function saveWifiShopFail(err){
                        console.log(err);
                    }

                    //导入功能 发现可以不要导入wifi门店

                    Frame.Msg.info(resultTips[0]);
                }else{
                    Frame.Msg.info(resultTips[1]);
                }
            }

            function saveWithUpdataShopFail(){
                console.log("err");
            }

            var saveShop= {
                type: "POST",
                url: MyConfig.v2path+"/wifiShopDb/saveShop",
                dataType: "json",
                contentType: "application/json",
                data:JSON.stringify({
                    nasid:Utils.Device.deviceInfo.nas_id,
                    appId:g_appId,
                    appSecret:g_appSecret,
                    base_info:shopInfo
                    /!*{
                     business_name:saveinfo.business_name,
                     telephone:saveinfo.telephone,
                     categories:saveinfo.categories,
                     offset_type:saveinfo.offset_type,
                     longitude:saveinfo.longitude,
                     latitude:saveinfo.latitude,
                     sid:saveinfo.sid,
                     available_status:saveinfo.available_state,
                     update_status:saveinfo.update_status,
                     poi_id:saveinfo.poi_id
                     }*!/
                }),
                onSuccess: saveWithUpdataShopSuc,
                onFailed: saveWithUpdataShopFail
            }
            Utils.Request.sendRequest(saveShop);*/
       // }

     /*   function getShopInfoFail()
        {
            console.log("err");
        }
        var getShopInfoOpt={
            type:"POST",
            url:MyConfig.v2path+"/wifiShop/getShopinfo",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify({
                appId:g_appId,
                appSecret:g_appSecret,
                poi_id:datainfo[0].poi_id
            }),
            onSuccess:getShopInfoSuc,
            onFailed:getShopInfoFail
        }

        Utils.Request.sendRequest(getShopInfoOpt);*/


    }

    function initGrid()
    {
        var opt = {
            colNames: getRcText ("storeInfomation_HEADER"),
            showOperation:true,
            pageSize:10,
            colModel: [
                {name:'shop_name', datatype:"String"},
                {name:'ssid_name',datatype:"String"},
                {name: 'state',datatype:"String"}

              ],
            buttons:[
                {name:"import",enable:true,action:insert},
                {name:"comeback",value:getRcText ("comeback"),enable:true,action:comeback}
            ]
            };
        $("#storeinfomationList").SList ("head", opt);
    }

    function initData()
    {
        function getChatListSuc(data){

            var aIntList = [];
            $.each(data.data,function(index, value) {
                aIntList.push(value.name);
             });

            $("#PublicWeixin").singleSelect("InitData",aIntList);
            $("#PublicWeixin").singleSelect("value",aIntList[0]);

            g_appId = data.data[0].appId;
            g_appSecret = data.data[0].appSecret;
            getChatStoreList(data.data[0].appId,data.data[0].appSecret);
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

    function getChatStoreList(appId,appSecret){

            function getShopListSuc(shopData){
                console.log(shopData);
                if(shopData.errcode==0){
                    g_ShopList = shopData.business_list;
                    function getWifishopListSuc(wifiData){
                        console.log(wifiData);
                        //var refreshData = [];
                        var reDataArr = [];
                        var refrshData = {};
                        g_wifiShopList = wifiData.data.records;

                        $.each(wifiData.data.records,function(i,value){
                            var reData = {};
                            reData.ssid_name = value.ssid;
                            reData.shop_id=value.shop_id;
                            if(value.sid){
                                reData.sid = value.sid;
                                refrshData[value.sid] =reData
                            }
                            else if(value.shop_name)
                            {
                                refrshData[value.shop_name] =reData
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

                             });*/
                            /* reDataArr.push(reData);*/
                        })

                        $.each(shopData.business_list,function(i,spValue){
                            if(refrshData[spValue.base_info.sid]){
                                refrshData[spValue.base_info.sid].shop_name = spValue.base_info.business_name;
                                refrshData[spValue.base_info.sid].available_state=getRcText("available_state").split(",")[spValue.base_info.available_state-1];
                                refrshData[spValue.base_info.sid].update_status=spValue.base_info.update_status;
                                refrshData[spValue.base_info.sid].poi_id=spValue.base_info.poi_id;
                                refrshData[spValue.base_info.sid].state = getRcText("available_state").split(",")[spValue.base_info.available_state-1]+"";
                            }else if(!spValue.base_info.branch_name&&refrshData[spValue.base_info.business_name]){
                                refrshData[spValue.base_info.business_name].shop_name = spValue.base_info.business_name;
                                refrshData[spValue.base_info.business_name].available_state=getRcText("available_state").split(",")[spValue.base_info.available_state-1];
                                refrshData[spValue.base_info.business_name].update_status=spValue.base_info.update_status;
                                refrshData[spValue.base_info.business_name].poi_id=spValue.base_info.poi_id;
                                refrshData[spValue.base_info.business_name].state = getRcText("available_state").split(",")[spValue.base_info.available_state-1]+"";

                            }else if(spValue.base_info.branch_name){

                                refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"].shop_name = spValue.base_info.business_name;
                                refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"].available_state=getRcText("available_state").split(",")[spValue.base_info.available_state-1];
                                refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"].update_status=spValue.base_info.update_status;
                                refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"].poi_id=spValue.base_info.poi_id;
                                refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"].state = getRcText("available_state").split(",")[spValue.base_info.available_state-1]+"";

                            }

                        });
                        $.each(refrshData,function(key,v){
                            reDataArr.push(v);
                        })
                        /*  $.each(wifiData.data.records,function(index, value) {
                            var wifiObj = {};
                            wifiObj.shop_name = value.shop_name;
                            wifiObj.ssid_name = value.ssid;
                            wifiObj.shop_id=value.shop_id;
                            wifiObj.available_state = "";
                            wifiObj.update_status ="";
                            wifiObj.poi_id ="";
                            wifiObj.state = "";
                            $.each(shopData.business_list,function(index, spValue) {
                                if(value.sid == spValue.base_info.sid
                                    ||value.shop_name == spValue.base_info.business_name){
                                    wifiObj.available_state=getRcText("available_state").split(",")[spValue.base_info.available_state-1];
                                    wifiObj.update_status=spValue.base_info.update_status;
                                    wifiObj.poi_id=spValue.base_info.poi_id;
                                    wifiObj.state = getRcText("available_state").split(",")[spValue.base_info.available_state-1]+"";
                                }
                            });
                            refreshData.push(wifiObj);
                        });*/

                        $("#storeinfomationList").SList ("refresh", reDataArr);
                    }

                    function getWifishopListFail(){
                        console.log(err)
                    }

                    var getWifishopListOpt={
                        type:"POST",
                        url:v2path+"/wifiShop/getWifishoplist",
                        contentType: "application/json",
                        dataType: "json",
                        data:JSON.stringify({
                            appId:appId,
                            appSecret:appSecret,
                         }),
                        onSuccess:getWifishopListSuc,
                        onFailed:getWifishopListFail
                        };

                    Utils.Request.sendRequest(getWifishopListOpt);
                }else if(shopData.errcode==-1){
                    Frame.Msg.info(getRcText("WechatNotFind"),"error");
                    $("#storeinfomationList").SList ("refresh", []);
                }else{
                    console.log(shopData);
                }
            }

            function getShopListFail(err){
                console.log(err);
            }

            var getShopListOpt={
                type:"POST",
                url:v2path+"/wifiShop/getShoplist",
                contentType: "application/json",
                dataType: "json",
                data:JSON.stringify({
                    appId:appId,
                    appSecret:appSecret,
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

                   getChatStoreList(data.data[i].appId,data.data[i].appSecret);

                }
            }
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



    function _init(oPara)
    {
        initGrid();
        initData();
        initForm();
    }

    function _resize()
    {

    }
    function _destroy()
    {
        var g_wifiShopList=[];
        var g_ShopList=[];
        var g_appId = "";
        var g_appSecret="";
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect"],
        "utils": ["Base","Request"]
    });
}) (jQuery);
