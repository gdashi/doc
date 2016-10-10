(function ($) {
    var MODULE_NAME = "widget.minput";
    
    function initSlist() {
       $("span[class*=radio-icon]").next("label[class*=input-label]").click(function(){
       	$("span[class*=radio-icon]").removeClass("checked");
       	$(this).siblings("span[class*=radio-icon]").addClass("checked");
       })
    }
    
    function initSlistTest() {
        $('#test').formates('init', 'Minput-test', $('#minput-test'), initSlist);
    }
    
    
    function _init () {

        initSlistTest();
        
        
    }
    
    function _destroy () {
        
    }
    
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["CodeFormate","Minput"],
        "utils":["Request","Base"]
    });
})(jQuery);