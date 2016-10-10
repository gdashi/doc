;(function ($) {
var MODULE_NAME = "dashboard.changepassword";
var FORM_NAME = "#changepassword_form";

function getRcText(sRcId) {
    return Utils.Base.getRcString("change_password_rc", sRcId);
}

function _doChange() {
    var jForm = $(FORM_NAME);
    var oldPassword = $("#oldpassword").val();
    var sPassword = $("#password").val();
    var sRepeat = $("#repeat").val();

    function onSuccess() {
        Utils.Pages.closeWindow(Utils.Pages.getWindow(jForm));    
    }

    if(sPassword != sRepeat) {
        Utils.Widget.setError($("#password"),getRcText("message"));
        return false;
    }

    function setPwdOptSuc(data) {
        onSuccess();
        data.error_code == 1? Frame.Msg.error(data.error_message):Frame.Msg.info("修改成功");
    }

    function setPwdOptFail(err){

    }

    var setPwdOpt = {
        type: "POST",
        url: MyConfig.v2path+"/sso/modifyPwd",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "user_name":FrameInfo.g_user.attributes.name,
            "old_password":oldPassword,
            "new_password":sPassword,
        }),
        onSuccess:setPwdOptSuc,
        onFailed:setPwdOptFail
    };

    Utils.Request.sendRequest(setPwdOpt);
}

function initForm()
{
    var oEdit =  {"title": getRcText("title"), "btn_apply": _doChange};
    $(FORM_NAME).form("init", "edit", oEdit);
}

function _init(oData)
{   
    initForm(); 
}

function _destroy()
{
    Utils.Request.clearMoudleAjax(MODULE_NAME);
}

Utils.Pages.regModule(MODULE_NAME,
    {
     "init": _init,
     "destroy": _destroy,
     "widgets": ["Form"],
     "utils":["Request","Base"]
    });
})(jQuery);