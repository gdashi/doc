(function ($) {
    var MODULE_NAME = "widget.edittable";
    
    function initSlist() {
        
    }
    
    function initSlistTest() {
        $('#test').formates('init', 'edittable-test', $('#edittable-test'), initSlist);
    }
    
    
    function _init () {

        initSlistTest();
        
        
    }
    
    function _destroy () {
        
    }
    
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["CodeFormate","EditTable"],
        "utils":["Request","Base"]
    });
})(jQuery);