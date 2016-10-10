; (function ($) {
    var jDom = $(
        '<div class="toolbar">\
            <link rel="stylesheet" href="./css/qrcode/index.css">\
            <!--<a href="javascript:;" class="toolbar-close">x</a>-->\
            <a href="javascript:;" class="toolbar-close">\
                <!--<i class="fa fa-times"></i>-->\
                <i class="fa fa-angle-right"></i>\
                <i class="fa fa-angle-left"></i>\
            </a>\
            <a href="javascript:;" class="toolbar-item">\
                <span class="toolbar-btn">\
                    <i class="toolbar-icon fa fa-weixin"></i>\
                    <!--<i class="toolbar-icon icon-wechat"></i>-->\
                    <span class="toolbar-text">公众<br />帐号</span>\
                </span>\
                <span class="toolbar-layer toolbar-layer-weixin"></span>\
            </a>\
            <a href="javascript:;" class="toolbar-item">\
                <span class="toolbar-btn">\
                    <i class="toolbar-icon fa fa-mobile"></i>\
                    <!--<i class="toolbar-icon"></i>-->\
                    <span class="toolbar-text">APP<br />下载</span>\
                </span>\
                <span class="toolbar-layer toolbar-layer-app"></span>\
            </a>\
        </div>'
    );
    
    var jBody = $('body');
    
    jBody.append(jDom);
    
    $('.toolbar-close', jDom).click(function () {
        jDom.hide(100);
    });
})(jQuery);