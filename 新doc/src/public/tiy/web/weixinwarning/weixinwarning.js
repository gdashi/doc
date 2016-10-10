(function ($)
{
    var MODULE_NAME = "weixinwarning.weixinwarning";
    var rc_info = "weixinWarning_rc";
    var g_oTableData = {};
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
            colNames: getRcText ("weixinWarning_HEADER"),
            showOperation:true,
            pageSize:10,
            colModel: [
                {name:'date',datatype:"String",formatter:showLink},
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
        $("#weixinWarningList").SList ("head", opt);
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
        $("#weixinWarningList").SList ("refresh", data);
    }

    function onDisDetail(){
        Utils.Base.openDlg(null, {}, {scope:$("#modalDlg"),className:"modal-super dashboard"});
    }

     function onOk(){
        console.log("1");
    }

    function initForm()
    {
        var aData=["20","30","40","50","100",]

        $("#filter_weixinWarning").click(function () {
            $("#weixinWarning_block").toggle();
        });
        $("#weixinWarningList").on('click', 'a.list-link', onDisDetail);

        $("#Interface").singleSelect("InitData",aData);

        $("#switch").bind("switch-change",function(){
            $("#timer").toggle();
        })
        
        $("#mesSwitch").bind("switch-change",function(){
            $("#timerTwo").toggle();
        })

        $("#switchThree").bind("switch-change",function(){
            $("#noticeThree").toggle();
        })

        $("#switchFour").bind("switch-change",function(){
            $("#noticeFour").toggle();
        })

        $("#switchFive").bind("switch-change",function(){
            $("#noticeFive").toggle();
        })


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
        "widgets": ["SList","Switch","SingleSelect","DateRange"],
        "utils": ["Base"]
    });
}) (jQuery);
