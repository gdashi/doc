#openDlg
openDlg是框架封装的弹框，用于点击后弹出，也可用于跳转，一般和Form搭配使用，form会为弹框加上标题、关闭按钮、确定和取消按钮。

下面是一个简单的例子：

```html
<div class="hide modal fade" id="devDlg">
     <form id="dev_form" class="form edit">
          <div id="healthList" class="simple-list hide"></div>
     </form>
</div>
```

```js
$("#dev_form").form ("init", "edit", {"title":getRcText("DEV_NAME"),"btn_apply":true, "btn_cancel":true});
Utils.Base.openDlg(null, {}, {scope:$("#devDlg"),className:"modal-super"});
```

###openDlg(sUrl, oPagePara, oDlgPara)

* `sUrl` 可为null，如果为null，在当前页面显示。
* `oPagePara` 只有sUrl是传入的url时，此参数才会起作用，一般会传个{}。
* `oDlgPara` -{Object} 包含两个属性scope和className,其中scope的value的值对应的是html中的最外层的id.className的值可以是modal-super,modal-large,modal-small,控制弹出框的大小。

其中看框架的代码,oPagePara此参数也可以是{String}，但是框架实现有问题，也没有人用过这个，先不写这个说明。


#getRcString
 
js中为了不出现乱码一般不允许写中文，中文写在html文件中，getRcSting就是为了把html中的中文引入js中而出现的。它通常由各个页面的自己写函数来调用（getRcText）.

下面是一个简单的例子：

```html
<div id="wifi_dashboard_rc" class="rc-define" ALERTLIST="设备名,告警时间,告警内容"></div>
```

```js
function getRcText(sRcName){
        return Utils.Base.getRcString('wifi_dashboard_rc', sRcName);
    }
```

此处是sRcName指ALERTLIST

###getRcString(sRcId, sRcName)

* `sRcId` html中的id。
* `sRcName` html中的属性名。

#redirect

用于页面的跳转，并且还可以向跳转后的页面传递参数。

下面是一个简单的例子：

```
Utils.Base.redirect({ np:"b_deviceinfo.summary",id:'123'});
```
###redirect(oParas, sUrl/*=null*/)

* `oParas` -{Object}需要传入跳转到页面的文件名以及参数。
* `sUrl` 为null时，表示在当前点击页面显示，不为空时，跳转到传入的menu页面显示。

*oParas经过处理后会被拼接成URL中问号后面的内容：?np=b_deviceinfo.summary&id=123,新的页面会通过拆分url获得传过来的参数。*


#refreshCurPage
用于刷新当前页面，如果有弹框就不进行刷新，没弹框的话，会重新刷新当前页面。

使用实例：

Utils.Base.refreshCurPage();

#addComma
1.用于规范化数字格式,如：1000，会转换成1,000 2.方便数据过大时转换单位，如：内存和速率。

简单使用实例：

Utils.Base.addComma(1024000,'rate') 转换后的结果是："1,000.0Kbps"

###Utils.Base.addComma(sNum,Stype/*Stype=rate,.memory*/,nStart,nEnd')

* `sNum` {Number}或者{String} 需要转换的数据。
* `Stype` {String}可以传入'rate'和'memory'。
* `nStart` 默认为0。
* `nEnd` 默认为3。