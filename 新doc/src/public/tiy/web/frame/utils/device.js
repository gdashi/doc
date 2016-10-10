;(function($)
{
    var UTILNAME = "Device";

    var oDevice= {

    }

    function onGetDevriceInfo()
    {
        $.ajax({
            url: MyConfig.v2path+"/getDeviceInfo",
            type: "POST",
            headers:{Accept:"application/json"},
            contentType: "application/json",
            data: JSON.stringify({"tenant_name": FrameInfo.g_user.attributes.name, "dev_snlist":[FrameInfo.ACSN]}),
            dataType: "json",
            success: function(data){
               // console.log(data);
                oDevice.deviceInfo = data.dev_list[0] ;
                Utils.regUtil(UTILNAME, oDevice, {"widgets": [], "utils":[]});
            },
            error:function(err){
                //alert(err);
            }
        });


    }

    Utils.loadUtil("", onGetDevriceInfo);
})(jQuery);