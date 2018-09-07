# validate-support
表单验证插件,依赖validate插件特性,使用更加方便简单


依赖插件 http://plugins.jquery.com/validate

其中仅修改代码 (用来支持keyup后的验证信息显示)
if(describedby.length > 0 && event.type != 'keyup') 为 
if(describedby.length > 0)
