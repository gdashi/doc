#DateTime
该控件包括日期控件datewidget和时间控件timewidget

##html初始化
	日期控件：<div class="datewidget"></div>
	时间控件：<div class="timewidget"></div>

##js注册
	widget：["Form","DateTime"]

##相关接口

####设置数据
	日期：$("#id").datetime("setDate",sDate);sDate需要日期格式，如：“2016/06/22”
	时间：$("#id").datetime("setTime",sTime);sTime需要时间格式，如：“18：00：00”
####取出数据
	获取时间：$("#id").datetime("getDate");
	获取时间：$("#id").datetime("getTime");
####禁用
	$("#id").datetime("disable");
####开启
	$("#id").datetime("enable");