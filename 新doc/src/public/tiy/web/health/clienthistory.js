/**
 * Created by Administrator on 2016/5/25.
 */
(function($){

    var MODULE_BASE = "health";
    var MODULE_NAME = MODULE_BASE + ".clienthistory";

    function getRcText(sRcName){
        return Utils.Base.getRcString("terminal_rc", sRcName);
    }

    function initGrid(){

        var opt_clientHistoryHead = {
            colNames:getRcText('clientHistory'),
            showHeader: true,
            multiSelect:false,
            pageSize:5,
            colModel:[
                {name:"time",datatype:"String",width:110},
                {name:"MacAddress",datatype:"String",width:80},
                {name:"IpAddress",datatype:"String",width:80},
                {name:"Ssid",datatype:"String",width:70},
                {name:"ApName",datatype:"String",width:80},
                {name:"type",datatype:"String",width:60},
                {name:"reason",datatype:"String",width:80}
            ]
        };
        $("#clientHistory_slist").SList("head",opt_clientHistoryHead);
    }


    /*获取终端上下线历史*/
    function getClientHistory(){

        var clientOpt = {
            url: MyConfig.path +"/diagnosis_read/history/clienthistory?devSN="+FrameInfo.ACSN,
            type:'get',
            dataType:'json',
            onSuccess:getClientHistorySuc,
            onFailed:getClientHistoryFail
        };
        Utils.Request.sendRequest(clientOpt);

        /*获取数据成功的回调*/
        function getClientHistorySuc(data){

            initClientHistory(data);
        }

        /*获取数据失败的回调*/
        function getClientHistoryFail(){

        }
    }

    /*将终端上下线历史显示到页面上*/
    function initClientHistory(data){

        var clientHistoryData_UpLine = [];
        var clientHistoryData_offLine = [];
        var j = 0;
        var clientData = [];

        for( var i = 0; i< data.length;i++,++j){

            clientHistoryData_UpLine[i] = {};
            clientHistoryData_UpLine[i].time = data[i].upLineDate;
            clientHistoryData_UpLine[i].MacAddress = data[i].clientMAC;
            clientHistoryData_UpLine[i].IpAddress = data[i].clientIP;
            clientHistoryData_UpLine[i].Ssid = data[i].clientSSID;
            clientHistoryData_UpLine[i].ApName = data[i].ApName;
            clientHistoryData_UpLine[i].type = "上线";
            clientHistoryData_UpLine[i].reason = "";

            clientHistoryData_offLine[i] = {};
            clientHistoryData_offLine[i].time = data[i].offLineDate;
            clientHistoryData_offLine[i].MacAddress = data[i].clientMAC;
            clientHistoryData_offLine[i].IpAddress = data[i].clientIP;
            clientHistoryData_offLine[i].Ssid = data[i].clientSSID;
            clientHistoryData_offLine[i].ApName = data[i].ApName;
            clientHistoryData_offLine[i].type = "下线";
            clientHistoryData_offLine[i].reason = "";

            clientData[j] = clientHistoryData_UpLine[i];
            clientData[++j] = clientHistoryData_offLine[i];
        }

        $("#clientHistory_slist").SList("refresh",clientData);
    }


    function initData(){
        getClientHistory();
    }

    function _init(){
        initGrid();
        initData();
    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","Form"],
        "utils": ["Base","Request"]
    });

})(jQuery);