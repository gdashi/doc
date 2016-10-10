#Editlist

##$.Editlist('head', oOption)

* `oOption` {Object}

功能：初始化Editlist

说明：可编辑的列表框控件，可用table键进行切换。

oOption 可选字段：
如果 
- `buttons` - {Array} 按钮列表，需要数组中每一项类型为 {Object}
    + `name` - {String} 按钮类型，支持的类型有 detail, delete, edit, reboot, download, upgrade, import
                        会调用 createDefButtons 添加按钮，
                        支持的按钮会被放在每行的最后，不支持的按钮会放在表格上方，                 
    + `enable` - {Bool} 按钮使能，如果不使能，则不会显示。
    + `action` - {Function} 
    + `value` - {String} 按钮中间的文本
    + `mode` - {Object} 配置icon图标使用，不推荐使用，会将icon 字段替换为mode.icons.primary
    + `icon` - {String} 按钮图标样式，可以使用 font-awesome 提供的字体 如 fa fa-sign-in。如果不填该字段 会生成无图标的按钮 
    + `description` - {String} 按钮的 title 属性，如果不存在使用 value 字段


- `colModel` - {Array} 每项列配置
    + `name` - {String} 每列数据对应的 key 值，名称不能为 Editlist_operation
    + `showTip` - {Bool} 是否显示，默认为 true
    + `width` - {Integer} 每列的宽度 默认值为平均分配 这块代码没仔细看
    
- `colName` - {Array}|{String} 表头名称，如果是字符串需要用`,`分割，长度和colModel保持一致
- `multiSelect` - {Bool} 是否支持多选
- `sortable` - {Bool} 是否支持排序
- `onToggle` - {Object} Editlist列展开
    + `action` - {Function} 参数 oRowData ，显示点击时的下拉展开
    + `jScope` - {Object} 下拉列表 jQuery 对象
    + `BtnDel` - {Object} 删除按钮
        * `Show` - {Bool} 是否显示
        * `action` - {Function} 参数 oRowData ,响应删除事件
- `pageSize` - {Integer} 每页最大行数，默认是0，不会分页显示
- `onPageChange` - {Function} 分页响应事件，需要 pageSize 的参数不为0，参数 pageSize pageNum oFilter
- `asyncPaging` - {Bool} 分页查询使能，
- `onSearch` - {Function} 查询回调函数，参数 oFilter oSorter
- `onSort` - {Function} 排序回调函数，参数 sName isDesc

##$.Editlist('refresh', aData)
功能：更新数据

* `aData` {Object}|{Array}

aData 字段说明
1. asyncPaging 使能：
    - `total` - {Integer} 数据的总数
    - `pageNum` - {Integer} 当前的页码
    - `data` - {Array} 当前页的数据

2. asyncPaging 不使能 直接传入数据就好

##$.Editlist('extend', aData)
功能：增加数据

aData 『』

##$.Editlist

说明：列表框里的数据是可以随时编辑的

