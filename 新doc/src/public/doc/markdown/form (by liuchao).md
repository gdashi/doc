#Form


##$.form('init', sType, oOpt)

* `sType` {String}
* `oOpt` {Object}

功能：初始化 form 表单。
sType 随便填就好，对实际操作不会有影响。

oOpt 可选字段：
- `btn_apply` - form 表单确认按钮 {bool}
- `btn_cancel`- form 表单取消按钮 {bool}
- `btn_close` - form 表单关闭按钮 {bool}
- `onClose` - form hide 自定义事件 {function}

##$.form('changeButtons', oNewBtns)

功能：替换按钮，现在接口已经废弃

##$.form('checkTable')

功能：检查 form 中的输入是否符合规范
返回：{bool} true 规范 false 不规范

##$.form('getTableValue', oTable, para)

* `oTable` {Object}
* `para` {Object} | {Bool}

功能：返回查询 id 或 name 对应的 value
返回：{Object}

oTable 参数：
- `index` - {Array} 会将 prefixId 和 index 或 column 中的每一项分别拼接。可以将 prefixId 设为空，查询不同 id 或 name 的数据。或者设定 prefixId，查询以某个元素开头的数据。
- `column` - {Array} 会将 prefixId 和 index 或 column 中的每一项分别拼接。可以将 prefixId 设为空，查询不同 id 或 name 的数据。或者设定 prefixId，查询以某个元素开头的数据。

para 参数：
{Object}
- `prefixId` - {String} 默认为空字符串。使用时会和 index 或 column 中的每一项分别拼接。查找时会将 . 替换成 \. 。会先查找 id，如果不存在会尝试查找 name。
- `onlyEmpty` - {Bool} 是否只返回 value 为空的数据。true 只返回数据为空的id或name。false 返回所有的有值的数据，如果 dom 中有属性 allowempty 也会加进来。
{Bool}
会作为 onlyEmpty 参数

##$.form('updateForm',oData, para)

功能：更新 form 表单
返回：无

* `oData` {Object}
* `para` {Object} | {String}

oData 参数：
dom 的部分 id 或 name 对应的 value 值。

para 参数：
- `prefixId` - {String} 默认为空字符串。使用时会和 oData 的 key 拼接。查找时会将 . 替换成 \. 。会先查找 id，如果不存在会尝试查找 name。

##$.form('appendToSubmit', pfOnSubmit)

功能：未知 已经废弃

##$.form('close', pfClosed)

功能：隐藏 form 表单

* `pfClosed` {Function} form 关闭的方法，如果是模态框，函数不会执行, 窗口会隐藏。