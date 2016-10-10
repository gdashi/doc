(function ($) {
    var MODULE_NAME = "widget.switch";
    
    function initSlist() {
        
    }
    
    function initSlistTest() {
        $('#test').formates('init', 'switch-test', $('#switch-test'), initSlist);
    }
    
    
    function _init () {

        initSlistTest();
        
        
    }
    
    function _destroy () {
        
    }
    
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["CodeFormate","Switch"],
        "utils":["Request","Base"]
    });
})(jQuery);