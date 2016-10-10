#dialog

    FilePath: /v3/web/frame/widgets/dialog.js
    
   dialog是一个显示对话框，对各种对话框进行了封装，包括提示信息对话框、错误对话框、等待对话框、加载对话框等。
   
##信息提示框

   在页面中适当的位置显示一个提示信息, 并且在2秒钟后自动消失. 一般用于下发成功后显示成功的提示信息，也可以显示下发失败的的提示信息。

   
###使用方法实例（默认是成功的提示信息）：
   
####Frame.Msg.info("提示信息");
   
   
####Frame.Msg.info(sMsg,sType);
  
   * `sMsg` : string, 提示信息字符串(通常我们用getRctext函数传入需要提示的信息)。
   * `sType` : String, 提示框的类型. 可以是"ok", "info", "error". default is "ok"
   
  提示错误信息使用实例：
   
  Frame.Msg.info("错误",'error');


##等待对话框
  
  在页面中显示一个等待对话框等待页面执行某一任务, 在任务完成后由页面主动发送"close"事件关闭该对话框. 对话框中没有关闭图标,没有确定和取消等按钮,
  
###使用方法实例:

####Frame.Msg.wait("等待信息");

####Frame.Msg.wait(para);
  
   * `para` - string, 等待信息字符串。(通常我们用getRctext函数传入需要的信息)
   
   当任务完成后页面必须向该ID发送close事件以关闭对话框.
  
   实例：var hwait = Frame.Msg.wait("等待信息"); hwait.close();
   
##警告对话框（alert）
 
  显示提示信息对话框, 是window.alert的一种扩展. 以弹出对话框的形式显示一个提示信息. 该接口不阻塞代码, 因此点击确定后才能执行的代码需要封装到一个函数中, 做为cb参数传入.

####Frame.Msg.alert(sMsg, cb);
   
   * `sMsg` - string, 提示信息字符串。(通常我们用getRctext函数传入需要的信息)
   * `cb` - function, 点击确定后的回调函数, 可以没有。
   
###使用实例：（无回调函数）   
  
####Frame.Msg.alert("警告信息");

 
   
##错误提示对话框（error）
 
  错误提示信息对话框, 是window.alert的一种扩展. 以弹出对话框的形式显示一个提示信息. 该接口不阻塞代码, 因此点击确定后才能执行的代码需要封装到一个函数中, 做为cb参数传入.

####Frame.Msg.error(sMsg, cb);
   
   * `sMsg` - string, 错误信息字符串。(通常我们用getRctext函数传入需要的信息)
   * `cb` - function, 点击确定后的回调函数, 可以没有。
   
###使用实例：（无回调函数）   
  
####Frame.Msg.error("错误信息");


##多个错误提示对话框（merror）

  显示多个错误的提示对话框. 当配置项超过一个, 且设置了<a href="srequest.js.html#Frame.SRequest.SRequestRoot.errorContinue">errorContinue</a>选项后,如果出现了多个错误, 则会使用该接口显示错误信息. 当错误信息较多时, 会出现垂直滚动条.
  
####Frame.Msg.merror(sMsg, cb);

   * `sMsg` -string, 错误信息字符串。可以是纯文本字符串, 也可以是HTML字符串. 使用HTML字符串时需要保证HTML的有效性和正确性.
   * `cb` -function, 点击确定后的回调函数, 可以没有。
   
###使用实例：


####var a =[1,2]; Frame.Msg.merror(a);
    sMsg = '<div class="row">' + aMsg.join('</div><div class="row">') + '</div>';传入的字符串拼接起来。
   
##确认信息提示框（confirm）
  显示确认对话框, 替代window.confirm.
  
####Frame.Msg.confirm(sMsg, cb);

   * `sMsg` - string, 提示信息字符串。
   * `cb`- function, 点击确定后的回调函数, 可以没有。
    
###使用实例：
    
    Frame.Msg.confirm("提示信息");
    
##页面加载对话框（pending）
  
 加载对话框，以菊花的形式显示。
 
####Frame.Msg.pending(sMsg,SType);
   * `sMsg` - string, 提示信息字符串。
   * `SType`- 默认是pending,可以没有。
   
###使用实例：
    
    Frame.Msg.confirm("提示信息");
    当任务完成后页面必须向该ID发送close事件以关闭对话框.
  
    实例：var hwait = Frame.Msg.wait("等待信息"); hwait.close();
