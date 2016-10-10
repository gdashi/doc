/**
 * Created by Administrator on 2016/5/31.
 */
(function ($)
{
    var MODULE_NAME = "auth.pagetemplate";
    var v2path = MyConfig.v2path;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    function pageListData() {
        var aPageModelData = [];
        var themetemplateQueryOpt = {
            type: "GET",
            url: v2path + "/themetemplate/query?ownerName=" + FrameInfo.g_user.attributes.name,
            contentType: "application/json",
            dataType: "json",
            onSuccess: themetemplateQuerySuc,
            onFailed: themetemplateQueryFail
        }

        function themetemplateQuerySuc(data) {
            if (data.errorcode == 0) {
                $.each(data.data, function (key, value) {
                    var PageTemplate = {}
                    PageTemplate.themeName = value.themeName;
                    PageTemplate.description = value.description;
                    PageTemplate.simpledraw = "/o2o/uam/theme/" + value.pathname + "/draw.xhtml?templateId=" + value.id + "&type=1";
                    aPageModelData.push(PageTemplate);
                })
                $("#pageList").SList("refresh", aPageModelData);
            } else {
                //TODO errorcode处理
                Frame.Msg.info("查询数据异常", "error");

            }
        }

        function themetemplateQueryFail() {
            console.log("fail7");
        }

        Utils.Request.sendRequest(themetemplateQueryOpt);
    }

    function onDelPage(oData)
    {
        var themetemplateDelOpt = {
            type: "POST",
            url: v2path+"/themetemplate/delete",
            //username: username,
            //password: password,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "ownerName":FrameInfo.g_user.attributes.name,
                "themeName": oData.themeName,
                "description":oData.description
            }),
            onSuccess: themetemplateDelSuc,
            onFailed: themetemplateDelFail
        }

        function themetemplateDelSuc(data){
            if(data.errorcode == "60015")
            {
                Frame.Msg.info("该页面模板已经被绑定，不能删除","error");
            }
            else if(data.errorcode == "0"){
                Frame.Msg.info("删除成功");
            }else{
                Frame.Msg.info(data.errormsg||"删除失败","error");
            }
            Utils.Base.refreshCurPage();
        }

        function themetemplateDelFail(){
            console.log("fail5");
        }

        Utils.Request.sendRequest(themetemplateDelOpt);
    }

    function showPage(oRowdata, sName){
        function onCancel()
        {
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            return false;
        }

        function onSubmitSSID()
        {
            var themetemplateAddOpt = {
                type: "POST",
                url: v2path+"/themetemplate/add",
                //username: username,
                //password: password,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "ownerName": FrameInfo.g_user.attributes.name,
                    "themeName": $("#themeName").val(),
                    "description": $("#description").val(),
                }),
                onSuccess: themetemplateAddSuc,
                onFailed: themetemplateAddFail
            }

            function themetemplateAddSuc(data){
                if(data.errorcode==0){
                    Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                    pageListData();
                    // Utils.Base.refreshCurPage();
                    Frame.Msg.info("配置成功");
                }else if(data.errorcode==1201){
                    Frame.Msg.info("增加页面模板名称已经存在","error");
                }else if(data.errorcode==1001){
                    Frame.Msg.info("页面模板名称不能为空","error");
                }
            }

            function themetemplateAddFail(){
                console.log("fail2");
            }

            Utils.Request.sendRequest(themetemplateAddOpt);
        }

        function onSubmitEditPageModel()
        {
            var themetemplateModifyOpt = {
                type: "POST",
                url: v2path+"/themetemplate/modify",
                //username: username,
                //password: password,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "ownerName":FrameInfo.g_user.attributes.name,
                    "themeName": $("#themeName").val(),
                    "description": $("#description").val(),
                }),
                onSuccess: themetemplateModifySuc,
                onFailed: themetemplateModifyFail
            }

            function themetemplateModifySuc(data){
                Utils.Base.refreshCurPage();
                Frame.Msg.info("配置成功");
            }

            function themetemplateModifyFail(){
                console.log("fail3");
            }

            Utils.Request.sendRequest(themetemplateModifyOpt);
        }
        var jFormSSID = $("#pagetoggle_form");
        var pageName = sName;

        if(pageName == "add") //Add
        {
            var jDlg = $("#AddPageTempDlg");
            $("#themeName",jFormSSID).attr("readonly",false);
            $($(".col-sm-6 .form-group .col-sm-9",jFormSSID)[2]).addClass("hide");
            if(jDlg.children().length)
            {
                $("#pageToggle").show().insertAfter($(".modal-header",jDlg));
            }
            else
            {
                $("#pageToggle").show().appendTo(jDlg);
            }

            jFormSSID.form("init", "edit", {"title":getRcText("ADDPAGE_TITLE"),"btn_apply": onSubmitSSID});
            //清空默认配置
            jFormSSID.form("updateForm",{
                themeName:"",
                description:"",
                pagemodel:"1"
            });
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
        }
        else //Edit
        {
            $($(".col-sm-6 .form-group .col-sm-9",jFormSSID)[2]).removeClass("hide");
            jFormSSID.form ("init", "edit", {"btn_apply": onSubmitEditPageModel, "btn_cancel":onCancel});
            $("#themeName",jFormSSID).attr("readonly",true);
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
        }
    }

    function initGrid() {
        var optpage = {
            colNames: getRcText("Page_HEADER"),
            multiSelect: false,
            //  pageSize:2,
            colModel: [
                {name: 'themeName', datatype: "String"},
                {name: 'description', datatype: "String"}
            ],
            onToggle: {
                action: showPage,
                jScope: $("#pageToggle"),
                BtnDel: {
                    show: true,
                    action: onDelPage
                }
            },
            buttons: [
                {name: "add", action: showPage}
            ]
        };
        $("#pageList").SList("head", optpage);
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

    function initData(jScope)
    {
        pageListData();
    }

    function _init ()
    {
        initGrid();
        initData();
        initForm();
    }

    function _destroy()
    {

    }
    function _resize(jParent)
    {
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Base","Request"]
    });
})(jQuery);