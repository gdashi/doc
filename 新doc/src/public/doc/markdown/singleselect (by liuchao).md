#SingleSelect

    FilePath: /v3/web/frame/widgets_new/singleselect.js
    
SingleSelect 是一个简单实用的单选框，提供简单而丰富的 api 。
使用时可以自动初始化，可以简单方便的对单选列表进行操作。

下面是一个简单的单选框例子：

```html
<select class="singleSelect" allowClear="true" id="test">
</select>
```

```js
 $('#test').singleSelect("InitData", ['test1', 'test2', 'test3']);
```

##$.("InitData", aData, oOpt)

* `aData` {Array}
* `oOpt` {Object}

初始化列表数据，使用后会首先清空之前的数据，然后根据 oOpt 中的字段对列表进行配置。
可以在 html 中添加 allowClear 属性来配置是否允许清空，但是属性值必须为 true 或 false

- `aData` - {String}|{Object}|{Array} 要显示的数据内容，只能选择其中一种数据类型，
如果为 {String} 则使用 value 方法获取的值和显示的文本内容相同 
如果为 {Object} 需要注意 displayField 和 valueField 字段；
如果为 {Array} 则会需要将 selectGroup 属性设置为 true

- `oOpt` - singleselect 配置项具体参数如下
    + `displayField` - {String} 需要显示的文本内容，默认为 text ，需要 aData 单元数据类型为 {Object} 
    + `valueField` - {String} 需要每项内容的 value 值，默认为 value ，需要 aData 单元数据类型为 {Object}
    + `allowClear` - {Bool} 是否允许清空，默认为 true ，可以在 html 中进行配置
    + `selectGroup` - {Bool} 是否为组列表（感觉这个词不太好），默认为 false ，需要 aData 单元数据类型为 {Array}
    + `sort` - {Bool} 是否排序,默认为 false ，如果为是则对现实的文本按照字母序排序，否则按初始顺序排列
    
##$.("appendData", aData)

* `aData` {Array}

向列表中添加数据，单元数据格式需要和初始化时的配置相对应。

##$.("value", aValue)

* `aValue` {String}|{Undefined}

如果 aValue 类型为 String 则设置列表的值为aValue
如果 aValue 类型为 Undefined 则获取当前列表的值, 返回值类型为 String

##$.("getSelectedData")

返回被选中的对象，返回类型为 Object ，参数为 valueField 和 displayField

##$.("disable")

去使能 singleselect

##$.("enable")

使能 singleselect

##$.("empty")

清空 singleselect 中的所有数据
