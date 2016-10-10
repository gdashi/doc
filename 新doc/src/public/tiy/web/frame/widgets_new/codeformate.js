(function ($) {
    var WIDGETNAME = "CodeFormate"
    
    
    var jDom = $('<div class="bs-example" data-example-id="slist"></div>')
        
        
    var jTabList = $('\
        <ul class="nav nav-tabs" role="tablist">\
            <li role="presentation" class="active">\
                <a href="#html" role="tab" data-toggle="tab" aria-controls="html"\ aria-expanded="true">HTML</a>\
            </li>\
            <li role="presentation" class="">\
                <a href="#js" role="tab" data-toggle="tab" aria-controls="js"\ aria-expanded="false">JS</a>\
            </li>\
            <li role="presentation" class="">\
                <a href="#show" role="tab" data-toggle="tab" aria-controls="show"\ aria-expanded="false">SHOW</a>\
            </li>\
        </ul>\
    ');
    
    var jTabContent = $('\
        <div class="tab-content">\
            <div role="tabpanel" class="tab-pane fade active in" id="html"\ aria-labelledby="html-tab">\
                <div class="highlight">\
                    <pre>\
                        <code class="language-html" data-lang="html">\
                        111\
                        </code>\
                    </pre>\
                </div>\
                <textarea class="hide"></textarea>\
            </div>\
            <div role="tabpanel" class="tab-pane fade" id="js" aria-labelledby="js-tab">\
                <div class="highlight">\
                    <pre>\
                        <code class="language-js" data-lang="js">\
                        222\
                        </code>\
                    </pre>\
                </div>\
                <textarea class="hide"></textarea>\
            </div>\
            <div role="tabpanel" class="tab-pane fade" id="show" aria-labelledby="show-tab">\
            333\
            </div>\
        </div>\
    ')
    
    var oFormate = {
        options: {
            
        },
        _create: function () {
            
        },
        init: function (sId, jHtml, fCall) {
            
            if (!sId) {
                console.log('can not get example name, please try again =.=!!!');
                return ;
            }
            
            jDom.attr('data-example-id', sId);
            
            jTabList.appendTo(jDom);
            

            jTabList.find('li:first-of-type > a')
                .attr('href', '#' + sId + '-html')
                .attr('id', sId + '-html-tab');
            
            jTabList.find('li:nth-of-type(2) > a')
                .attr('href', '#' + sId + '-js')
                .attr('id', sId + '-js-tab');
                
            jTabList.find('li:nth-of-type(3) > a')
                .attr('href', '#' + sId + '-show')
                .attr('id', sId + '-show-tab');
                
                
            jTabContent.appendTo(jDom);
            
            jTabContent.find('.tab-pane:nth-of-type(1)').attr('id', sId + '-html')
            jTabContent.find('.tab-pane:nth-of-type(2)').attr('id', sId + '-js')
            jTabContent.find('.tab-pane:nth-of-type(3)').attr('id', sId + '-show')
            
            //  可能缺少一些参数  现在简单的功能可以使用
            
            
            
            
            function createDomString (jHtml, len) {
                var str = "";
                for (var i =0 ;i < jHtml.length; i++){
                    
                    var tar = jHtml.eq(i);
                    var child = tar.children();
                    
                    if (child.length == 0) {
                        //没有子元素
                        
                        str += " ".repeat(len) + $('<div></div>').append(tar).html() + '\n';
                    }
                    else {
                        var html = $('<div></div>').append(tar.empty()).html().split('</');
                        html[1] = " ".repeat(len) + "</" + html[1] + '\n';
                        
                        html[0] = " ".repeat(len) + html[0] + '\n';
                        
                        str += (html[0] + createDomString((child), len + 2) + html[1]);
                    }
                }
                return str;
            }
            
            var formateStr = createDomString(jHtml.clone(), 0);
            var backup = jHtml.clone();
            function formateHtml(str) {
                //
                //添加sapn标签这里先不做了
                return str.replace(/\</g, '&lt;')
                        .replace(/\>/g, '&gt;');
                
            }
            formateStr = formateHtml(formateStr);
            jTabContent.find('.tab-pane:nth-of-type(1) code').empty().append(formateStr);



            
            // js 代码
            var sFormateFunc = fCall.toString();
            jTabContent.find('.tab-pane:nth-of-type(2) code').empty().append(sFormateFunc);

            jTabContent.find('.tab-pane:nth-of-type(3)').empty().append(jHtml);
            // 这里有点问题  是每次都放到最后 还是 放在原来的位置上
            $('#tabContent').append(jDom);
            
            fCall();
            
            
            function bindEvent() {
                jTabContent.find('.tab-pane:nth-of-type(2)').dblclick(function () {
                    var self = $(this);
                    
                    var child = self.children().toggleClass('hide');
                    
                    var hide = $('div', self);
                    var show = $('textarea', self)
                        .width(hide.width())
                        .height(hide.height())
                        .val(hide.find('code').html());

                    show.focus();

                }).focusout(function () {
                    
                    var self = $(this);
                    
                    var child = self.children().toggleClass('hide');
                    
                    var hide = $('textarea', self);
                    var show = $('div', self).find('code').empty().html(hide.val());
                    
                    
                    // 执行代码
                    // 1. 清空 show 重新调用 widgets 
                    jTabContent.find('.tab-pane:nth-of-type(3)').empty().append(backup.clone());
                    
                    var sModId = Utils.Pages.sModId;
                    var oMods = Utils.Pages.Mods;
                    var oPageInfo = oMods.getModInfo(sModId);
                    Widgets.initWidgets(oPageInfo.widgets, jTabContent);
                    
                    // 2. 调用 
                    debugger;
                    eval('(' + hide.val() + ')()');
                })
            }
            
            bindEvent();

        },
        _destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    }
    
    $.widget("ui.formates", oFormate);
    
    
    function _init(oFrame) {
        $('.code-formate', oFrame).formates();
    }
    
    function _destroy() {
        
    }
    
    Widgets.regWidget(WIDGETNAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": [], 
        "utils":["Widget"]
    });

})(jQuery)