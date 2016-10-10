(function ($) {
    var MODULE_NAME = "widget.test";
    
    function initSlist() {
        var option = {
            colNames: ['学号', '姓名', '班级', '年龄', '性别', '心率', '步数', '身高', '体重'],
            multiSelect: false,
            colModel: [
                {name: 'account', value: 'String'},
                {name: 'name', value: 'String'},
                {name: 'class', value: 'String'},
                {name: 'age', value: 'String'},
                {name: 'sex', value: 'String'},
                {name: 'heartRate', value: 'String'},
                {name: 'footMate', value: 'String'},
                {name: 'height', value: 'String'},
                {name: 'weight', value: 'String'}
            ],
            pageSize: 10,
            asyncPaging: true,
            onSearch: function (oFilter, oSorter) {

            },
            showOperation:true,
            buttons: [
                {name: "default",value: '导入体检数据', action: function () {
                    
                }},
                {name: "default",value: '导出报告', action: function () {
                    
                }},
                {name: 'edit'},
                {name: "defaultall", value: '111', enable: 1}
            ]
        }
        
        $("#health-detail").SList('head', option);
        
        
        var data = [
            {
                account: 1234,
                name: '小明',
                class: '01-01',
                age: '10',
                sex: '基佬',
                heartRate: '10',
                footMate: '10',
                height: '10',
                weight: '10'
            },
            {
                account: 1234,
                name: '小刚',
                class: '01-01',
                age: '10',
                sex: '兄贵',
                heartRate: '10',
                footMate: '10',
                height: '10',
                weight: '10'  
            }
        ]
        
        $("#health-detail").SList('refresh', data);
    }
    
    function initSlistTest() {
        $('#test').formates('init', 'Slist-test', $('#test-1'), initSlist);
    }
    
    
    function _init () {

        initSlistTest();
        
        
    }
    
    function _destroy () {
        
    }
    
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["CodeFormate", "SList"],
        "utils":["Request","Base"]
    });
})(jQuery);