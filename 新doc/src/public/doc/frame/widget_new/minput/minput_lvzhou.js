;(function($)
{
    var UTILNAME = "Minput";

    function addLabel(jInput , isAdd){
        var sOperClass = isAdd ? "minput-add" : "minput-remove";
        var str = '<div class="input-row"><input type="text" class="string big"/><span class="minput-operator '+sOperClass+'"></span</div>';

        var jLabel = $(str).appendTo(jInput);
        jLabel.on("blur","input",function(){
            if($(this).val() && !validateIp($(this).val())){
                $(this).addClass("text-error");
            } else {
                $(this).removeClass("text-error");
            }
        });
        jLabel.on('click','.minput-operator',function(e){
            if(isAdd)
            {
                addLabel(jInput,false);
            }
            else
            {
                $(this).parent().remove();
            }
        });
        return jLabel;
    }

    function create(jInput){
        var _jInput = jInput ;
        var _jList = addLabel(_jInput,true);
    }

    function validateIp(oData){
        // var re = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/ ;
        if(oData != "0.0.0.0"){
            var re = /^(?:(?:25[0-5]|2[0-4][0-9]|[1][0-9][0-9]|[1-9][0-9]|[1-9])\.){3}(?:25[0-5]|2[0-4][0-9]|[1][0-9][0-9]|[1-9][0-9]|[1-9])$/ ;
            return re.test(oData);
        }
        return true ;
    }

    var oInput = {
        _create : function()
        {
            this.minput = this.element;
            create(this.minput);
        },
        _destroy:function()
        {
            this.minput.remveData("opt");
            delete this.minput;
        },
        resize: function(){
            this.oInstance.resize();
        },
        value: function(oData){
            if(oData != null){
                $("input",this.minput).val(oData[0] || "");

                for(var i = 1 ; i < oData.length; i ++){
                   addLabel(this.minput , "remove").find('input').val(oData[i]);
                }

            } else {
                var mInputs = [];
                $("input",this.minput).each(function(){
                    mInputs.push($(this).val());
                });

                return mInputs;
            }
        }
    };

    $.fn['MRadio'] = function (method){
        var methods = {
            init : function(){
                this.each(function(){

                    if($(this).data("MRadio")) return true;

                    var jEle = $(this).data("MRadio",true), jAll, jBrother,
                        jLabel = $('<label class="input-label"></label>'),
                        jIcon = $('<span class="input-icon radio-icon"></span>');
                    var sId = jEle.attr("id"), sName = jEle.attr("name");

                    // 找到所有的原生的 input
                    jAll = $('input[type=radio][name='+sName+']');
                    // 找到兄弟元素
                    jBrother = jAll.not('[id='+sId+']');

                    // 包裹 jEle
                    jEle.wrap('<div class="xb-input xb-radio"></div>').addClass("input-element");
                    //这里新建了一个 label 指向 input 这个label  是空的
                    jLabel.attr("for",sId).insertAfter(jEle);
                    jIcon.insertAfter(jEle);

                    if(this.checked)
                    {
                        jIcon.addClass("checked");
                    }
                    
                    
                    // 加这个事件 是因为  整个 div 的大小只有 前面的那个圆那么大 
                    // 而lable 是绝对定位上去的  会在最上面响应
                    jLabel.on('click touchend', function (e){
                        jIcon.addClass("checked");
                        jBrother.trigger("xb-change");
                    });
                    
                    jEle.on('xb-change',function (e){
                        jIcon.removeClass("checked");
                    });
                    
                    // 这里是  原来的lable 和 input 响应的 事件
                    jAll.on('change',function(e,isTrigger){
                        // 响应手动点击的事件  
                        if(!isTrigger)
                        {
                            $(this).nextAll('.input-label').trigger("click").trigger("touchend");
                        }
                    });

                });
            },
            getValue:function(){
                return $(this).filter(":checked").val();
            },
            setValue:function(value,triggerChange){
                // 取消其他图标的状态
                $(this).nextAll('.input-icon').removeClass("checked");
                // 找到想要使能的元素，设置状态为使能
                $(this).filter("[value=" + value + "]")
                       .attr("checked", true)
                       .nextAll(".input-icon")
                       .addClass("checked");
                // 这里没 diao 用啊
                if(triggerChange)
                {
                    $(this).filter("[value="+value+"]").trigger('change',true);
                }
            }
        };
        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method === 'object' || !method)
            return methods.init.apply(this, arguments);
        else
            $.error('Method ' + method + ' does not exist!');
    };
    
    $.fn['MCheckbox'] = function (method){
        var methods = {
            init : function(){
                this.each(function(){

                    if($(this).data("MCheckbox")) return true;

                    var jEle = $(this).data("MCheckbox",true),
                        jLabel = $('<label class="input-label"></label>'),
                        jIcon = $('<span class="input-icon checkbox-icon"></span>');
                    var sId = jEle.attr("id"), sName = jEle.attr("name");

                    if($(this).hasClass("switch")){
                        jIcon.addClass("switch");
                    }

                    jEle.wrap('<div class="xb-input xb-checkbox"></div>').addClass("input-element");
                    jLabel.attr("for",sId).insertAfter(jEle);
                    jIcon.insertAfter(jEle);

                    if(this.checked)
                    {
                        jIcon.addClass("checked");
                    }

                    if(!sId)
                    {
                        jLabel.on('click',function(){
                            jEle.trigger("click");
                        });
                    }

                    jEle.on('click',function(){
                       jIcon.toggleClass("checked");
                       $(this).trigger('minput.changed');
                    });
                });
            },
            getState:function(){
                return $(this).prop('checked');
            },
            setState:function(value){
                var jIcon = $(this).nextAll('.input-icon');
                $(this).prop('checked', value);
                value ? jIcon.addClass("checked") :jIcon.removeClass("checked");
            },
            disabled:function(value){
                $(this).attr('disabled', value);
                value ? $(this).closest('.xb-checkbox').addClass("disabled") : $(this).closest('.xb-checkbox').removeClass("disabled");
            }
        };
        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method === 'object' || !method)
            return methods.init.apply(this, arguments);
        else
            $.error('Method ' + method + ' does not exist!');
    };

    function _init(oFrame)
    {
        $(".m-input", oFrame).Minput();
        $('input[type=radio]').MRadio();
        $('input[type=checkbox]').MCheckbox();
    }

    function _destroy()
    {
    }

    $.widget("ui.Minput", oInput);
    Widgets.regWidget(UTILNAME, {
        "init": _init, "destroy": _destroy,
        "widgets": [], 
        "utils":[],
        "libs": []
    });
})(jQuery);
