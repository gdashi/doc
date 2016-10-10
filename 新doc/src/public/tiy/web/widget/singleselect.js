(function ($) {
    var MODULE_NAME = "widget.singleselect";
    
    function initSlist() {
    	var aData=["RD","SE","UI","PMP"];
        $('#interface').singleSelect("InitData", aData);
    }
    
    function initSlistTest() {
        $('#test').formates('init', 'Minput-test', $('#singleselect-test'), initSlist);
    }
    
    
    function _init () {

        initSlistTest();
        
        
    }
    
    function _destroy () {
        
    }
    
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["CodeFormate","SingleSelect"],
        "utils":["Request","Base"]
    });
})(jQuery);