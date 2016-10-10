/* global Frame */
/* global FrameInfo */
/**
 * Created by Administrator on 2015/11/26.
 */
(function ($)
{
    var MODULE_NAME = "wireless.v3";
    var g_Radios, g_PercentMax = 100;
    
    // 对Date的扩展，将 Date 转化为指定格式的String   
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
    // 例子：   
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
    Date.prototype.format = function(fmt)   { //author: meizz   
        var o = {   
            "M+" : this.getMonth()+1,                 //月份   
            "d+" : this.getDate(),                    //日   
            "h+" : this.getHours(),                   //小时   
            "m+" : this.getMinutes(),                 //分   
            "s+" : this.getSeconds(),                 //秒   
            "q+" : Math.floor((this.getMonth()+3)/3), //季度   
            "S"  : this.getMilliseconds()             //毫秒   
        };   
        if(/(y+)/.test(fmt))   
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
        for(var k in o)   
            if(new RegExp("("+ k +")").test(fmt))   
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
        return fmt;   
    }
   

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName).split(",");
    }
    


    function loginSSIDList(){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                configType : 1,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method : "SSidListGet",
                param : {devSN:FrameInfo.ACSN}
            })
        })
    }
    function initData(jScope){

        var aSsidHide = getRcText("SSID_HIDE");
        var aCipherSuite = getRcText("CIPHER_SUITE");
        var aStatus = getRcText("STATUS");

        var oSsidHide = {
            "0":aSsidHide[0],
            "1":aSsidHide[1]
        }

        var oCipherSuite = {
            "0":aCipherSuite[0],
            "16":aCipherSuite[1],
        }
        var oStatus = {
            "1":aStatus[0],
            "2":aStatus[1]
        }

        loginSSIDList().done(function(data, textStatus, jqXHR){
            if (("errorcode" in data) && (data.errorcode != 0)){
                return;
            }
            var loginPageList = [];
            var loginPageArr = data.result || [];
            $.each(loginPageArr,function(key,value){
                var loginPage = {};
                loginPage.ssidName = value.ssidName,
                loginPage.hideSSID = oSsidHide[value.hideSSID];
                loginPage.maxSendRatio = value.maxSendRatio || 0;
                loginPage.maxReceiveRatio = value.maxReceiveRatio || 0;
                loginPage.cipherSuite = oCipherSuite[value.cipherSuite];
                loginPage.status = oStatus[value.status];
                loginPageList.push(loginPage);
            })
            $("#ssidList").SList("refresh",loginPageList);
        })
    }



    function SSIDUpdate(sStName,sSSID_name,bStatus,bHide,bEncrypt,sPsk,bMode,bSecurity,nMaxSendRatio,nmaxReceiveRatio)
    {
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method: "SSIDUpdate",
                param:[{
                    stName: sStName || "",
                    ssidName: sSSID_name || "",
                    status: bStatus,
                    hideSSID: bHide,
                    cipherSuite: bEncrypt,
                    psk: sPsk || "",
                    akmMode: bMode,
                    securityIE : bSecurity,
                    maxSendRatio: nMaxSendRatio,
                    maxReceiveRatio: nmaxReceiveRatio
                }]
               
            })
        })


    }
    function SSIDUpdate_2(sStName,sSSID_name,bStatus,bHide,bEncrypt,nMaxSendRatio,nmaxReceiveRatio)
    {
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method: "SSIDUpdate",
                param:[{
                    stName: sStName || "",
                    ssidName: sSSID_name || "",
                    status: bStatus,
                    hideSSID: bHide,
                    cipherSuite: bEncrypt,
                    maxSendRatio: nMaxSendRatio,
                    maxReceiveRatio: nmaxReceiveRatio
                }]
               
            })
        })


    }

    function bingSSIDByAPgroup(stName){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method : "SSIDBindByAPGroup",
                param :[ 
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712",
                        radioId         :   1,
                        stName       :   stName
                     },
                     {
                        apGroupName:"default-group",
                        apModelName:"WTU430",
                        radioId         :   1,
                        stName       :   stName
                     },
                     {
                        apGroupName:"default-group",
                        apModelName:"WAP712",
                        radioId         :   2,
                        stName       :   stName
                     },
                     {
                        apGroupName:"default-group",
                        apModelName:"WTU430",
                        radioId         :   2,
                        stName       :   stName
                     }
                 ]
            })
        });  
    }

    function getApModel(){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "apmgr",
                deviceModule : "apmgr",
                method : "AddApGroupModel",
                param : [{apGroupName:"default-group",apModel:"WTU430"},
                        {apGroupName:"default-group",apModel:"WAP712"}]

            })
        });  
    }

    function getRandomString(len) {  
        len = len || 32;  
        var $chars = 'abcdefhijkmnprstwxyz2345678';  
        var maxPos = $chars.length;  
        var pwd = '';  
        for (i = 0; i < len; i++) {  
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));  
        }  
        return pwd;  
    }  
    function portalEnable_0(stName){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "portal",
                deviceModule : "portal",
                method : "setSimpleConfig",
                param : [
                        {
                            stname:stName,
                            enable:0,
                            webserver:"",
                            domain:""
                        }]

            })
        });  
    }
    function portalEnable_1(stName){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "portal",
                deviceModule : "portal",
                method : "setSimpleConfig",
                param : [
                        {
                            stname:stName,
                            enable:1,
                            webserver:"lvzhou-server",
                            domain:"cloud"
                        }]

            })
        });  
    }
    function onCfgAddSsid()
    {
        getApModel().done(function(data, textStatus, jqXHR){
            if(("error_code" in data) && (data.error_code != 0)){
                return;
            }
            var stName = getRandomString(5);
            if(data.communicateResult == "success" && data.serviceResult == "success")
            {
                var addForm = $("#AddSsidForm");
                var sStName = stName;
                var sSSID_name = $("#ssid_name", addForm).val();
                var bStatus = Number($(":input[name=status]", addForm).MRadio("getValue"));
                var bHide = Number($(":input[name=hideSSID]", addForm).MRadio("getValue"));
                var bEncrypt =Number($(":input[name=cipherSuite]", addForm).MRadio("getValue"));
                var portal = Number($(":input[name=portal_policy_status]", addForm).MRadio("getValue"));
                var nMaxSendRatio = Number($("#maxSendRatio", addForm).val());
                var nmaxReceiveRatio = Number($("#maxReceiveRatio", addForm).val());
                if(portal == 0)
                {
                    portalEnable_0(sStName).done(function(data, textStatus, jqXHR){
                         if(("errorcode" in data) && (data.errorcode != 0)){
                            return;
                        }                       
                    })
                    
                }
                else
                {
                    portalEnable_1(sStName).done(function(data, textStatus, jqXHR){
                         if(("errorcode" in data) && (data.errorcode != 0)){
                            return;
                        } 
                    })
                }
                if(bEncrypt == "16")
                {
                    var sPsk = $("#psk", addForm).val();
                    var bMode = 1;
                    var bSecurity = 1;
                    
                    SSIDUpdate(sStName,sSSID_name,bStatus, bHide, bEncrypt,sPsk, bMode, bSecurity,
                    nMaxSendRatio, nmaxReceiveRatio).done(function(data, textStatus, jqXHR){
                    if(data.communicateResult == "success" && data.serviceResult == "success")
                        bingSSIDByAPgroup(stName).done(function(data, textStatus, jqXHR){
                            if(data.communicateResult == "success" && data.serviceResult == "success")
                            {
                                onCancelAddSsid();
                                initData();
                                Utils.Base.refreshCurPage();
                            }

                        })
                    })
                }
                else
                {
                    SSIDUpdate_2(sStName,sSSID_name,bStatus, bHide, bEncrypt,nMaxSendRatio,nmaxReceiveRatio).done(function(data, textStatus, jqXHR){
                        if(data.communicateResult == "success" && data.serviceResult == "success")
                            bingSSIDByAPgroup(stName).done(function(data, textStatus, jqXHR){
                            if(data.communicateResult == "success" && data.serviceResult == "success")
                            {
                                onCancelAddSsid();
                                initData();
                                Utils.Base.refreshCurPage();
                            }

                        })
                    })
                }
                

               
            }
        }) 
    }

    function onCancelAddSsid()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddSsidDlg")));
        $("#AddSsidForm").form("updateForm",{
            // stName: "",

            ssid_name: "",
            hideSSID: 0,
            maxSendRatio: 0,
            maxReceiveRatio: 0,
            cipherSuite: 0,
            status: 2,
            portal_policy_status: 0
        })
    }

    function onAddSSID()
    {
        var addForm = $("#AddSsidForm");
        addForm.form("init", "edit", {"title":getRcText("ADD_TITLE"), "btn_apply":onCfgAddSsid});
        $("input[name=cipherSuite]", addForm).on("change", function(){
            if($(":input[name=cipherSuite]", addForm).MRadio("getValue") == "16")
            {
                $("#passwordHide", addForm).show();
            }
            else{
                $("#passwordHide", addForm).hide();
            }
        })

        Utils.Base.openDlg(null, null,{scope:$("#AddSsidDlg"), className:"modal-large"});
    }

    function SSIDUnbindByAPGroup(stName){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method : "SSIDUnbindByAPGroup",
                param : [
                {
                    apGroupName:"default-group",
                    apModelName:"WAP712",
                    radioId : 1,
                    stName : stName  
                },
                {
                    apGroupName:"default-group",
                    apModelName:"WTU430",
                    radioId : 1,
                    stName : stName  
                },
                {   
                    apGroupName:"default-group",
                    apModelName:"WAP712",
                    radioId:2,
                    stName : stName 

                },
                {   
                    apGroupName:"default-group",
                    apModelName:"WTU430",
                    radioId:2,
                    stName : stName 

                }               
                ]

            })
        }); 
    }
    function  SSIDDelete(stName){
    return $.ajax({
        type: "POST",
        url: MyConfig.path+"/ant/confmgr",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            devSN : FrameInfo.ACSN,
            configType : 0,
            cloudModule : "stamgr",
            deviceModule : "stamgr",
            method : "SSIDDelete",
            param : [
                {stName: stName}
            ]

        })
    }); 
    }
    function onDelSSID(oData)
    {
        loginSSIDList().done(function(data, textStatus, jqXHR){
        if (("errorcode" in data) && (data.errorcode != 0)){
            return;
        }
        var stNameList = {}
        var ssidName = oData.ssidName;
        var ssidList = data.result;
        $.each(ssidList,function(key,value){
            stNameList[value.ssidName] = value.stName;
        });
        var stName = stNameList[ssidName];
        SSIDUnbindByAPGroup(stName).done(function(data, textStatus, jqXHR){
            if(data.communicateResult == "success" && data.serviceResult == "success")
            {
                SSIDDelete(stName).done(function(data, textStatus, jqXHR){
                   if (("errorcode" in data) && (data.errorcode != 0)){
                        return;
                    } 
                    else
                    {
                        Utils.Base.refreshCurPage();
                    }
                })
            }
        })
        
    })
        

    }
    function initGrid()
    {
        var optSsid = {
            colNames: getRcText ("SSID_HEADER"),
            multiSelect: false,
            showOperation: false,
            colModel: [
                {name:"ssidName", datatype:"String"},
                {name:"hideSSID", datatype:"int"},
                {name:"maxSendRatio", datatype:"int"},
                {name:"maxReceiveRatio", datatype:"int"},
                {name:"cipherSuite", datatype:"int"},
                {name:"status", datatype:"String"},
            ],
            onToggle : {
                // action : showSSID,
                jScope : $("#ssidToggle"),
                BtnDel : {
                    show : true,
                    action : onDelSSID
                }
            },
            buttons:[
                {name: "add", action: onAddSSID}
            ]

        };
        $("#ssidList").SList ("head", optSsid);
 
    }
    

    function _init ()
    {
        initGrid();
        initData();
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
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Base"]
    });

}) (jQuery);
