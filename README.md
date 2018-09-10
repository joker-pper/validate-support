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
1. 支持全局配置及局部覆盖配置,提示信息可定制化
1. 操作简单
1. 支持表单不通过时定位到指定元素位置
1. 在rules中添加配置后才会进行元素限制


> 使用方式

```javascript
$(form).validateSupport(options);

```

> demo演示

[地址](https://joker-pper.github.io/validate-support/example/)


> 覆盖默认语言/覆盖默认函数

```javascript

$.extend($.fn.validateSupport.defaults.language, {
});


$.extend($.fn.validateSupport.defaults.api, {
    phone: function (val) {
        return val == "";
    }
});


```

> api

```javascript
    clearAll() //清除提示样式 
    getRule(key) //获取指定key的rule 
    getField(key) //获取指定key的field对象
    scrollErrorTo(key) //滚动到指定错误元素,key为null时是滚动到默认 根据error配置项执行,必须为error field才会执行
    scrollTo(key, offset, duration) //滚动到指定元素 offset及duration同options中scrollToError的参数
```

> options 参数 (均可重写覆盖)

```javascript
/**{
    sendForm: boolean, //默认值true,是否为表单的默认提交行为
    eachValidField: fn(event), //元素验证成功时执行(this指当前元素的jquery对象) 
    eachInvalidField: fn(event), //元素验证失败时执行(this同上)
    invalid: fn(event),  //表单提交验证失败时执行(this指当前表单的jquery对象)
    valid: fn(event),  //表单提交验证通过时执行(this同上)
    /**
    * 用于清除验证提示样式的函数(this同上)
    * @param $elements:
    *      {
    *        $el: object, // rule key所对应的表单元素jquery对象 
    *        key: string, // rule key  
    *        $description: object, // rule key所对应的提示元素jquery对象    
    *      }
    * @param rules: 所设置表单元素的rules
    */
    clearAll: fn($elements, rules), 
     /**
     * 默认不存在
     * 函数存在时会在每次验证后执行(this指当前元素的jquery对象)
     * @param key: rule key 
     * @param valid: boolean 验证通过或失败
     * @param rules
     */ 
    always: fn(key, valid, rules),
    /**
    * 默认不存在
    * 存在时会在表单不通过滚动到当前表单首位错误元素的位置
    */
    scrollToError: {
       /**
        * 
        * this指当前错误元素的jquery对象
        * @param key: rule key
        * @param rules
        * @return number
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
    * @param rule
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
    /**
    * 生成提示信息的元素id前缀,默认值为validate
    * 最终名称: descriptionPrefix + key + "-description"
    */  
    descriptionPrefix: string, 
    /**
    * 生成提示信息的元素所应用的class,默认值validate-description
    */  
    descriptionClass: string,
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
            template: string || fn(key),  
            /** 
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
    rules: {
        /**
        * key是作为当前表单元素的标识
        * 表单如何匹配元素(id > selector > key默认匹配): 
        *   id (boolean) 当前key作为id选择器匹配
        *   通过selector匹配对应元素(string||fn)
        *   selector不存在时根据name属性(key)在当前表单匹配
        * 
        * rule key所支持函数属性将单独列出  
        */ 
        key: {
                id: boolean,  //是否以key作为id选择器
                /**
                * 正则表达式,用于验证是否满足条件,不通过时显示当前key所应用的pattern提示信息
                */
                pattern: string,
                /** 
                * 用于格式化元素值满足正则验证后应用
                */
                mask: string,
                /** 用于匹配当前key元素的jqery对象,string时直接作为选择器匹配对象
                * @param $form: 当前表单jquery对象
                * @return object: 当前key对应的表单元素jquery对象
                */
                selector: string || fn($form), 
                /**
                * 自定义函数验证当前元素是否满足条件
                * 返回值为boolean: false时显示当前key所应用的conditional提示信息
                * @param $el
                * @param key
                * @param rule
                * @param rules
                * 
                * @return boolean 
                *           ||
                 *        {
                *           status: boolean, //是否验证通过
                *           error: string //status为false时,用于作为当前key的提示信息(不存在时采用默认的conditional提示信息)
                *         }
                */
                conditional: fn($el, key, rule, rules),
                /*** 以下属性参数,可以覆盖对应的全局配置项 ***/ 
                message: {
                },
                required: boolean || fn($el, key, rule),  
                trim: boolean,  
                description: null || function($description, $el, key, rule)
                    
        }  
    
        
    }
}*/

```

> rule key中支持函数配置

```javascript

range: [number, number]  //验证值是否在指定区间范围

/**
* equalTo 验证元素值是否相等,
* 参数为string时为对应元素key(同对象参数key),
* 参数为对象时error值可覆盖默认equalTo函数提示文字 
*/
equalTo: string || {key: string, error: string}



maxlength || minlength (会依赖trim参数值)
参数值 number || {}
    默认转化为{}验证,参数值为number时作为长度
{
    twoCharLinebreak: boolean, //默认值true
    utf8: boolean,  //默认值false
    size: number //长度,整数
}



//其他函数
number(数字), url, email, digits(整数), idcard, phone, date, dateISO
参数值 boolean || 0 || 1 

min(最小值) max(最大值)
参数值 number

```


> 代码示例 (demo中的示例二) [地址](https://joker-pper.github.io/validate-support/example/#form2)

```javascript

$("form").validateSupport({
        eachValidField: function (event) {
            //成功时添加的样式
            var $this = this;
            $this.parents('.form-group').removeClass('has-error').addClass('has-success has-feedback');
            var $feedback = $this.next(".glyphicon");
            if (!($feedback[0])) {
                $feedback = $('<span class="glyphicon form-control-feedback" aria-hidden="true"></span>');
                $feedback.insertAfter($this);
            }
            $feedback.removeClass('glyphicon-remove').addClass("glyphicon-ok");
        },
        eachInvalidField: function (event) {
            //失败时
            var $this = this;
            $this.parents('.form-group').removeClass('has-success').addClass('has-error has-feedback');
            var $feedback = $this.next(".glyphicon");
            if (!($feedback[0])) {
                $feedback = $('<span class="glyphicon form-control-feedback" aria-hidden="true"></span>');
                $feedback.insertAfter($this);
            }
            $feedback.removeClass('glyphicon-ok').addClass("glyphicon-remove");
        },
        clearAll: function ($elements, rules) {
            //用于清除提示的样式
            for (var i in $elements) {
                var $element = $elements[i];
                $element.$description.children().remove();
                var $el = $element.$el;
                $el.parents('.form-group').removeClass("has-success has-error");
                $el.next(".glyphicon").remove();
            }
        },
        sendForm: false, //阻止表单的默认提交行为
        message: {
            valid: {  //通过验证时的提示模板
                content: function (key) {
                    return "通过验证";
                }
            },
            pattern: {
                content: function (key) {
                    return "验证失败";
                }
            },
            conditional: {
                content: "验证失败"
            },
            required: {
                content: function (key) {
                    return "必填项";
                }
            }
        },
        description: function ($description, $el, key, rule) {
            //全局设置提示元素显示的位置
            $description.insertAfter($el);
        },
        required: true,  //rules中配置的将会使用该属性,如果其存在将会进行覆盖
        trim: true,
        rules: {
            name: {
                minlength: {
                    size: 2
                },
                maxlength: {
                    size: 20
                },
                conditional: function ($el, key, rule, rules) {
                    //自定义函数验证
                    var value = $el.val();
                    if (value == "joker") {
                        //error将作为当前不通过的验证提示
                        return {status: false, error: "you are joker"};
                    } else if (value == "yyc") {
                        return {status: false};
                    } else {
                        return {status: true};
                    }
                    return true;
                },
                message: {
                    valid: {  //覆盖验证通过时的提示
                        content: '名称通过验证'
                    }
                }
            },
            email: {
                email: true
            },
            idcard: {
                required: false,
                idcard: true
            }
        },
        invalid: function (event, options) {  //提交表单验证不通过时
            //console.log(this)
        },
        valid: function (event, options) {
            alert(this.serialize());
        }
    });
```


