(function ($) {
    var MODULE_NAME = "widget.dialog";
    
    function initSlist() {
        $("#suc").click(function(){
        	Frame.Msg.info("��ϲ�����ύ�ɹ�");
        })

        $("#fal").click(function(){
        	Frame.Msg.info("���ź����ύʧ��","error");
        })
    }
    
    function initSlistTest() {
        $('#test').formates('init', 'Dialog-test', $('#dialog-test'), initSlist);
    }
    
    
    function _init () {

        initSlistTest();
        
        
    }
    
    function _destroy () {
        
    }
    
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["CodeFormate"],
        "utils":["Request","Base"]
    });
})(jQuery);