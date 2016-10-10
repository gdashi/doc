#Minput 绿洲版本

    FilePath: /v3/web/frame/widgets_new/minput.js
    
[文件下载](/doc/frame/widget_new/minput/minput_lvzhou.js)
    
Minput 是一个超简单的基于 input 的插件，现在绿洲云上和小贝的实现是不同的。
布吉岛将来会怎么发展了，文档里会完成两个版本的说明。

绿洲版本的 Minput

现在云上主要使用的是 MRadio 和 MCheckbox 其他的没有使用过。

MRadio 的一个简单的例子

```html
<input type="radio">
```

MCheckbox 的简单的例子

```html
<input type="checkbox">    
```

注：以上代码需要在 js 中引入 Minput 插件，引入后会自动对所有的 html 元素进行初始化。

##MRadio

MRadio 是框架生成的，仿原生 radio 的一个插件。
开发这个插件的原因是因为各个浏览器对 radio 实现都不相同，
为了整体网站风格的统一，自己“实现”了一个 radio 。
插件中对触屏做了支持，可以方便的使用。

MRadio 限制：只能生成图标在左，文字在右的结构

*建议使用 $('input[type=radio][name=xxx]') 来使用，要不然没效果*

###$.('init')

初始化 MRadio ，如果已经初始化过，则不再初始化。
这个函数会自动调用，不需要管，也不要使用

###$.('getValue')

获取当前被选中的元素的 value 值

###$.('setValue', sValue, triggerChange)

设置 value 为 sValue 的元素被选中，
value 的值是最开始写在 html 中的 value 属性中的。


* `sValue` {String} 要选中的 value
* `triggerChange`


triggerChange默认是true,触发当前value的change事件

##MCheckbox

MCheckbox是框架生成的，仿原生 checkbox 的一个插件。


MCheckbox 限制：只能生成图标在左，文字在右的结构

*建议使用 $('input[type=checkbox][name=xxx]') 来使用，要不然没效果*

###$.('init')

初始化 MCheckbox ，如果已经初始化过，则不再初始化。
这个函数会自动调用，不需要管，也不要使用

###$.('getState')

获取当前元素的选中状态

###$.('setState', sValue)

设置 value 为 sValue 的元素被选中，
value 的值是最开始写在 html 中的 value 属性中的。


* `sValue` {String} 要选中的 value


###$.('disabled','svalue')

设置 value 为 sValue 的元素不可点，
value 的值是最开始写在 html 中的 value 属性中的。