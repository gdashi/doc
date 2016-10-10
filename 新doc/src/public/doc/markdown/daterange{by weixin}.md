#DateRange
日期和时间范围控件，根据需求不同有三种类型可供选择：可选择年份日期时间，可选择年份日期，可选择日期时间。

##html初始化
    可选择年份日期时间：<input type="text" class="datetimerange" />
                        $(".datetimerange").datetimerange({
                            format:"YYYY/MM/DD HH:MM:SS",  //需要的时间格式
                            timePicker:true,       //是否需要时间范围
                            timePickerIncrement:1,
                            timePicker12Hour:falese,    //是否是12小时制
                            separator:"-",   //开始时间和结束时间之间的连接字符
                        });


    可选择年份日期:<input type="text" class="daterange" />
                        $(".datetimerange").datetimerange({
                            format:"YYYY/MM/DD HH:MM:SS",
                            timePicker:false,                     
                            separator:"-",
                        }); 


    可选择日期时间:<input type="text" class="datetimerange" yearRangeClosee="true" />   

##js注册
	widget：["Form","DateRange"],

##相关接口

####设置数据
    $("#id").daterange("setRangeData".sDate)或$("#id").daterange("value",sDate); sDate需要和初始化时的时间格式保持一致。
    $("#id").daterange("setRangeData".sDate,opt); //opt可重新设置时间格式
        opt={format:"YYYY-MM-DD",separator:"to"}; 
        sDate="2016-01-01 to 2016-12-31";
####取出数据
    返回字符串：$("#id").daterange("value")或$("#id").val();
    返回object：$("#id").datetime("getRangeData");
####禁用
	$("#id").daterange("disable");
####开启
	$("#id").daterange("enable");
                