
(function($){

    var MODULE_NAME = "configrestore.index";
    var g_oAllEvents = {};
    var g_nTotleData = 0;
    var g_firstfile = '';
    var g_ocfgdata_LastCfgSuc = {};
    var g_nAutoNum = 0;
    var g_nManualNum = 0;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("cfg_restore_rc", sRcName);
    }

    function unix_to_date(timestamp)
    {
        return $('#calendar').fullcalendar("getDate", new Date(timestamp * 1000));
    }
    function unix_to_time(timestamp)
    {
        return $('#calendar').fullcalendar("getTime", new Date(timestamp * 1000));
    }

    function date_to_unix(data)
    {
        var str = data.replace(/-/g,'/');
        var newstr = new Date(str);
        return newstr.getTime()/1000;
    }

    function initCalendar(aEvent)
    {
        //var curent = $('#calendar').fullcalendar("getDate");
        $('#calendar').fullcalendar("init",{
            monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            monthNamesShort:["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            dayNames: ["日", "一", "二", "三", "四", "五", "六"],
            dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
            monthYearFormat: 'YYYY年MMMM',
            height:460,
            buttonText:{
                showMonthAfterYear:true
            },
            events: aEvent,
            eventClick: function(seg, view) {
                $(".fc-day-grid a").each(function(){$(this).removeClass("eventClickedColor")});
                $(this).addClass("eventClickedColor");
                var stoday = seg.event.start._i;
                var aEvents = g_oAllEvents[stoday].aEvent;
               // Utils.Base.openDlg(null, {}, {scope:$("#eventdetail"),className:"modal-super dashboard"});
                $("#detail_info_list").SList ("refresh", aEvents);
            }
        });
        $(".fc-right .fc-today-button",$('#calendar')).hide();
    }

    function get_rollback_CfgFileSuc( Data )
    {
        var data = Data || [];
        if (("errorcode" in data) && (data.errorcode != 0)){
            return;
        }
        var aResult = data.result;
        var aEvents = [];
        var oResultdata = {};
        g_nTotleData = aResult.length;
        aResult.forEach(function(oResult){
            oResult.opType == 0 ? g_nAutoNum++ : g_nManualNum++;
            var sday = unix_to_date(oResult.createTime);
            var stime = unix_to_time(oResult.createTime);
            oResult.createTime = stime;
            if(oResultdata[sday])
            {
                oResultdata[sday].nNum += 1;
                oResultdata[sday].day = sday;
                oResultdata[sday].aEvent.push(oResult);
            }
            else{
                oResultdata[sday] = {};
                oResultdata[sday].aEvent = [];
                oResultdata[sday].day = sday;
                oResultdata[sday].nNum = 1;
                oResultdata[sday].aEvent.push(oResult);
            }
        });
        $.each(oResultdata, function(index, oEvent){
                var oData = {};
                oData.title = " ";
                oData.start = oEvent.day;
                aEvents.push(oData);
            });

            g_oAllEvents = oResultdata;
            // refreshFrame(nManualNum, g_nAutoNum);
            refreshFrame();
            initCalendar(aEvents);
            $(".fc-day-grid a").last().addClass("eventClickedColor");
           // $("#calendar").fullCalendar( 'addEventSource', ooo);        
    };

    function get_rollback_CfgFileFail()
    {

    };

    function getCfgFile()
    {
/*        return $.ajax({
            type: "POST",
            url: "/v3/ant/rollback",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                method: "getCfg",
                devSN: FrameInfo.ACSN
            })
        });*/
        var get_rollback_CfgFile = {
            type: "POST",
            url: "/v3/ant/rollback",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                method: "getCfg",
                devSN: FrameInfo.ACSN
            }),
            onSuccess: get_rollback_CfgFileSuc,
            onFailed: get_rollback_CfgFileFail            
        };
        Utils.Request.sendRequest( get_rollback_CfgFile );
    }

    function get_rollback_LastCfgSuc( Data )
    {
        var data = Data || [];
        if ((data.result == 'fail') || (data.result == undefined)){
            return;
        }
        var cfgdata = data.result;
        var times = unix_to_date(cfgdata.createTime)+" "+unix_to_time(cfgdata.createTime);
        var sday = unix_to_date(cfgdata.createTime);
        var aLastCfgEvent = g_oAllEvents[sday] && g_oAllEvents[sday].aEvent || [];
        $("#detail_info_list").SList("refresh", aLastCfgEvent);
        g_ocfgdata_LastCfgSuc = {
            totlefileNum: g_nTotleData,
            manualNum: g_nManualNum,
            autoNum:  g_nAutoNum,
            restoretime:times,
            fileName:cfgdata.fileName,
            CreateReason:cfgdata.reason
        };
        Utils.Base.updateHtml($("#cfg_restore_left"),g_ocfgdata_LastCfgSuc);
        
        getLastRollbackCfg();
    
    };

    function get_rollback_LastCfgFail()
    {

    };

    function getLastCfg()
    {
/*        return $.ajax({
            type: "POST",
            url: "/v3/ant/rollback",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                method: "getLastCfg",
                devSN: FrameInfo.ACSN
            })
        });*/

        var get_rollback_LastCfg = {
            type: "POST",
            url: "/v3/ant/rollback",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                method: "getLastCfg",
                devSN: FrameInfo.ACSN
            }),
            onSuccess: get_rollback_LastCfgSuc,
            onFailed: get_rollback_LastCfgFail            
        };
        Utils.Request.sendRequest( get_rollback_LastCfg );

    }

    function get_rollback_LastBackCfgSuc( Data )
    {
        var data = Data || [];
        if (data.result == 'fail'){
            return;
        }
        var rollbackdata = data.result;
        g_ocfgdata_LastCfgSuc = {
            RestoreReason:rollbackdata.reason,
            RestoreFile:rollbackdata.fileName,
            rollbackTime: unix_to_date(rollbackdata.rollbackTime)+" "+unix_to_time(rollbackdata.rollbackTime)
        };
        Utils.Base.updateHtml($("#cfg_restore_right"),g_ocfgdata_LastCfgSuc);
    };

    function get_rollback_LastBackCfgFail()
    {

    };

    function getLastRollbackCfg()
    {
/*        return $.ajax({
            type: "POST",
            url: "/v3/ant/rollback",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                method: "getLastRollbackCfg",
                devSN: FrameInfo.ACSN
            })
        });*/
        var get_rollback_LastBackCfg = {
            type: "POST",
            url: "/v3/ant/rollback",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                method: "getLastRollbackCfg",
                devSN: FrameInfo.ACSN
            }),
            onSuccess: get_rollback_LastBackCfgSuc,
            onFailed: get_rollback_LastBackCfgFail            
        };
        Utils.Request.sendRequest( get_rollback_LastBackCfg );
    }

    function get_rollbackSuc( Data )
    {
        var data = Data || [];

        if(data.result == 'fail')
        {
            Frame.Msg.info(data.reason);
        }
        else{

            Utils.Base.refreshCurPage();
            Frame.Msg.info("配置成功");
        }
    };

    function get_rollbackFail()
    {

    };

    function  onRemoveCfg(oData)
    {
/*        $.ajax({
            type: "POST",
            url:"/v3/ant/rollback",
            dataType:"json",
            contentType:"application/json",
            data: JSON.stringify({
                method:"deleteCfg",
                devSN: FrameInfo.ACSN,
                fileName:oData[0].fileName
            }),
            success: function(data){
                if(data.result == 'fail')
                {
                    Frame.Msg.info(data.reason);
                }
                else{

                    Utils.Base.refreshCurPage();
                    Frame.Msg.info("配置成功");
                }
            },
            error:function(err,status){
                //alert(err);
            }
        })*/

        var get_rollback = {
            type: "POST",
            url:"/v3/ant/rollback",
            dataType:"json",
            contentType:"application/json",
            data: JSON.stringify({
                method:"deleteCfg",
                devSN: FrameInfo.ACSN,
                fileName:oData[0].fileName
            }),
            onSuccess: get_rollbackSuc,
            onFailed: get_rollbackFail            
        };
        Utils.Request.sendRequest( get_rollback );
    }

    function get_rollbackCfgSuc( Data )
    {
        var data = Data || [];
        if(data.communicateResult == 'fail')
        {
            Frame.Msg.info(data.reason);
            return;
        }
        else{
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#cfgRestoreForm")));
            Utils.Base.refreshCurPage();
        }
    };

    function onRollbackCfg(odata)
    {
		$(".btn.btn-apply").addClass("disabled");
        var date = $('#calendar').fullcalendar("getDate");
        var nNow = date_to_unix(date);
/*        $.ajax({
            type: "POST",
            url:"/v3/ant/rollback",
            dataType:"json",
            contentType:"application/json",
            data:JSON.stringify({
                deviceModule: "ROLLBACK",
                method: "rollbackCfg",
                devSN: FrameInfo.ACSN,
                cfgTimeout: 60,
                reason:$("#cfgrestorereason").val(),
                rollbackTime:nNow,
                param:{
                    fileName: odata[0].fileName,
                    curlTimeOut: 60,
                    downloadUrl: "/download/fileName"
                }
            }),
            success: function(data){
                if(data.communicateResult == 'fail')
                {
                    Frame.Msg.info(data.reason);
                    return;
                }
                else{
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#cfgRestoreForm")));
                    Utils.Base.refreshCurPage();
                }
            },
            error:function(err,status){
                //alert(err);
            }
        })*/
        
        var get_rollbackCfg = {
            type: "POST",
            url:"/v3/ant/rollback",
            dataType:"json",
            contentType:"application/json",
            data:JSON.stringify({
                deviceModule: "ROLLBACK",
                method: "rollbackCfg",
                devSN: FrameInfo.ACSN,
                cfgTimeout: 60,
                reason:$("#cfgrestorereason").val(),
                rollbackTime:nNow,
                param:{
                    fileName: odata[0].fileName,
                    curlTimeOut: 60,
                    downloadUrl: "/download/fileName"
                }
            }),
            onSuccess: get_rollbackCfgSuc,
            onFailed: get_rollbackCfgFail
        };
        Utils.Request.sendRequest( get_rollbackCfg );   
    }

    function onRollbackCfg_dlg(odata)
    {
        function onCancel()
        {
            Utils.Pages.closeWindow(Utils.Pages.getWindow( addForm));
            addForm.form("updateForm",{
                cfgrestorereason: ""
            })
        }
        var addForm = $("#cfgRestoreForm");
        var jDlg = $("#CfgRestoreDlg");
        addForm.form("init", "edit", {"title":getRcText("RESTORE"), "btn_apply":function(){
            onRollbackCfg(odata);
        }, "btn_cancel":onCancel});
        Utils.Base.openDlg(null, null,{scope:jDlg, className:"modal-large"});
    }

    function get_rollback_RestoreSuc( Suc_data )
    {
        var data = Suc_data || {};
        // var data = JSON.parse(Data);
        if(data.result == 'fail')
        {
            Frame.Msg.info(data.reason);
        }
        else{
            var result = data.result;
            result.forEach(function(odata){
                odata.rollbackTime = unix_to_date(odata.rollbackTime)+ ' ' + unix_to_time(odata.rollbackTime);
            });
            Utils.Base.openDlg(null, {}, {scope:$("#historylist"),className:"modal-super dashboard"});
            $("#history_info_list").SList ("refresh", result);
        }
    };

    function get_rollback_RestoreFail()
    {

    };

    function showhistoryrestore()
    {
/*        $.ajax({
            type: "POST",
            url: "/v3/ant/rollback",
            contentType: "application/json",
            data: JSON.stringify({
                method: "getRollbackCfg",
                devSN: FrameInfo.ACSN
            }),
            success: function(data) {
                var data = JSON.parse(data);
                if(data.result == 'fail')
                {
                    Frame.Msg.info(data.reason);
                }
                else{
                    var result = data.result;
                    result.forEach(function(odata){
                        odata.rollbackTime = unix_to_date(odata.rollbackTime)+ ' ' + unix_to_time(odata.rollbackTime);
                    });
                    Utils.Base.openDlg(null, {}, {scope:$("#historylist"),className:"modal-super dashboard"});
                    $("#history_info_list").SList ("refresh", result);
                }
            }
        })*/

        var get_rollback_Restore = {
            type: "POST",
            url: "/v3/ant/rollback",
            contentType: "application/json",
            data: JSON.stringify({
                method: "getRollbackCfg",
                devSN: FrameInfo.ACSN
            }),
            onSuccess: get_rollback_RestoreSuc,
            onFailed: get_rollback_RestoreFail            
        };
        Utils.Request.sendRequest( get_rollback_Restore );       
    }

    function initData()
    {
/*        getCfgFile().done(function(data, textStatus, jqXHR){
            if (("errorcode" in data) && (data.errorcode != 0)){
                return;
            }
            var aResult = data.result;
            var aEvents = [];
            var nManualNum = 0;
            var nAutoNum = 0;
            var oResultdata = {};
            g_nTotleData = aResult.length;
            aResult.forEach(function(oResult){
                oResult.opType == 0 ? nAutoNum++ : nManualNum++;
                var sday = unix_to_date(oResult.createTime);
                var stime = unix_to_time(oResult.createTime);
                oResult.createTime = stime;
                if(oResultdata[sday])
                {
                    oResultdata[sday].nNum += 1;
                    oResultdata[sday].day = sday;
                    oResultdata[sday].aEvent.push(oResult);
                }
                else{
                    oResultdata[sday] = {};
                    oResultdata[sday].aEvent = [];
                    oResultdata[sday].day = sday;
                    oResultdata[sday].nNum = 1;
                    oResultdata[sday].aEvent.push(oResult);
                }
            });
            $.each(oResultdata, function(index, oEvent){
                var oData = {};
                oData.title = " ";
                oData.start = oEvent.day;
                aEvents.push(oData);
            });

            g_oAllEvents = oResultdata;
            refreshFrame(nManualNum, nAutoNum);
            initCalendar(aEvents);
            $(".fc-day-grid a").last().addClass("eventClickedColor");
           // $("#calendar").fullCalendar( 'addEventSource', ooo);
        });*/
        getCfgFile();
    }

    function refreshFrame()
    {
/*        var ocfgdata = {};
        getLastCfg().done(function(data, textStatus, jqXHR){
            if ((data.result == 'fail') || (data.result == undefined)){
                return;
            }
            var cfgdata = data.result;
            var times = unix_to_date(cfgdata.createTime)+" "+unix_to_time(cfgdata.createTime);
            var sday = unix_to_date(cfgdata.createTime);
            var aLastCfgEvent = g_oAllEvents[sday] && g_oAllEvents[sday].aEvent || [];
            $("#detail_info_list").SList("refresh", aLastCfgEvent);
            ocfgdata = {
                totlefileNum: g_nTotleData,
                manualNum: nManualNum,
                autoNum:  nAutoNum,
                restoretime:times,
                fileName:cfgdata.fileName,
                CreateReason:cfgdata.reason
            };
            Utils.Base.updateHtml($("#cfg_restore_left"),ocfgdata);
            getLastRollbackCfg().done(function(data, textstatus, jqXHR){
                if (data.result == 'fail'){
                    return;
                }
                var rollbackdata = data.result;
                ocfgdata = {
                    RestoreReason:rollbackdata.reason,
                    RestoreFile:rollbackdata.fileName,
                    rollbackTime: unix_to_date(rollbackdata.rollbackTime)+" "+unix_to_time(rollbackdata.rollbackTime)
                };
                Utils.Base.updateHtml($("#cfg_restore_right"),ocfgdata);
            });
        });*/
        getLastCfg();
    }

    function get_rollback_SaveCfgSuc( Data )
    {
        var data = Data || [];
        var oResult = JSON.parse(data);
        if(oResult.communicateResult == "fail")
        {
            Frame.Msg.info(oResult.reason||"删除失败");
        }
        else{
            Utils.Pages.closeWindow(Utils.Pages.getWindow( addForm));
            Utils.Base.refreshCurPage();
        }
    };

    function get_rollback_SaveCfgFail()
    {

    };

    function saveCfg()
    {
        $(".btn.btn-apply").addClass("disabled");
        var date = new Date();
        var nNow = Math.round(date.getTime()/1000);
        var addForm = $("#AddRestoreForm");
/*        $.ajax({
            type: "POST",
            url: "/v3/ant/rollback",
            contentType: "application/json",
            data: JSON.stringify({
                deviceModule: "ROLLBACK",
                method: "saveCfg",
                devSN: FrameInfo.ACSN,
                cfgTimeout:60,
                createTime:nNow,
                opType:1,
                reason:$("#reason", addForm).val(),
                param:{
                    fileName:FrameInfo.ACSN+'_' +nNow + '.cfg',
                    curlTimeout:60,
                    downloadUrl:"/v3/ant/rollback"
                }
            }),
            success:function(data){
                var oResult = JSON.parse(data);
                if(oResult.communicateResult == "fail")
                {
                    Frame.Msg.info(oResult.reason||"删除失败");
                }
                else{
                    Utils.Pages.closeWindow(Utils.Pages.getWindow( addForm));
                    Utils.Base.refreshCurPage();
                }

            }
        })*/
        var get_rollback_SaveCfg = {
            type: "POST",
            url: "/v3/ant/rollback",
            contentType: "application/json",
            data: JSON.stringify({
                deviceModule: "ROLLBACK",
                method: "saveCfg",
                devSN: FrameInfo.ACSN,
                cfgTimeout:60,
                createTime:nNow,
                opType:1,
                reason:$("#reason", addForm).val(),
                param:{
                    fileName:FrameInfo.ACSN+'_' +nNow + '.cfg',
                    curlTimeout:60,
                    downloadUrl:"/v3/ant/rollback"
                }
            }),
            onSuccess: get_rollback_SaveCfgSuc,
            onFailed: get_rollback_SaveCfgFail            
        };
        Utils.Request.sendRequest( get_rollback_SaveCfg ); 
    }

    function addrestore()
    {
        function onCancel()
        {
            Utils.Pages.closeWindow(Utils.Pages.getWindow( addForm));
            addForm.form("updateForm",{
                reason: ""
            })
        }
        var addForm = $("#AddRestoreForm");
        var jDlg = $("#AddRestoreDlg");
        addForm.form("init", "edit", {"title":getRcText("ADD_TITLE"), "btn_apply":saveCfg, "btn_cancel":onCancel});
        Utils.Base.openDlg(null, null,{scope:jDlg, className:"modal-large"});
    }

/*    function getfilecontent(sfilename)
    {
        return $.ajax({
            type: "POST",
            url: "/v3/ant/rollback",
            contentType: "application/json",
            data: JSON.stringify({
                method: "getFileStream",
                devSN: FrameInfo.ACSN,
                fileName:sfilename //"210235A1SQC15A000051_1601071340.cfg"
            })
        })
    }*/



    function getfilecontent_showFile(sfilename)
    {
        var get_rollback_ShowFile = {
            type: "POST",
            url: "/v3/ant/rollback",
            contentType: "application/json",
            dataType : "text",
            data: JSON.stringify({
                method: "getFileStream",
                devSN: FrameInfo.ACSN,
                fileName:sfilename //"210235A1SQC15A000051_1601071340.cfg"
            }),
            onSuccess: get_rollback_ShowFileSuc,
            onFailed: get_rollback_ShowFileFail   
        };
        Utils.Request.sendRequest( get_rollback_ShowFile ); 
    };
    
    function get_rollback_ShowFileSuc( Data )
    {
        var data = Data || {};
        if(data.indexOf("RemoteException") > 0)
        {
            Frame.Msg.info(JSON.parse(data).RemoteException.message);
        }
        else{
            Utils.Base.openDlg(null, {}, {scope:$("#filecontent"),className:"modal-super dashboard"});
            $("#filecontent_info").html(data.replace(/\r\n/g,'</br>'));
        }
    };

    function get_rollback_ShowFileFail(err)
    {
        
    };



    function showFile(data) {
        var sfilename = '';
        typeof(data) == "string" ? sfilename = data : sfilename = data[0].fileName;
/*        getfilecontent(sfilename).done(function(data, textstatus, jqXHR){
            if(data.indexOf("RemoteException") > 0)
            {
                Frame.Msg.info(JSON.parse(data).RemoteException.message);
            }
            else{
                Utils.Base.openDlg(null, {}, {scope:$("#filecontent"),className:"modal-super dashboard"});
                $("#filecontent_info").html(data.replace(/\r\n/g,'</br>'));
            }
        });*/
        getfilecontent_showFile( sfilename );
    }

    function showrestore(aRows)
    {
        var bshow = false;
        aRows.length == 1 ? bshow = true : bshow = false;
        return bshow;
    }

    function showCompTO(odata)
    {
        if((g_firstfile != '') && (odata.length == 1))
        {
            return true;
        }
        else{
            return false;
        }
    }

    function oncompare(odata)
    {
        g_firstfile = odata.fileName;
    }
    function oncompareto(odata)
    {
        var sFirstContent = '';
        var sSecondContent = '';
        getfilecontent(g_firstfile).done(function(data, textstatus, jqXHR){
            if(data.result == 'fail')
            {
                Frame.Msg.info(data.reason);
            }
            else{
                sFirstContent = g_firstfile + '</br>' +data.replace(/\r\n/g,'</br>');
                getfilecontent(odata[0].fileName).done(function(data,textstatus, jqXHR){
                    if(data.result == 'fail')
                    {
                        Frame.Msg.info(data.reason);
                    }
                    else{
                        sSecondContent = odata[0].fileName + '</br>' + data.replace(/\r\n/g,'</br>');
                        Utils.Base.openDlg(null, {}, {scope:$("#filecompare"),className:"modal-super dashboard"});
                        $("#firstfile_info").html(sFirstContent);
                        $("#secondfile_info").html(sSecondContent);
                        g_firstfile = '';
                       // Utils.Base.refreshCurPage();
                    }
                });


            }
        });
    }

    function initGrid()
    {
        var option = {
            colNames: getRcText ("HESTORY_HEADER"),
            showHeader: true,
            multiSelect : false ,
            colModel: [
                {name:'fileName', datatype:"String"},
                {name:'rollbackTime', datatype:"String"}
            ]
        };
        $("#history_info_list").SList ("head", option);

        var optionForEvents = {
            colNames: getRcText ("EVENTS_HEADER"),
            showOperation: true,
            showHeader: true,
            multiSelect : true ,
            pageSize:8,
            colModel: [
                {name:'fileName', datatype:"String"},
                {name:'createTime', datatype:"String"},
                {name:'reason', datatype:"String"},
                {name:'opType', datatype:"Order",data:getRcText("OPTYPE").split(',')}
            ],
            buttons: [
                {name:"add",action:addrestore},
                {name:"detail",action:showFile},
                {name:"delete",action:Utils.Msg.deleteConfirm(onRemoveCfg)},
                {name:"restore",value:getRcText("RESTORE"),enable:showrestore,action:onRollbackCfg_dlg}
                //{name:"compare",value:getRcText("COMPARE"),enable:showrestore,action:oncompare},
                //{name:"compare",value:getRcText("COMPARETO"),enable:showCompTO,action:oncompareto}
            ]
        };
        $("#detail_info_list").SList ("head", optionForEvents);
    }

    function initForm()
    {
        $("#compare").on("click",function(){alert("compare")});
        $("#restorehistory").on("click", showhistoryrestore);
        $("#fileName").on("click", function(){
            showFile(this.innerHTML);
        });
        $("#RestoreFile").on("click", function(){
            showFile(this.innerHTML);
        });
    }
    function _init()
    {
        initForm();
        initGrid();
        initData();
    }

    function _destroy()
    {

    }
    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Panel","SList","Form","FullCalendar"],
        "utils": ["Base", "Request"]
        // "libs":["Libs.Fullcalender.Fullcalendar"]
    });
})(jQuery);