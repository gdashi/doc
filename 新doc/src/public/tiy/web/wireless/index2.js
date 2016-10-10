(function ($)
{
    var MODULE_NAME = "wireless.index2";
    var g_PercentMax = 100;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName).split(",");
    }

    function initGrid()
    {
        var optSsid = {
            colNames: getRcText ("SSID_HEADER"),
            multiSelect: false,
            colModel: [
                {name:'SSID', datatype:"String"},
                {name:'AuthType', datatype:"String"}
            ],
            onToggle : {
                action : showSSID,
                jScope : $("#editssidToggle"),
                BtnDel : {
                    show : true,
                    action : onDelSSID
                }
            },
            buttons:[
                {name: "add", action: showSSID},
                {name: "default",value:getRcText("SYN"),action: synSSID}
            ]

        };
        $("#ssidList").SList ("head", optSsid);

        $("input[name=StType],input[name=AccPwdStaff]").bind("change",function(){
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();

            if(!aContent) return true;

            aContent = aContent.split(",");
            for(var i=0;i<aContent.length;i++)
            {
                if(!aContent[i])continue;
                $(aContent[i]).show();
            }
            $("input[name=AccPwdCorpo]").MRadio("setValue",'2',true);
            $("input[name=AccPwdStaff]").MRadio("setValue",'2');
        });

        $(".switch,#impose_auth").bind("minput.changed",function(e,data){
            var sClass = $(this).attr("ctrlBlock");
            this.checked ? $(sClass).show() : $(sClass).hide() ;
        });

        $("input[name=AuthenType], input[name=LoginPage]").bind("change",function(){
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();
            if(!aContent) return true;
            aContent = aContent.split(",");
            for(var i=0;i<aContent.length;i++)
            {
                if(!aContent[i])continue;
                $(aContent[i]).show();
            }
        });

        $("#impose_auth_time").bind("change", function(){
            var value = $(this).val();
            if (value > 30){
                $(this).val(30);
            }
            else if (value < 1){
                $(this).val(1)
            }
        });

        $("input[name=LocalAuthenType]").bind("change",function(){
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();
            if(!aContent) return true;
            aContent = aContent.split(",");
            for(var i=0;i<aContent.length;i++)
            {
                if(!aContent[i])continue;
                $(aContent[i]).show();
            }
        });

    }

    function initFrom(){}

    //显示SSID
    function showSSID(oRowdata, sName){
        function onCancel()
        {
            console.log("finish")
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            return true;
        }

        function onSuccess(){
            if(sName == "edit")
            {
                Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
            }
            Utils.Base.refreshCurPage();
        }

        function onSubmitSSID(){

            function operatePubMng(loginPage, authCfg){//3.选登录模板 更改发布模板
                if (!oRowdata.pubMngName||!("pubMngName" in oRowdata)){//发布模板不存在 创建发布模板
                    getDeviceInfo().done(function(data, textStatus, jqXHR){
                        if (data.dev_list.length <= 0){
                            return ;//无法获取场所列表
                        }
                        var shopName = data.dev_list[0].shop_name;
                        addPubMng(name, shopName, ssidName, WeChart, authCfg, loginPage).done(function(data, textStatus, jqXHR){
                            if (("errorcode" in data) && (data.errorcode != 0)){
                                return;
                            }
                            oRowdata.pubMngName = name;
                            oRowdata.WeChartList = WeChart;
                            oRowdata.AuthCfgList = authCfg;
                            oRowdata.LoginPageList = loginPage;
                            PublishPubMng(name, true)
                                .done(function(data, textStatus, jqXHR){
                                    if (("errorcode" in data) && (data.errorcode != 0)){
                                        return;//发布失败
                                    }
                                    Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
                                    onSuccess();
                                });

                        });
                    });
                }
                else {//修改发布模板
                    var pubMng = oRowdata.pubMngName;
                    modPubMng(pubMng, WeChart, authCfg, loginPage).done(function(data, textStatus, jqXHR){
                        if (("errorcode" in data) && (data.errorcode != 0)){
                            return;
                        }
                        PublishPubMng(pubMng, false).done(function(data, textStatus, jqXHR){
                            if (("errorcode" in data) && (data.errorcode != 0)){
                                return;
                            }
                            Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
                            onSuccess();
                        });
                    });
                }
            }
            var date = new Date();
            var authType = $("input[name=AuthenType]:checked").attr("id");
            var loginType = $("input[name=LoginPage]:checked").attr("id");
            var WeChart = $("#WeChartList").val();
            var ssidName = oRowdata.SSID || $("#SSID",jFormSSID).val();
            var authCfg = $("#AuthCfgList").val();
            var loginPage = $("#LoginPageList").val();
            var time=Frame.DataFormat.getStringTime(new Date());
            // console.log("time:::"+time);
            var name = "";
            if(ssidName.length>15){
                name = ssidName.replace(/\s+/g,"").slice(0,15);
            }else{
                name = ssidName;
            }
            name =name+time;

            if (authType == "AT1"){//1.不认证 删除发布模板 取消发布
                if (!("pubMngName" in oRowdata)){//发布模板不存在
                    Frame.Msg.info(getRcText("DEL_PUB_SUCC"));
                    onSuccess();
                    return ;
                }
                delPubMng(oRowdata.pubMngName).done(function(data, textStatus, jqXHR){
                    if (("errorcode" in data) && (data.errorcode != 0)){
                        Frame.Msg.info(getRcText("DEL_AUTH_FAIL"),"error");//失败哦
                        onSuccess();
                    }
                    Frame.Msg.info(getRcText("DEL_PUB_SUCC"));//发布成功
                    onSuccess();
                })
            }
            else if ((authType == "AT2") || (authType == "AT3")){//2.gm 创建新的登录模板
                var authType = (authType == "AT2" ? 1 : 2);//at2 一键上网 at3 账号登陆
                var enableMsg = ($("#Message").is(":checked") ? 1 : 0);
                var enableWeChart = ($("#WeChart").is(":checked") ? 1 : 0);
                var enableAccount = ($("#FixAccount").is(":checked") ? 1 : 0);
                var nauthParamValue = $("#auto_study_enable").MCheckbox("getState") ? $("#impose_auth_time",jFormSSID).val() : "0";

                addAuthPub(name, authType, enableMsg, enableWeChart, enableAccount, nauthParamValue).done(function(data, textStatus, jqXHR){
                    if (("errorcode" in data) && (data.errorcode != 0)){
                        return ;
                    }
                    authCfg = name;
                    if (loginType == "LP4"){
                        operatePubMng(loginPage, authCfg);
                    }
                    else {
                        //创建新的页面模板
                        addLoginPage(name).done(function(data, textStatus, jqXHR){
                            if (("errorcode" in data) && (data.errorcode != 0)){
                                return ;
                            }
                            loginPage = name;
                            operatePubMng(loginPage, authCfg);
                        })
                    }
                });
            }
            else if (authType == "AT4"){
                if (loginType == "LP4"){
                    operatePubMng(loginPage, authCfg);
                }
                else {
                    //创建新的页面模板
                    addLoginPage(name).done(function(data, textStatus, jqXHR){
                        if (("errorcode" in data) && (data.errorcode != 0)){
                            return ;
                        }
                        loginPage = name;
                        operatePubMng(loginPage, authCfg);
                    })
                }
            }
            //onSuccess();
        }

        var jFormSSID = $("#toggle_form"), sType, sStName;
        var CurrentPercent = oRowdata || {};
        CurrentPercent = CurrentPercent.Percent || 0;
        CurrentPercent = g_PercentMax + CurrentPercent*1;
        $("#percentMax").html(CurrentPercent);
        $("#Percent").attr("max",CurrentPercent);
        CurrentPercent >= 1 ? $("#Percent_Block").show() : $("#Percent_Block").hide();
        if(sName == "add") //Add
        {
            sType = "create";
            sStName = Frame.Util.generateID("ST");
            var jDlg = $("#AddDlg");
            // ssidToggle
            if(jDlg.children().length)
            {
                $("#editssidToggle").show().insertAfter($(".modal-header",jDlg));
            }
            else
            {
                $("#editssidToggle").show().appendTo(jDlg);
            }
            $("#SSID",jFormSSID).attr("readonly",false);
            jFormSSID.form("init", "edit", {"title":getRcText("ADD_TITLE"),"btn_apply": onSubmitSSID});
            jFormSSID.form("updateForm",{
                SSID : "",
                StType : "1",
                UserIsolation : "false"
            });
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
        }
        else //Edit
        {
            sType = "merge";
            sStName = oRowdata.Name;

            jFormSSID.form ("init", "edit", {"btn_apply": onSubmitSSID, "btn_cancel":onCancel});

            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            if(oRowdata.auto_study_enable == false)
            {
                $("#auto_study_enable", jFormSSID).MCheckbox("setState",false);
                $(".Learn-MAC", jFormSSID).hide();
            }
            else
            {
                $("#auto_study_enable").MCheckbox("setState",true);
                $(".Learn-MAC", jFormSSID).show();
            }
        }
    }

    function onDelSSID(){}

    function synSSID(){}

    function initData(jScope){
        //getSSIDInfo().done(queryPubmng).done(queryAuthCfg);
        var aAuthType = getRcText("AUTHEN_TYPE");
        var obj = {};
        //获取认证模板
        queryAuthCfg().done(function(data, textStatus, jqXHR){
            if (("errorcode" in data) && (data.errorcode != 0)){
                return;
            }
            var auth_list = data.data;
            var authcfgList = [];
            auth_list.forEach(function(authcfg){
                if(authcfg.authCfgGson){
                    authcfgList.push(authcfg.authCfgGson.authCfgTemplateName);
                }
            });
            $("#AuthCfgList").singleSelect("InitData",authcfgList);

            var ssid_list = data.data || [];
            ssid_list.forEach(function(ssid){
                if(ssid.pubMng){
                    var SSID = ssid.pubMng.ssidName || ssid.ssid;
                    obj[SSID] = {//设置初始值
                        SSID: SSID,
                        //sp_name: ssid.sp_name,
                        AuthenType: "AT1",//不认证
                        LoginPage: "LP1", //简约
                        AuthType:aAuthType[0]
                    };
                }
            });

                var pubmng_list = data.data.pubMng || [];
                pubmng_list.forEach(function(pubmng){
                    if (!("ssidName" in pubmng)){
                        return;
                    }
                    if (!(pubmng.ssidName in obj)){
                        return;
                    }

                    //这里应该可以优下
                    var ssid = pubmng.ssidName;//obj[pubmng.ssidName];
                    obj[ssid].pubMngName = pubmng.name;
                    obj[ssid].shopName = pubmng.shopname;
                    obj[ssid].ssidName = pubmng.ssidName;
                    obj[ssid].WeChartList = pubmng.weixinAccountName;
                    obj[ssid].authCfgName = pubmng.authCfgName;
                    obj[ssid].loginPage = pubmng.themeTemplateName;
                    //====for show===
                    obj[ssid].AuthenType = "AT" + (pubmng.authCfgName?4:0);//认证模板
                    obj[ssid].AuthCfgList = pubmng.authCfgName;
                    obj[ssid].LoginPage = pubmng.themeTemplateName?"LP4":"LP1"//页面模板
                    obj[ssid].LoginPageList = pubmng.themeTemplateName;
                    //====for show===
                    auth_list.forEach(function(authmsg){
                        if(authmsg.authCfgTemplateName == pubmng.authCfgName)
                        {
                            obj[ssid].AuthType = aAuthType[authmsg.authType];//slist 显示用
                            if(authmsg.uamAuthParamList[0].authParamValue == "0")
                            {
                                obj[ssid].auto_study_enable = false;
                            }
                            else
                            {
                                obj[ssid].auto_study_enable = true;
                                obj[ssid].impose_auth_time = authmsg.uamAuthParamList[0].authParamValue;
                            }

                        }
                    })
                });
                refreshSSIDList(obj);
        });

        //微信公众号列表初始化
        queryWeChat().done(function(data, textStatus, jqXHR){
            if (("errorcode" in data) && (data.errorcode != 0)){
                return;
            }
            var WeChartList = [];
            var WeChartArr = data.data || [];
            WeChartArr.forEach(function(WeChartAccount){
                WeChartList.push(WeChartAccount.name)
            });
            $("#WeChartList").singleSelect("InitData",WeChartList);
        })

        //发布模板列表初始化
        queryLoginPage().done(function(data, textStatus, jqXHR){
            if (("errorcode" in data) && (data.errorcode != 0)){
                return;
            }
            var loginPageList = [];
            var loginPageArr = data.data || [];
            loginPageArr.forEach(function(loginPage){
                loginPageList.push(loginPage.themeName);
            })
            $("#LoginPageList").singleSelect("InitData",loginPageList);
        })
    }

    //查询发布管理
    function queryPubMng(data, textStatus, jqXHR){
        // console.log(data);
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path+"/pubmng/query?ownerName="+FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json"
        });
    }

    function queryAuthCfg(){
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path+"/authsetting/query?ownerName="+FrameInfo.g_user.attributes.name+"&shopName="+Utils.Device.deviceInfo.shop_name,
            dataType: "json",
            contentType: "application/json"
        })
    }

    function queryWeChat(){
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path+"/weixinaccount/query?ownerName="+FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json",
        });
    }

    function queryLoginPage(){
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path+"/themetemplate/query?ownerName="+FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json",
        })
    }

    function refreshSSIDList(obj){
        var arr = [];
        for (var a in obj){
            arr.push(obj[a]);
        }
        $("#ssidList").SList ("refresh", arr);
    }

    function _init ()
    {
        initGrid();
        initData();
        initFrom();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form","MSelect"],
        "utils": ["Base"]
    });

}) (jQuery);
