/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "faultlog.faultlog";
    var rc_info = "faultLog_rc";
    var g_jForm,g_oPara;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    function editTest(){
        alert(1);
    }
     function redirectStroe(){
       
        // Utils.Base.redirect ({np:""});
    }
  
    function initGrid()
    {   
         var opt = {
            colNames: getRcText ("faultLog_HEADER"),
            showOperation:true,
            pageSize:10,
            colModel: [
                {name:'date',ype:"String",formatter:showLink},
                {name:'faultType', datatype:"String"},
                {name:'faultDescription',datatype:"String"},
                {name:'state',datatype:"String"},
            ],
            buttons:[
                {name:"edit",enable:true,action:editTest},
                {name:"redirect",value:getRcText("redirectBtn"),action:redirectStroe},
                //{name:"delete",enable:false}
             ]
        };
        $("#faultLogList").SList ("head", opt);
    }

    function showLink(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";
        if("text" == type)
        {
            return value;
        }

        return '<a class="list-link">'+value+'</a>'; 
    }

    function initData()
    {   
       var data = [
            {date:"2016.01.01",faultType:"0129",faultDescription:"Down",state:"未解决"}
            ,{date:"2016.01.01",faultType:"0129",faultDescription:"Down",state:"未解决"}
        ];
        $("#faultLogList").SList ("refresh", data);
    }

    function onDisDetail(){
        Utils.Base.openDlg(null, {}, {scope:$("#faultModal"),className:"modal-super dashboard"});
    }

    function onOk(){
        console.log("1");
    }

    function initForm()
    {
        $("#filter_faultLog").click(function () {
            $("#faultLog_block").toggle();
        });

        $("#faultLogList").on('click', 'a.list-link', onDisDetail);
        
        // $("#faultModal").form ("init", "edit", {title : getRcText("RENAME_TITLE"),"btn_apply": onOk});
    }

    function _init(oPara)
    {
        initGrid();
        initData();
        initForm();
    };

    function _destroy()
    {
        MODULE_NAME = null;
    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList"],
        "utils": ["Base"]
    });
}) (jQuery);
