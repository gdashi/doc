(function ($) {
    var MODULE_NAME = "widget.datetime";
    
    function initSlist() {
        
    }
    
    function initSlistTest() {
        $('#test').formates('init', 'datetime-test', $('#datetime-test'), initSlist);
    }
    
    
    function _init () {

        initSlistTest();
        
        
    }
    
    function _destroy () {
        
    }
    
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["CodeFormate","DateTime"],
        "utils":["Request","Base"]
    });
})(jQuery);