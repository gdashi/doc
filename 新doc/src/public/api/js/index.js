;
(function($) {

    var RCTEXT = "cloud_rc";
    var g_sApi_addapi = '/api/addapi',
        g_sApi_load = '/api/load',
        g_sApi_getdoclist = '/api/getdoclist',
        g_sApi_getdocapi = '/api/getdocapi?DocIndex=',
        g_sApi_delete = '/api/delete?DocIndex=';
    var _jMenu = $("#doc_menu");
    var _jContent = $("#doc_content");
    var _jDocList = $("#DocList");
    var _jParametersList = $("#ParametersList"),
        _jErrorCodeList = $("#ErrcodeList");
    var _ADDPARAMENTS = "ParametersList_",
        _ADDERRORCODE = "ErrcodeList_";
    var _DELPARAMENTS = "ParBtnDel_",
        _DELERRORCODE = "ErrBtnDel_";
    var _PARAMENTSNAME = "ParametersName_",
        _PARDESCRIBE = "ParDescribe_",
        _ERRORCODENAME = "ErrcodeName_",
        _ERRDESCRIBE = "ErrDescribe_";
    var g_oWholeDoc = null,     /* All information of the Current Document  */
        g_aDocList = null,      /* Documents List */
        g_oCurDocName ={};      /* Current Doc, it will be showed in AddItem dialog*/
    var _aAddParIdList = null; /* The Parameters ID in  Parameters List */
    var _aAddErrIdList = null; /* The ErrorCode Id in ErrorCode List */
    var _nParametersNum = 0,
        _nErrocdeNum = 0;

    var g_bFirst = false;      /* is first Refresh the Page */

    function getRcText(sRcName) {
        return $('#' + RCTEXT).attr(sRcName);
    }
    var EditBox = function() {
        var _jBox = null;
        var _jItem = null;
        var _isFirstIn = true;
        var i = 0;

        function onDel(sId) {
            function onOk() {
                var aAllItems = g_oWholeDoc.AllItems;
                var aCurItem = sId.split('_');
                for (var i = 0; i < aAllItems.length; i++) {
                    if ((aCurItem[0] == aAllItems[i].ItemName) && (aCurItem[1] == aAllItems[i].SubItem)) {
                        aAllItems.splice(i, 1);
                        break;
                    }
                }

                g_oWholeDoc.AllItems = aAllItems;

                $.ajax({
                    type: 'post',
                    url: g_sApi_addapi,
                    contentType: "application/json",
                    dataType: 'json',
                    data: JSON.stringify(g_oWholeDoc),
                    success: function(oRecvData) {
                        if (oRecvData.error == 1){
                            alert("没有权限!");
                        }
                        $('#delItemdlg').modal('hide');
                        RefreshPage(g_oCurDocName.DocIndex);
                    },
                    error: function() {
                        alert("Delete Error!")
                    }
                });
            }

            var jDlg = $('#delItemdlg').modal({
                backdrop: true
            });
            $('#DelItemOk', jDlg).unbind().bind('click', onOk);
        }

        function onEdit(sId)
        {
            var onOk = function() {
                var aAllItems = g_oWholeDoc.AllItems;
                var aKey = ['SubItem', 'ItemName', 'Path', 'Method', 'Parameters', 'Return', 'Error']
                var oData = getFormData(jDlg, aKey);

                if (!oData) {
                    return;
                }

                g_oWholeDoc.AllItems[nNumber] = oData;

                $.ajax({
                    type: 'post',
                    url: g_sApi_addapi,
                    contentType: "application/json",
                    dataType: 'json',
                    data: JSON.stringify(g_oWholeDoc),
                    success: function(oRecvData) {
                        if (oRecvData.error == 1){
                            alert("没有权限!");
                        }
                        EmptyItemDlg();
                        RefreshPage(g_oCurDocName.DocIndex);
                    },
                    error: function() {
                        alert("Add error");
                    }
                });
            };
            
            var onCancel = function() {
                EmptyItemDlg();
                RefreshPage(g_oCurDocName.DocIndex);
            };

            function FillItemData(object) {
                $("#ItemName").val(object.ItemName);
                $("#SubItem").val(object.SubItem);
                $("#Path").val(object.Path);
                $('#' + "method_" + object.Method).prop("checked", true);
                $("#Return").val(object.Return);
                _nParametersNum = 0;
                _nErrocdeNum = 0;
                for (var i = 0; i < object.Parameters.length; i++) {
                    if (0 == i) {
                        $('#' + _PARAMENTSNAME + i).val(object.Parameters[i].name);
                        $('#' + _PARDESCRIBE + i).val(object.Parameters[i].description);
                        _nParametersNum++;
                    } else {
                        addParametersCol(object.Parameters[i].name, object.Parameters[i].description);
                    }
                }
                for (var i = 0; i < object.Error.length; i++) {
                    if (0 == i) {
                        $('#' + _ERRORCODENAME + i).val(object.Error[i].name);
                        $('#' + _ERRDESCRIBE + i).val(object.Error[i].description);
                        _nErrocdeNum++;
                    } else {
                        addErrocdeCol(object.Error[i].name, object.Error[i].description);
                    }
                }
            }

            var jDlg = $('#ItemDlg').modal({
                backdrop: true
            });

            var aCurItem = sId.split('_');
            var aAllItems = g_oWholeDoc.AllItems;
            var nNumber;
            var i = 0;

            for (i; i < aAllItems.length; i++) {
                if ((aCurItem[0] == aAllItems[i].ItemName) && (aCurItem[1] == aAllItems[i].SubItem)) {
                    FillItemData(aAllItems[i]);
                    nNumber = i;
                    break;
                }
            }

            $("#myModaItem").text(getRcText("CHANGEITEM"));
            $('#ItemDlgOk', jDlg).unbind().bind("click", onOk);

            $('#ItemDlgCancel', jDlg).unbind().bind("click", onCancel);

            _nParametersNum = 1, _nErrocdeNum = 1;
            $("#ParBtnAdd").unbind().bind("click", addParametersCol);
            $("#ErrBtnAdd").unbind().bind("click", addErrocdeCol);
        }

        function onBtnClick(e) {
            var nIndex = $(this).attr('index');
            var aFun = [onEdit, onDel];
            var sId = $(this).closest("div[b_target]").attr('b_target');
            aFun[nIndex] && aFun[nIndex](sId);
        }

        function onLeave(e) {
            _jBox.hide();
        }

        function onEnter(e) {
            var jTarget = _jItem = $(this);

            if (jTarget.hasClass('no-edit')) {
                return false;
            }

            var nWidth = jTarget.outerWidth(),
                nHeight = jTarget.outerHeight(),
                nTop = jTarget.offset().top,
                nLeft = jTarget.offset().left;
            _jBox.css({
                'top': nTop,
                'left': nLeft,
                'width': nWidth,
                'height': nHeight
            }).show();
            _jBox.attr("b_target", jTarget.attr("item"));
        }

        function _init() {
            var sHtml = '<div class="edit-box">' +
                '<div class="tool-bar">' +
                '<span><i class="fa fa-edit" index="0"></i></span>' +
                '<span><i class="fa  fa-trash" index="1"></i></span></span>' +
                '</div>' +
                '</div>';
            $('.cloud-doc-explain.editable').mouseenter(onEnter);
            _jBox = $(sHtml).appendTo('body').mouseleave(onLeave);
            _jBox.find('.tool-bar').on('click', 'i.fa', onBtnClick);
        }

        this.init = _init;
    };

    

    //upload document
    function onUploadDoc()
    {
        var sDocIndex = generateID('doc');

        var jDlg = $('#UploadDocDlg').modal({
            backdrop: true
        });

        $('#BtnUploadSelect').unbind().bind('click', function(){
            $('#btnFileUpload').click();
        });

        $('#btnFileUpload').unbind().bind('change', function(){
            $('#UploadPath').val($('#btnFileUpload').val());
            $('#UploadDocIndex').val(sDocIndex);
        });

        $('#UploadDlgOk').unbind().bind('click',function(){
            $('#UpFileBlock').ajaxSubmit({
                type:'post',
                url:g_sApi_load,
                success:function(oRecvData){
                    $('#UploadDocDlg').modal('hide');
                    $('#UploadPath').val("");
                    $('#btnFileUpload').val("");
                    $('#UploadPath').val("");
                    if (oRecvData.error == 1){
                        alert("没有权限");
                    }
                    g_oCurDocName.DocIndex = oRecvData.DocIndex;
                    RefreshDocList();
                },
                error:function(){
                    alert("upload error!");
                }
            });
        });        
    }









    function getFormData(jScope, aId) {
        var oData = {};
        for (var i = 0; i < aId.length; i++) {
            var sval = null;
            if (("Parameters" == aId[i]) || ("Error" == aId[i])) {
                var aParInput = $('#' + aId[i] + ' input');
                var aParDescribe = $('#' + aId[i] + ' textarea');
                sVal = [];

                for (var j = 0; j < aParInput.length; j++) {
                    var opt = {};
                    opt.name = $(aParInput[j]).val();
                    opt.description = $(aParDescribe[j]).val();
                    sVal.push(opt);
                }
            } else if ("Method" == aId[i]) {
                sVal = $('#Method input:radio:checked').val();
            } else {
                var jEle = $('#' + aId[i], jScope);
                sVal = $.trim(jEle.val());
                if (jEle.hasClass('required') && !sVal) {
                    $('#' + aId[i] + '_error').html("required").show();
                    return null;
                }

                if (jEle.hasClass('json') && sVal) {
                    try {
                        JSON.parse(sVal);
                        sVal = formatJson(sVal);
                    } catch (ex) {
                        $('#' + aId[i] + '_error').html("wrong json").show();
                        return null;
                    }
                }
            }
            oData[aId[i]] = sVal;
        }

        return oData;
    }

    function generateID(sPrefix) {
        sPrefix = sPrefix || "webid";

        return sPrefix + "_" + ("" + Math.random()).substring(2);
    }

    /* 格式化JSON源码(对象转换为JSON文本) */
    function formatJson(txt, compress /*是否为压缩模式*/ ) {
        var indentChar = '    ';
        if (/^\s*$/.test(txt)) {
            alert('数据为空,无法格式化! ');
            return;
        }
        try {
            var data = eval('(' + txt + ')');
        } catch (e) {
            alert('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err');
            return;
        };
        var draw = [],
            last = false,
            This = this,
            line = compress ? '' : '\n',
            nodeCount = 0,
            maxDepth = 0;

        var notify = function(name, value, isLast, indent /*缩进*/ , formObj) {
            nodeCount++; /*节点计数*/
            for (var i = 0, tab = ''; i < indent; i++) tab += indentChar; /* 缩进HTML */
            tab = compress ? '' : tab; /*压缩模式忽略缩进*/
            maxDepth = ++indent; /*缩进递增并记录*/
            if (value && value.constructor == Array) { /*处理数组*/
                draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line); /*缩进'[' 然后换行*/
                for (var i = 0; i < value.length; i++)
                    notify(i, value[i], i == value.length - 1, indent, false);
                draw.push(tab + ']' + (isLast ? line : (',' + line))); /*缩进']'换行,若非尾元素则添加逗号*/
            } else if (value && typeof value == 'object') { /*处理对象*/
                draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line); /*缩进'{' 然后换行*/
                var len = 0,
                    i = 0;
                for (var key in value) len++;
                for (var key in value) notify(key, value[key], ++i == len, indent, true);
                draw.push(tab + '}' + (isLast ? line : (',' + line))); /*缩进'}'换行,若非尾元素则添加逗号*/
            } else {
                if (typeof value == 'string') value = '"' + value + '"';
                draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line);
            };
        };
        var isLast = true,
            indent = 0;
        notify('', data, isLast, indent, false);
        return draw.join('').replace(/(\/\/.*)\"\,/g, '",<code>$1</code>').replace(/(\/\/.*)\"/g, '"<code>$1</code>');
    }

    function addErrorCode(sCode, arr) {
        if (!sCode) {
            arr.push('<span class="null">N/A</span>');
            return;
        }
        var key;
        arr.push('<ul class="level-2">');
        for (var i = 0; i < sCode.length; i++) {
            arr.push('<li><code>' + sCode[i].name + '</code><span>' + sCode[i].description + '</span></li>');
        }

        arr.push('</ul>');
    }

    function parseJson(sCode, arr) {
        if (!sCode) {
            arr.push('<span class="null">N/A</span>');
            return;
        }

        arr.push('<pre>' + sCode + '</pre>');
    }

    function addParameters(sCode, arr) {
        if (!sCode) {
            arr.push('<span class="null">N/A</span>');
            return;
        }

        arr.push('<ul class="level-2">');
        for (var i = 0; i < sCode.length; i++) {
            if (-1 != $.inArray('\n', sCode[i].description)) {
                arr.push('<li><code>' + sCode[i].name + '</code><pre>' + sCode[i].description + '</pre></li>');
            } else {
                arr.push('<li><code>' + sCode[i].name + '</code><span>' + sCode[i].description + '</span></li>');
            }
        }

        arr.push('</ul>');
    }

    function makeItem(index, itme) {
        var html = [];
        html.push('<div class="cloud-doc-explain editable" item="' + itme.ItemName + '_' + itme.SubItem + '">');
        html.push('<div class="cloud-doc-exp-head">');
        html.push('<span class="cloud-doc-exp-label"><strong>' + itme.SubItem + '</strong></span>');
        html.push('</div>');
        html.push('<ul class="level-1">');
        html.push('<li><code><strong>Path</strong></code><span>' + itme.Path + '<span></li>');
        html.push('<li><code><strong>Method</strong></code><span>' + itme.Method + '</span></li>');
        html.push('<li><code><strong>Parameters</strong></code>');
        //Loop to Add Parameters
        addParameters(itme.Parameters, html);
        html.push('</li>');
        html.push('<li><span class="li-label">返回数据格式（JSON）</span>');
        //Prase the Json Code
        parseJson(itme.Return, html);
        html.push('</li>');
        html.push('<li><span class="li-label">错误码</span>');
        //Loop to Add Error Code
        addErrorCode(itme.Error, html);
        html.push('</li>');
        html.push('</ul>');
        html.push('</div>');
        _jContent.append(html.join(''));
    }

    function makeTitle(index, name) {
        _jContent.append('<div class="cloud-doc-title"><strong>' + name + '</strong><a name="cloud_' + index + '" class="doc_anchor"><span></span></a></div>');
    }

    function makeMenu(index, name) {
        _jMenu.append('<li><a href="#cloud_' + index + '">' + name + '<span></span></a></li>');
    }

    function addParametersCol(sNameValue, sDescribeName) {
        var newParBlockId = _ADDPARAMENTS + _nParametersNum;
        var newParDelId = _DELPARAMENTS + _nParametersNum;
        if (typeof sNameValue != "string") {
            sNameValue = "";
        }
        if (typeof sDescribeName != "string") {
            sDescribeName = "";
        }

        var html = '<div id="' + newParBlockId + '" class="form-group" style="margin-top:0px;"><div class="col-xs-10 col-sm-1" style="width:88.8889%"><input id="ParametersName_' + _nParametersNum + '" placeholder="请输入参数名" value="' + sNameValue + '"><textarea id="ParDescribe_' + _nParametersNum + '" placeholder="请输入参数描述">' + sDescribeName + '</textarea></div><div class="col-xs-2 col-sm-1 btn-del" style="width:11.1111%"><i id="' + newParDelId + '" class="fa fa-minus-circle" title="删除"></i></div></div>';

        _jParametersList.append(html);
        $('#' + newParDelId).unbind().bind("click", function() {
            $('#' + newParBlockId).remove();
        });
        _nParametersNum++;
    }

    function addErrocdeCol(sNameValue, sDescribeName) {
        var newErrBlockId = _ADDERRORCODE + _nErrocdeNum;
        var newErrDelId = _DELERRORCODE + _nErrocdeNum;

        if (typeof sNameValue != "string") {
            sNameValue = "";
        }
        if (typeof sDescribeName != "string") {
            sDescribeName = "";
        }
        var html = '<div id="' + newErrBlockId + '" class="form-group" style="margin-top:0px;"><div class="col-xs-10 col-sm-1" style="width:88.8889%"><input id="ErrcodeName_' + _nErrocdeNum + '" value="' + sNameValue + '" placeholder="请输入返回码"><textarea id="ErrDescribe_' + _nErrocdeNum + '" placeholder="请输入返回码描述" value=' + sDescribeName + '>' + sDescribeName + '</textarea></div><div class="col-xs-2 col-sm-1 btn-del" style="width:11.1111%"><i id="' + newErrDelId + '" class="fa fa-minus-circle" title="删除"></i></div></div>';

        _jErrorCodeList.append(html);
        $('#' + newErrDelId).unbind().bind("click", function() {
            $('#' + newErrBlockId).remove();
        });
        _nErrocdeNum++;
    }

    function EmptyItemDlg() {
        $('#ItemDlg').modal('hide');
        _jParametersList.empty();
        _jErrorCodeList.empty();
        $("#ItemDlg input[type='text']").val("");
        $("#ItemDlg textarea[type='text']").val("");
        $("#method_Get").prop("checked", true);
    }

    function onAddItem()
    {
        var onOk = function() {
            var aAllItems = g_oWholeDoc.AllItems;
            var aKey = ['SubItem', 'ItemName', 'Path', 'Method', 'Parameters', 'Return', 'Error']
            var oData = getFormData(jDlg, aKey);

            if (!oData) {
                return;
            }

            g_oWholeDoc.AllItems.push(oData);

            $.ajax({
                type: 'post',
                url: g_sApi_addapi,
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(g_oWholeDoc),
                success: function(oRecvData) {
                    if (oRecvData.error == 1){
                        alert("没有权限!");
                    }
                    EmptyItemDlg();
                    RefreshPage(g_oCurDocName.DocIndex);
                },
                error: function() {
                    alert("Add error");
                }
            });
        };

        var onCancel = function() {
            EmptyItemDlg();
            RefreshPage(g_oCurDocName.DocIndex);
        };

        $("#myModaItem").text(getRcText("ADDITEM"));
        var jDlg = $('#ItemDlg').modal({
            backdrop: true
        });

        $('#ItemDlgOk', jDlg).unbind().bind("click", onOk);

        $('#ItemDlgCancel', jDlg).unbind().bind("click", onCancel);

        _nParametersNum = 1, _nErrocdeNum = 1;
        $("#ParBtnAdd").unbind().bind("click", addParametersCol);
        $("#ErrBtnAdd").unbind().bind("click", addErrocdeCol);
    }

    function onChangeDocName()
    {
        var onOk = function() {
            var oWholeDoc = g_oWholeDoc;
            oWholeDoc.Name = $.trim($('#NewDocName').val());
            oWholeDoc.author = $.trim($('#DocAuthor').val());
            oWholeDoc.description = $('#DocDesc').val();

            $.ajax({
                type: 'post',
                url: g_sApi_addapi,
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(oWholeDoc),
                success: function(oRecvData) {
                    if (oRecvData.error == 1){
                        alert("没有权限!");
                    }
                    $('#addDocDlg').modal('hide');
                    $("#addDocDlg input[type='text']").val("");
                    $("#addDocDlg textarea[type='text']").val("");
                    RefreshDocList();
                },
                error: function() {
                    alert("Add Error!!")
                }
            });
        };

        var onCancel = function() {
            $('#addDocDlg').modal('hide');
            $('#NewDocName').val("");
        };

        $('#myModalDoc').text(getRcText("CHANGEDOC"));
        $('#NewDocName').val(g_oWholeDoc.Name);
        $('#DocAuthor').val(g_oWholeDoc.author);
        $('#DocDesc').val(g_oWholeDoc.description);
        var jDlg = $('#addDocDlg').modal({
            backdrop: true
        });

        $('.btn-primary', jDlg).unbind().bind('click', onOk);
        $('btn-defaultl', jDlg).unbind().bind('click', onCancel);
    }

    function onAddDoc()
    {
        var onOk = function() {
            /*if (g_aDocList) {                             //panduan chongfu
                for (var i = 0; i < g_aDocList.length; i++) {
                    if (sName == g_aDocList[i].Name) {
                        alert("The Document is already exits!");
                        return;
                    }
                }
            }*/
            var oData = {
                Name: $.trim($('#NewDocName').val()),
                DocIndex: generateID('doc'),
                author:$.trim($('#DocAuthor').val()),
                description:$('#DocDesc').val(),
                AllItems: []
            };

            $.ajax({
                type: 'post',
                url: g_sApi_addapi,
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(oData),
                success: function(oRecvData) {
                    if (oRecvData.error == 1){
                        alert("没有权限!");
                    }
                    g_oCurDocName.Name = oData.name;
                    g_oCurDocName.DocIndex = oRecvData.DocIndex;
                    RefreshDocList();
                    $('#addDocDlg').modal('hide');
                    $('#NewDocName').val("");
                },
                error: function() {
                    alert("Add Error!!")
                }
            });
        };

        var onCancel = function() {
            $('#addDocDlg').modal('hide');
            $('#NewDocName').val("");
        };

        $('#myModalDoc').text(getRcText("ADDDOC"));
        var jDlg = $('#addDocDlg').modal({
            backdrop: true
        });

        $('.btn-primary', jDlg).unbind().bind('click', onOk);
        $('.btn-default', jDlg).unbind().bind('click', onCancel);
    }

    function onDelDoc()
    {
        function onOk() {
            var oData = g_oCurDocName.DocIndex;

            $.ajax({
                type: 'get',
                url: g_sApi_delete + oData,
                dataType: 'json',
                success: function(oRecvData) {
                    if (oRecvData.error == 1){
                        alert("没有权限!")
                    }
                    $('#delDocdlg').modal('hide');
                    g_bFirst = false;                //wendang xianshi diyige
                    RefreshDocList();
                },
                error: function() {
                    alert("Del Error!!")
                }
            });
        }

        var jDlg = $('#delDocdlg').modal({
            backdrop: true
        });
        $('.btn-primary', jDlg).unbind().bind('click', onOk);
    }

    function FillPage(oDocData)
    {
        var aAllItems = oDocData.AllItems;
        var oItemNameFlag = {};         //Save All ItemName's Flag as a Object
        var oSubItemNameFlag = {};      //Save All SubItemName's Flag as a Object
        var oSubItem = {};      //Save All SubItemName as a Object
        var aAllItemName = [];         //save All Item Name of the Current Document
        var aAllSubItemName = [];      //save All SubItem Name of th Current Document 
        var oItemNameSource = {};
        _jMenu.empty();
        _jContent.empty();

        if (!oDocData) {
            return;
        }

        /*  排序：接收的文档可能是最后几个item乱序的，需要按照如下原则重新排序：
            1、后面的接口会替换掉前面的接口；
            2、相同标题（类目）的会排在一起 */
        for(var i = 0; i < aAllItems.length; i++){
            var sItemName = aAllItems[i].ItemName;
            var sSubItem = aAllItems[i].ItemName + '_' + aAllItems[i].SubItem;

            oSubItem[sSubItem] = aAllItems[i];

            if(!oItemNameFlag[sItemName]){
                aAllItemName.push({
                    'text': sItemName,
                    'id': sItemName,
                    'name': sItemName
                });
            }
            if(!oSubItemNameFlag[sSubItem]){
                aAllSubItemName.push(sSubItem);
            }
            oItemNameFlag[sItemName] = true;
            oSubItemNameFlag[sSubItem] = true;
        }

        /* Fill ItemName in ItemName area(#ItemName) */
        oItemNameSource = {
            source: aAllItemName,
            valueFiled: 'id',
            itemField: 'text',
            items: aAllItemName.length
        };
        $("#ItemName").typeahead(oItemNameSource);

        /* Fill Document's title and description */
        $('#DocTitle').text(oDocData.Name);
        $('#authorName').text("(作者："+oDocData.author+")");
        $('#DocDescription').text(oDocData.description || '');
        oItemNameFlag = {};
        aAllItems = [];
        for (var i = 0; i < aAllSubItemName.length; i++) {
            aAllItems.push(oSubItem[aAllSubItemName[i]]); //将筛选后的文档数据重新装进全局变量中
            var sItemName = aAllItems[i].ItemName;
            
            if (oItemNameFlag[sItemName]) {
                makeItem(i, aAllItems[i]);
                continue;
            }

            //make menus
            oItemNameFlag[sItemName] = true;

            makeMenu(i, sItemName);
            makeTitle(i, sItemName);
            //makeDescription(i, aAllItems)
            makeItem(i, aAllItems[i]);
        }
        g_oWholeDoc.AllItems = aAllItems;
        /* Add th icon of "+" in menu */
        if (document.cookie === "") {
            _jMenu.append('<li class="operation-li hide" action="onAddItem" id = "onadditem"><a><i class="fa fa-plus"></i></a></li>');
        }
        else{
            _jMenu.append('<li class="operation-li show" action="onAddItem" id = "onadditem"><a><i class="fa fa-plus"></i></a></li>');
        }
        //then call init menu
        window._isMenuReady = true;

        var oEditBox = new EditBox;

        oEditBox.init();
    }

    /* Refresh Page */
    function RefreshPage(sDocIndex)
    {
        $.ajax({
            type: 'get',
            url: g_sApi_getdocapi + sDocIndex,
            dataType: 'json',
            success: function(data) {
                g_oWholeDoc = data;
                g_oCurDocName.Name= g_oWholeDoc.Name;   //refresh  g_oCurDocName when you Change The Doc Name
                FillPage(g_oWholeDoc);
            },
            error: function() {
                console.error(sType + ";" + oError.name + ":" + oError.message);
            }
        });
    }

    /* Refresh Documents List  */
    function FillDocList(aDocList)
    {
        var aList = [];
        if (!aDocList) {
            return;
        }
        for (var i = 0; i < aDocList.length; i++) {
            aList.push('<option value="' + aDocList[i].DocIndex + '">' + aDocList[i].Name + '</option>');
            _jDocList.html(aList.join(''));
        }

        _jDocList.val(g_oCurDocName.DocIndex);
    }

    /* Init Documents Select List */
    function RefreshDocList()
    {
        $.ajax({
            type: 'get',
            url: g_sApi_getdoclist,
            dataType: 'json',
            success: function(data) {
                g_aDocList = data.doclist;
                if(!g_bFirst){
                    g_oCurDocName = g_aDocList[0];
                    g_bFirst = true;
                    
                }
                FillDocList(g_aDocList);
                RefreshPage(g_oCurDocName.DocIndex);
            },
            error: function(){
                console.error(sType + ";" + oError.name + ":" + oError.message);
            }
        });
    }

    function initForm()
    {
        $('#AddDoc').click(onAddDoc);
        $('#DelDoc').click(onDelDoc);
        $('#ChangeDoc').click(onChangeDocName);
        $('#UploadDoc').click(onUploadDoc);
        if (document.cookie === ""){
            $("#AddDoc").hide();
            $("#DelDoc").hide();
            $("#ChangeDoc").hide();
            $("#UploadDoc").hide();
        }
        else{
            var atme = document.cookie.split('=');
            var username = atme[atme.length -1];
            $("#userlogin").append("<div style='font-size :23px'>"+username+"</div>");
            $("#AddDoc").show();
            $("#DelDoc").show();
            $("#ChangeDoc").show();
            $("#UploadDoc").show();
        }
        $('#login').click(function(){
            var sTem = location.origin + "/rd";
            window.location = sTem;
        });
        $('#logout').click(function(){
            var sTem = location.origin + "/rd/logout";
            window.location = sTem;
        });
        _jDocList.change(function() {
            g_oCurDocName = {
                Name: this.options[this.selectedIndex].text,
                DocIndex: this.options[this.selectedIndex].value
            }

            RefreshPage(g_oCurDocName.DocIndex);
        });
    }

    function _init()
    {
        initForm();
        RefreshDocList();
    }

    _init();
    window.Page = {
        onAddItem: onAddItem
    };

})(jQuery);