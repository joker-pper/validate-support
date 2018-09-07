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

> 使用方式

<br />

```javascript
$(form).validateSupport(options);

```

> 覆盖默认语言/覆盖默认函数

<br />

```javascript

$.extend($.fn.validateSupport.defaults.language, {
});


$.extend($.fn.validateSupport.defaults.api, {
    phone: function (val) {
        return val == "";
    }
});


```


> options

<br />

```javascript
/**
{
    sendForm: boolean, //默认值true,是否阻止表单的默认提交行为
    eachValidField: fn(event), //元素验证成功时执行(this指当前元素的jquery对象) 
    eachInvalidField: fn(event), //元素验证失败时执行(this同上)
    invalid: fn(event),  //表单提交验证失败时执行(this指当前表单的jquery对象)
    valid: fn(event),  //表单提交验证通过时执行(this同上)
    /**
     * 用于清除验证提示样式的函数(this同上)
     * @param $elements 
     *      {
     *        $el: object, // rule key所对应的表单元素jquery对象 
     *        key: string, // rule key  
     *        $description: object, // rule key所对应的提示元素jquery对象    
     *      }
     * @param rules: 所设置表单元素的rules
     */
    clearAll: fn($elements, rules), 
    /**
      * 可选配置,默认不存在
      * 函数存在时会在每次验证后执行(this指当前元素的jquery对象)
      * @param key: rule key 
      * @param valid: boolean 验证通过或失败
      * @param rules
      */ 
    always: fn(key, valid, rules),
    /**
    * 可选配置,默认不存在
    * 存在时会在表单不通过滚动到当前表单首位错误元素的位置
    */
    scrollToError: {
       /**
        * 
        * this指当前错误元素的jquery对象
        * @param key: rule key
        * @param rules
        * @param return number
        */
        offset: number || fn(key, rules) //基于当前错误元素位置的offset值
        duration: number //scroll duration 可选,默认值500 
    },
   /**
    * 
    * 用于全局设置元素是否required,默认值false
    * 【局部rule中key的该参数可覆盖对应元素的属性】  
    * @param $el: 当前key对应元素的jquery对象
    * @param key: rule key
    * @param rules
    * @return boolean
    */
    required: boolean || fn($el, key, rule),  
    trim: boolean,  //全局设置是否启用trim, 默认false 【局部rule中key的该参数可覆盖对应元素的属性】
    /**
    *
    * 不存在时默认作为当前表单元素父级的兄弟元素
    * 用于设置提示元素显示的位置(全局)【rule中key的该参数可覆盖全局,参数一致】
    * 
    * @param $description: 当前key对应提示元素
    * @param $el: 当前key对应元素的jquery对象
    * @param key: rule key
    * @param rule
    */   
    description: null || function($description, $el, key, rule),  
    descriptionPrefix: string, //生成提示信息元素的前缀,默认validate
    /**
    *
    * 用于设置提示元素显示的显示内容元素(全局)【rule中key的该参数可覆盖全局,参数一致】
    * 提示类型总共分为四种 required(必填)  pattern(正则不通过)  valid(验证通过) conditional(自定义函数不通过)
    * 主要介绍required,其他三种同理
    */   
    message: {  
        required: {  
            /**
            * 
            * 提示元素的html内容
            * 默认值: <span class="help-block">{content}</span>
            * 【{content}作为提示文字的占位符】
            * @param key: rule key
            * @return string
            */
            template: string || fn(key),  /**
            * 
            * 提示文字
            * 默认值: $.fn.validateSupport.defaults.language.required
            * @param key: rule key
            * @return string
            */
            content: string || fn(key), 
        },
        pattern: {
            template: string || fn(key), 
            content: string || fn(key)
        },
        conditional: {  
            template: string || fn(key), 
            content: string || fn(key)
        },
        valid: {  
           template: string || fn(key), 
           content: string || fn(key)
        }
    },
    rules: {}
}
*/

```


