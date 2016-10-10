(function ($) {
    var MODULE_NAME = "widget.daterange";
    
    function initSlist() {
        
    }
    
    function initSlistTest() {
        $('#test').formates('init', 'daterange-test', $('#daterange-test'), initSlist);
    }
    
    
    function _init () {

        initSlistTest();
        
        
    }
    
    function _destroy () {
        
    }
    
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["CodeFormate","DateRange"],
        "utils":["Request","Base"]
    });
})(jQuery);