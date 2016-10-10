#switch

##switch(说明)

功能 ： bootstrap-switch插件这是一个针对Bootstrap实现的开关（switch）按钮控件，可以支持尺寸、颜色等属性的自定义。

##switch（实例）

说明 ： 简单介绍chekbox与radio的两个表单的简单使用，点击按钮以滑动的方式进行on/off切换。

###chekbox

- ` ` -
<div class = "make-switch" data-on="info" data-off="success">
     <input type="checkbox" checked>
</div>
   + `make-switch` - 对使用插件的checkbox添加css样式。
   + `data-on` - 为on状态时的css样式。
   + `data-off` - 为off状态时的css样式。

###radio

- ` ` -
<lable for="option11">Option 1</lable>
<div class="make-switch radio2">
     <input id="option11" type="radio" name="radio2" value="option11">
</div>
   + ` ` -  radio单选框的使用方法是相同的。


##switch(几个重要参数)

- `Size（尺寸）` -

   + `size` -  <div class="switch switch-large"> <input type="checkbox" checked /> </div>

- `Colors（颜色）` -

    + `colors` -  <div class="switch" data-on="primary" data-off="info">
    <input type="checkbox" checked /></div>  

- `Animation（动画）` -

    + `animation` -   <div class="switch" data-animated="false">
    <input type="checkbox" checked /></div>

- `Disabled（禁用）` -

    + `disabled` -   <div class="switch">
   <input type="checkbox" checked disabled /></div>

- `Text（文本）` -

    + `text` -  <div class="switch" data-on-label="SI" data-off-label="NO">
    <input type="checkbox" checked /></div>

- `Event handler（事件处理）` -

    + `event handler` -  $('#mySwitch').on('switch-change', function (e, data) {
    var $el = $(data.el)
    , value = data.value;
    console.log(e, $el, value);
});

- `Destroy（销毁）` -

    + `destroy` -   $('#destroy-switch').bootstrapSwitch('destroy');

- `Create（创建）` -

    + `create` -  $('#create-switch').wrap('<div class="switch" />').parent().bootstrapSwitch();


##bootstrap-switch属性及应用

    

- ` ` -  　　　　　　　[js属性名]　　　　[html属性名]　　　　[类型]　　　　[描述]　　　　　[取值范围]　　　　　　　　　　[默认值]  

 
  + `create` -　　state　　　　　　　checked　　　　　　Boolean　　　选中状态　　　　　true\false　　　　　　　　　　true
  + `create` -　　size　　　　　　　　data-size　　　　　String　　　开关大小　　　　　null\mini\small\large　　　　　null

  + `create` -　　animate　　　　　　data-animate　　　Boolean　　　动画效果　　　　　true\false　　　　　　　　　　　true

  + `create` -　　disabled　　　　　　disabled　　　　　Boolean　　　禁用开关　　　　　true\false　　　　　　　　　　　false

  + `create` -　　readonly　　　　　　readonly　　　　　Boolean　　　开关只读　　　　　true\false　　　　　　　　　　　false

  + `create` -　　indeterminate　　　indeterminate　　　Boolean　　　模态　　　　　　　true\false　　　　　　　　　　　false

  + `create` -　　inverse　　　　　　data-inverse　　　Boolean　　　　顺序颠倒　　　　true\false　　　　　　　　　　　false

  + `create` -　　radioAllOff　　　　all-off　　　　　　Boolean　　　单选按钮取选　　　true\false　　　　　　　　　　　false

  + `create` -　　onColor　　　　　　on-color　　　　　　String　　　左开关颜色　　　　info\primary\danger\success　　primary

  + `create` -　　offColor　　　　　　off-color　　　　　String　　　右开关颜色　　　　info\primary\danger\success　　primary

  + `create` -　　onText　　　　　　　on-text　　　　　　String　　　左开关文本　　　　String　　　　　　　　　　　　　ON

  + `create` -　　offText　　　　　　off-text　　　　　　String　　　右开关文本　　　　String　　　　　　　　　　　　　OFF

  + `create` -　　labelText　　　　　label-text　　　　　String　　　开关中间文本　　　String　　　　　　　　　　　　　&nbsp;

  + `create` -　　handleWidth　　　　handle-width　　　StringNumber　开关两侧宽度　　　String\Number　　　　　　　　　auto

  + `create` -　　labelWidth　　　　　label-width　　　　String　　　开关中间宽度　　　String\Number　　　　　　　　　auto

  + `create` -　　baseClass　　　　　base-class　　　　　String　　　开关基础样式　　　String　　　　　　　　　　　　bootstrap-switch

  + `create` -　　wrapperClass　　　　wrapper　　　　　　String　　　元素样式容器　　　String\Array　　　　　　　　　wraper

  + `create` -　　onInit　　　　　　　checked　　　　　　function　　初始化开关　　　　function　　　　　　　　　　　function(event,state){}
 





