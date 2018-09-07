# validate-support

jquery表单验证插件,依赖validate插件特性,使用更加方便简单

依赖插件 http://plugins.jquery.com/validate

其中修改依赖插件代码 (用来支持keyup后的验证信息显示)


```javascript

原: if(describedby.length > 0 && event.type != 'keyup') 
现: if(describedby.length > 0)

```
> 特性

1. 提供多个方法可直接使用 
1. 支持自定义函数验证
1. 支持全局配置及局部覆盖配置
1. 操作简单
1. 支持表单不通过时定位到指定元素位置
1. 提示信息可定制化

[demo地址](https://joker-pper.github.io/validate-support/example/)
