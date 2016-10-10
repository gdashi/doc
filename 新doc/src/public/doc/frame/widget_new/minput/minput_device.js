;(function($)
{
    var UTILNAME = "Minput";

    $.fn['MPassword'] = function (method){
        var methods = {
            init : function(){
                this.each(function(){
                    if($(this).data("MPassword")) return true;

                    var jEle = $(this).data("MPassword",true);
                    var jIcon = $('<span class="icon-eye"></span>');
                    var jText = $('<input type="text" class="hide"/>');
                    var aClass = jEle.attr("class").split(" ");
                    var sID = jEle.attr("id");
                    jEle.wrap('<div class="xb-input xb-password"></div>').after(jIcon);
                    jIcon.after(jText);

                    if(jEle.attr("min"))
                    {
                        jText.attr("min",jEle.attr("min"));
                    }

                    if(jEle.attr("maxlength"))
                    {
                        jText.attr("maxlength",jEle.attr("maxlength"));
                    }

                    for(var i=0;i<aClass.length;i++)
                    {
                        jText.addClass(aClass[i]);
                    }

                    jText.attr("errid",jEle.attr("errid") || jEle.attr("id")+"_error");
                    jText.attr("id",jEle.attr("id"));

                    jIcon.click(function(){
                        if($(this).hasClass("disabled"))
                        {
                            return false;
                        }

                        if($(this).hasClass('show-word'))
                        {
                            $(this).removeClass('show-word');
                            jText.hide();
                            jText.trigger('keyup')
                            jEle.show();
                        }
                        else
                        {
                            $(this).addClass('show-word');
                            jText.show();
                            jEle.hide();
                            jEle.trigger('keyup')
                        }
                    });

                    jEle.keyup(function(){
                        var sVal = $.trim(jEle.val());
                        jText.val(sVal);
                        jEle.val(sVal)
                    });

                    jText.keyup(function(){
                        var sVal = $.trim(jText.val());
                        jText.val(sVal);
                        jEle.val(sVal)
                    });
                });
            },
            disabled: function(value){
                if(value)
                {
                    $(this).prop('disabled',true).val("").show()
                    .next().addClass("disabled").removeClass("show-word")
                    .next().prop('disabled',true).val("").hide();
                }
                else
                {
                    $(this).prop('disabled',false).next().removeClass("disabled").next().prop('disabled',false);
                }
            }
            ,bindEvent:function(sType,callback)
            {
                $(this).bind(sType,callback);
                $(this).nextAll("input").bind(sType,callback);
            }
        };
        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method === 'object' || !method)
            return methods.init.apply(this, arguments);
        else
            $.error('Method ' + method + ' does not exist!');
    };

    $.fn['Minput'] = function (method){
        var addRow = function(jContainer,sType,isAdd){
            var sIcon = isAdd ? "minput-add" : "minput-remove";
            var sTip = isAdd ? $.MyLocale.Buttons.ADD : $.MyLocale.Buttons.DEL;
            var sErrId = jContainer.attr('errid') || jContainer.attr("id")+"_error";
            var sHtml = '<div class="input-row">' +
                            '<input type="text" class="big '+sType+'" errid="'+sErrId+'"/>' +
                            '<span class="minput-operator '+sIcon+'" title="'+sTip+'"></span' +
                        '</div>';
            var jRow = $(sHtml).appendTo(jContainer);

            $('input',jRow).on("blur",function(){
                Utils.Widget.checkEle($(this));
            });

            $('span',jRow).on("click",function(){
                $(this).closest('.m-input').trigger("change");
                if(!isAdd)
                {
                    Utils.Widget.setError(jRow.find('input'),"");
                    jRow.remove();
                    return ;
                }
                var jInput = jContainer.find('input');
                var isError = !!jInput.filter(".text-error").length;
                var nMax = jContainer.attr("maxLen") || 20;
                var nCur = jInput.length;
                if(!isError && nCur < nMax)
                {
                    addRow(jContainer,sType);
                }
                else if(nCur >= nMax)
                {
                    Utils.Msg.alert($.MyLocale.CANNOT_ADD.replace("%d",nMax));
                }
            });

            return jRow;
        };

        var methods = {
            init : function(){
                this.each(function(){
                    if($(this).data("Minput")) return true;

                    var jEle = $(this).data("Minput",true).addClass('xb-input');
                    var sType = jEle.attr("checktype") || "string";
                    addRow(jEle,sType,true);
                });
            },
            value: function(aValue){
                if(typeof aValue == "undefined")
                {
                    aValue = [];
                    $("input",this).each(function(){
                        var $this = $(this);
                        if($(this).val() && !$(this).is(".text-error"))
                        {
                            aValue.push($(this).val());
                        }
                    });

                    return aValue;
                }

                if(!$.isArray(aValue))
                {
                    aValue = [aValue];
                }

                var sType = $(this).attr("checktype") || "string";
                var i = 0;
                $("input",this).each(function(){
                    if(typeof aValue[i] != "undefined")
                    {
                        $(this).val(aValue[i]);
                    }
                    else if(i)
                    {
                        $(this).closest('.input-row').remove();
                    }

                    i++;
                });

                for(;i<aValue.length;i++){
                   addRow($(this),sType).find('input').val(aValue[i]);
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

    $.fn['MRadio'] = function (method){
        var methods = {
            init : function(){
                this.each(function(){

                    if($(this).data("MRadio")) return true;

                    var jEle = $(this).data("MRadio",true), jAll, jBrother,
                        jLabel = $('<label class="input-label"></label>'),
                        jIcon = $('<span class="input-icon radio-icon"></span>');
                    var sId = jEle.attr("id"), sName = jEle.attr("name");

                    jAll = $('input[type=radio][name='+sName+']');
                    jBrother = jAll.not('[id='+sId+']');

                    jEle.wrap('<div class="xb-input xb-radio"></div>').addClass("input-element");
                    jLabel.attr("for",sId).insertAfter(jEle);
                    jIcon.insertAfter(jEle);

                    if(this.checked)
                    {
                        jIcon.addClass("checked");
                    }

                    jLabel.on('click touchend', function (e){
                        jIcon.addClass("checked");
                        jBrother.trigger("xb-change");
                    });

                    jEle.on('xb-change',function (e){
                        jIcon.removeClass("checked");
                    });

                    jAll.on('change',function(e,isTrigger){
                        if(!isTrigger)
                        {
                            $(this).nextAll('.input-label').trigger("click").trigger("touchend");
                        }
                    });

                });
            },
            value: function(value,triggerChange){
                if(typeof value == "undefined")
                {
                    return $(this).filter(":checked").val();
                }

                $(this).nextAll('.input-icon').removeClass("checked");
                $(this).filter("[value=" + value + "]")
                       .attr("checked", true)
                       .nextAll(".input-icon")
                       .addClass("checked");
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
            value: function(value){
                if(typeof value == "undefined")
                {
                    return $(this).prop('checked');
                }

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
        $("input[type=password]", oFrame).MPassword();
        $('input[type=radio]', oFrame).MRadio();
        $('input[type=checkbox]', oFrame).MCheckbox();
    }

    function _destroy()
    {
    }

    Widgets.regWidget(UTILNAME, {
        "init": _init, "destroy": _destroy,
        "widgets": [],
        "utils":["Widget"],
        "libs": []
    });
})(jQuery);