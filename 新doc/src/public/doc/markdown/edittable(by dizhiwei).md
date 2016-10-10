#edittable

##$.EditTable('setOption', oOption)

* `oOption` {Object}

    FilePath: /v3/web/frame/widgets_new/edittable.js

editTable 是一个简单实用的 table 的插件

edittable 的一个简单的例子

```html
<div class="devgrp hide" id="devGrpSel">
    <div class="edittable" id="OSUFriendlyName_edittable">
    </div>
    <div class="error" id="OSUFriendlyName_error">
    </div>
</div>
```

```js

var opt = {
        colNames: getRcText("OSUFriendlyName_HEADER"),
        errorId:null,
        procData: onRowSubmit,
        maxCount:32,
        colModel:[
            //{name:'FriendlyName', required:false,width:25,min:1,maxLen:252,datatype:"String"},
            {name:'LangCode', required:false,width:25,datatype:"Order",data:{start:0,items:aLanguage}}
        ]
    };
 $("#OSUFriendlyName_edittable").EditTable("setOption", opt);
 - `oOpt` - EditTable 配置项具体参数如下 
     + `colNames` - {String} 显示列表的名字
     + `errorId` - {String} 默认为null 报错时会显示设置的id="OSUFriendlyName_error"
     + `procData` - Function 此函数里包含有关edittable的操作，添加行，修改和删除等操作
     + `maxCount` - {Number} 显示数据的最多数量
     + `colModel` - {Array} 显示的操作列，如果只显示一列 colModel里name为一个，如果显示两列及两列以上，添加name属性并赋予不同的属性值
                  - colModel 配置项具体参数如下
                       + `name` - {String} 显示列的名字 
                       + `required` - {Bool} 显示一列默认为false，如果必填的话为true 
                       + `width` - {Number} 显示列的宽度 
                       + `datatype` - {String} 调用Order插件创建下拉菜单
                       + `data` - {Object} 显示列的数据，start的值通过插件转换为option的value值，表示要显示的option，items为要显示的数据数组  
```
注：以上代码需要在 js 中引入 EditTable 插件，引入后会自动对所有的 html 元素进行初始化。

