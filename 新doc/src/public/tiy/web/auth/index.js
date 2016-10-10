/**
 * Created by Administrator on 2015/11/26.
 */
(function ($)
{
    var MODULE_NAME = "auth.index";
    var v2path = MyConfig.v2path;
    var username =MyConfig.username;
    var password = MyConfig.password;
    var g_Radios, g_PercentMax = 100;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    function showAUth(oRowdata, sName){
        function onCancel()
        {
            if(oRowdata.authType == 1||oRowdata.authType==getRcText ("AUTH_Status").split(",")[1]){
                oRowdata.authType = 1;
                $("#other_auth").addClass("hide");
            }else{
                oRowdata.authType = 2;
                $("#other_auth").removeClass("hide");
            }
            if(oRowdata.isEnableAccount==0||oRowdata.isEnableAccount==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableAccount = 0;
            }else{
                oRowdata.isEnableAccount = 1;
            }
            if(oRowdata.isEnableSms==0||oRowdata.isEnableSms==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableSms = 0;
            }else{
                oRowdata.isEnableSms = 1
            }
            if(oRowdata.isEnableWeixin==0||oRowdata.isEnableWeixin==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableWeixin = 0;
            }else{
                oRowdata.isEnableWeixin = 1;
            }
            if(oRowdata.isWeixinConnectWifi==0||oRowdata.isWeixinConnectWifi==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isWeixinConnectWifi = 0;
            }else{
                oRowdata.isWeixinConnectWifi = 1;
            }
            if(oRowdata.nosension=="0"){
                oRowdata.feelauth = "0";
                $("#anthTime").addClass("hide");
            }else{
                oRowdata.feelauth = "1";
                oRowdata.unauthtime = oRowdata.nosension;
                $("#anthTime").removeClass("hide");
            }
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            return false;
        }

        function onSubmitSSID()
        {
            function onSuccess(){
                if(sName == "add")
                {
                    Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                }
                Utils.Base.refreshCurPage();
               // authListData();
            }
            var oTempTable = {
                index:[],
                column:["authCfgTemplateName","authType","isEnableSms","isEnableWeixin","isWeixinConnectWifi","isEnableAccount","feelauth","unauthtime",
                    "ONLINE_MAX_TIME","URL_AFTER_AUTH","IDLE_CUT_TIME","IDLE_CUT_FLOW","NO_SENSATION_TIME"]
            };
            var oStData = jFormSSID.form ("getTableValue", oTempTable);
            var authData={
                ownerName:FrameInfo.g_user.attributes.name,
                isEnableAli:0,
                isEnableQQ:0,
                uamAuthParamList:[
                    {authParamName:"ONLINE_MAX_TIME",authParamValue:oStData.ONLINE_MAX_TIME},
                    {authParamName:"URL_AFTER_AUTH",authParamValue:oStData.URL_AFTER_AUTH},
                    {authParamName:"IDLE_CUT_TIME",authParamValue:oStData.IDLE_CUT_TIME},
                    {authParamName:"IDLE_CUT_FLOW",authParamValue:oStData.IDLE_CUT_FLOW},
                    {authParamName:"NO_SENSATION_TIME",authParamValue:oStData.unauthtime}
                ]
            };
            if(oStData.unauthtime && oStData.unauthtime.charAt(0) == '0' && oStData.unauthtime.length == 2)
            {
                oStData.unauthtime = oStData.unauthtime.charAt(1);
            }
            if(oStData.feelauth==0){
                oStData.NO_SENSATION_TIME="0";
                delete oStData.feelauth;
            }
            if(oStData.feelauth==1&&oStData.unauthtime){
                oStData.NO_SENSATION_TIME=oStData.unauthtime;
                delete oStData.feelauth;
                delete oStData.unauthtime;
            }
            if(oStData.authType=="1"){
                oStData.isEnableSms =0;
                oStData.isEnableAccount=0;
                oStData.isEnableWeixin=0;
                oStData.isWeixinConnectWifi=0;
            }

            var url=v2path;
            if(sName == "add"){
                url +="/authcfg/add"
            }else{
                url +="/authcfg/modify"
               /* authData.isEnableWeixin=oStData.isEnableWeixin;
                delete oStData.isEnableWeixin;*/
            }
            var requestData= $.extend(authData,oStData);
            if(requestData.authType=="2" && requestData.isEnableAccount=="0" && requestData.isEnableSms=="0" && requestData.isEnableWeixin=="0" && requestData.isWeixinConnectWifi=="0")
            {
                Frame.Msg.info("用户必须进行一种认证","error");
            }else{
                var authcfgOpt = {
                    type: "POST",
                    url: url,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(requestData),
                    onSuccess: authcfgSuc,
                    onFailed: authcfgFail
                }

                function authcfgSuc(data){
                    console.log("sec1");
                    if(data.errorcode == 1105)
                    {
                        Frame.Msg.info("该认证模板已存在","error");
                        return;
                    }
                    if(data.errorcode == 1107)
                    {
                        Frame.Msg.info("无感知时长启用后取值范围为1-30","error");
                        return;
                    }
                    if(data.errorcode == 1101)
                    {
                        Frame.Msg.info("允许上网时长必须为纯数字且在60-86400之间","error");
                        return;
                    }
                    if(data.errorcode == 1102)
                    {
                        Frame.Msg.info("url格式为http://或https://","error");
                        return;
                    }
                    if(data.errorcode == 1103)
                    {
                        Frame.Msg.info("闲置切断时长（分）不得超过上网时长（秒）且为纯数字","error");
                        return;
                    }
                    if(data.errorcode == 1104)
                    {
                        Frame.Msg.info("闲置切断流量为纯数字且在1-1024000之间","error");
                        return;
                    }
                    if(data.errorcode==1001){
                        Frame.Msg.info("认证模板不能为空","error");
                        return;
                    }
                    if(data.errorcode==0){
                        onSuccess();
                        Frame.Msg.info("配置成功");
                    }
                    else{
                        Frame.Msg.info(data.errorcode,"error");
                    }
                }

                function authcfgFail(){
                    console.log("fail1");
                }

                Utils.Request.sendRequest(authcfgOpt);
            }
        }
        var jFormSSID = $("#toggle_form");
        if(sName == "add") //Add
        {
            var jDlg = $("#AddAuthTempDlg");
            if(jDlg.children().length)
            {
                $("#authToggle").show().insertAfter($(".modal-header",jDlg));
            }
            else
            {
                $("#authToggle").show().appendTo(jDlg);
            }

            jFormSSID.form("init", "edit", {"title":getRcText("ADD_TITLE"),"btn_apply": onSubmitSSID});
            $("#authname",jFormSSID).removeAttr("disabled");
            $("#anthTime").removeClass("hide");
            $("#other_auth").addClass("hide");
            jFormSSID.form("updateForm",{
                authCfgTemplateName : "",
                authType : "1",
                isEnableSms:"0",
                isEnableWeixin:"0",
                isWeixinConnectWifi:"0",
                isEnableAccount:"1",
                feelauth:"1",
                unauthtime:"7"
            });
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
        }
        else //Edit
        {
            jFormSSID.form ("init", "edit", {"btn_apply": onSubmitSSID, "btn_cancel":onCancel});
           $("#authname",jFormSSID).attr("disabled","disabled");
            if(oRowdata.authType == 1||oRowdata.authType==getRcText ("AUTH_Status").split(",")[1]){
                oRowdata.authType = 1;
                $("#other_auth").addClass("hide");
            }else{
                oRowdata.authType = 2;
                $("#other_auth").removeClass("hide");
            }
            if(oRowdata.isEnableAccount==0||oRowdata.isEnableAccount==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableAccount = 0;
            }else{
                oRowdata.isEnableAccount = 1;
            }
            if(oRowdata.isEnableSms==0||oRowdata.isEnableSms==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableSms = 0;
            }else{
                oRowdata.isEnableSms = 1
            }
            if(oRowdata.isEnableWeixin==0||oRowdata.isEnableWeixin==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableWeixin = 0;
            }else{
                oRowdata.isEnableWeixin = 1;
            }
            if(oRowdata.isWeixinConnectWifi==0||oRowdata.isWeixinConnectWifi==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isWeixinConnectWifi = 0;
            }else{
                oRowdata.isWeixinConnectWifi = 1;
            }

            if(oRowdata.NO_SENSATION_TIME=="0"){
                oRowdata.feelauth = "0";
                $("#anthTime").addClass("hide");
            }else{
                oRowdata.feelauth = "1";
                oRowdata.unauthtime = oRowdata.NO_SENSATION_TIME;
                $("#anthTime").removeClass("hide");
            }

            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
        }
    }

    function onDelSSID(oData)
    {
        var authcfgDelOpt = {
            type: "post",
            url: v2path+"/authcfg/delete",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({ownerName:FrameInfo.g_user.attributes.name,"authCfgTemplateName":oData.authCfgTemplateName}),
            onSuccess: authcfgDelSuc,
            onFailed: authcfgDelFail
        }

        function authcfgDelSuc(data){
            if(data.errorcode == "1109")
            {
                Frame.Msg.info("该认证模板已经被绑定，不能删除","error");
            }else if(data.errorcode == "0") {
                Frame.Msg.info("删除成功");
            }else{
                Frame.Msg.info(data.errormsg||"删除失败","error");
            }
            Utils.Base.refreshCurPage();
            // authListData();
        }

        function authcfgDelFail(){
            console.log("fail4");
        }

        Utils.Request.sendRequest(authcfgDelOpt);
    }

    function initData(jScope)
    {
      //  alert(FrameInfo.g_user.user)
        authListData();
    }
    function authListData(){

        var authdata  = [];
        var authcfgQueryOpt = {
            type: "GET",
            url: v2path+"/authcfg/query",
            contentType:"application/json",
            dataType:"json",
            data:{"ownerName":FrameInfo.g_user.attributes.name},
            onSuccess: authcfgQuerySuc,
            onFailed: authcfgQueryFail
        }

        function authcfgQuerySuc(data){
            if(data.errorcode == 0){
                $.each(data.data,function(key,value){
                    var authTemplate={};

                    authTemplate.authCfgTemplateName=value.authCfgTemplateName;
                    if(value.authType==1){
                        authTemplate.authType = getRcText ("AUTH_Status").split(",")[1];
                    }else{
                        authTemplate.authType = getRcText ("AUTH_Status").split(",")[0];
                    }
                    authTemplate.isEnableSms=getRcText ("AUTH_Status").split(",")[value.isEnableSms];
                    authTemplate.isEnableWeixin=getRcText ("AUTH_Status").split(",")[value.isEnableWeixin];
                    authTemplate.isWeixinConnectWifi=getRcText ("AUTH_Status").split(",")[value.isWeixinConnectWifi];
                    authTemplate.isEnableAccount=getRcText ("AUTH_Status").split(",")[value.isEnableAccount];
                    authTemplate.ONLINE_MAX_TIME=value.uamAuthParamList[0].authParamValue;
                    authTemplate.URL_AFTER_AUTH=value.uamAuthParamList[1].authParamValue;
                    authTemplate.IDLE_CUT_TIME=value.uamAuthParamList[2].authParamValue;
                    authTemplate.IDLE_CUT_FLOW=value.uamAuthParamList[3].authParamValue;
                    authTemplate.NO_SENSATION_TIME=value.uamAuthParamList[4].authParamValue;

                    authdata.push(authTemplate);
                })
                $("#authList").SList ("refresh", authdata);
            }else {
                //TODO errorcode处理
                //   Frame.Msg.error("查询数据异常");

            }
        }

        function authcfgQueryFail(){
            console.log("fail6");
        }

        Utils.Request.sendRequest(authcfgQueryOpt);

    }

    function initGrid()
    {
        var optauth = {
            colNames: getRcText ("SSID_HEADER"),
            multiSelect: false,
            colModel: [
                {name:'authCfgTemplateName', datatype:"String"},
                {name:'authType', datatype:"String"},
                {name:'isEnableSms', datatype:"String"},
                {name:'isEnableWeixin', datatype:"String"},
                {name:'isWeixinConnectWifi', datatype:"String"},
                {name:'isEnableAccount', datatype:"String"}
            ],
            onToggle : {
                action : showAUth,
                jScope : $("#authToggle"),
                BtnDel : {
                    show : true,
                    action : onDelSSID
                }
            },
            buttons:[
                {name: "add", action: showAUth}
            ]
        };
        $("#authList").SList ("head", optauth);

    }

    function initForm(){
        $("#simpledraw").on("click",function(){
            Frame.Util.openpage(
                {
                    pageURL:"http://lvzhou.h3c.com"+this.value,
                    height:"500px",
                    hotkeys:"no"
                })
            return false;
        });
        $("#feelauth1").on("click",function(){
            $(this).attr("checked","true");
            $("#anthTime").removeClass("hide");
        })
        $("#feelauth2").on("click",function(){
            $(this).attr("checked","true");
            $("#anthTime").addClass("hide");
        })
        $("#authType2").on("click",function(){
            $(this).attr("checked","true");
            $("#other_auth").removeClass("hide");
        })
        $("#authType1").on("click",function(){
            $(this).attr("checked","true");
            $("#other_auth").addClass("hide");
        })

        //链接详情页面
        $("#detail").on("click", function(){
            Utils.Base.redirect ({np:"auth.drawpage"});
            return false;
        });
    }
    function _init ()
    {
        initGrid();
        initData();
        initForm();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_PercentMax = 100;
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form","Toggle"],
        "utils": ["Base","Request"]
    });
}) (jQuery);

