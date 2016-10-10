(function ($) {
    var MODULE_NAME = "widget.utilbase";
    
    function initSlist() {
    	$("#poem").click(function(){
    		$("#dev_form").form ("init", "edit", {"title":"蝶恋花","btn_apply":true, "btn_cancel":true});
      		 Utils.Base.openDlg(null, {}, {scope:$("#devDlg"),className:"modal-super"});
    	})
       
    }
    
    function initSlistTest() {
        $('#test').formates('init', 'utilbase-test', $('#utilbase-test'), initSlist);
    }
    
    
    function _init () {

        initSlistTest();
        
        
    }
    
    function _destroy () {
        
    }
    
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["CodeFormate","Form"],
        "utils":["Request","Base"]
    });
})(jQuery);