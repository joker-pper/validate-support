/**
 * 依赖于http://plugins.jquery.com/validate
 * @author joker.yyc
 *
 */
//https://github.com/jquery-validation/jquery-validation

(function ($) {
    $.fn.validateSupport = function (options) {
        return validate($(this), options);
    };

    $.fn.validateSupport.defaults = {
        language: {
            required: '此项不能为空',  //非空验证失败的提示
            pattern: '正则验证失败', //正则验证失败时的提示
            success: '验证通过',  //通过验证时的提示
            conditional: '自定义函数验证失败',  //自定义函数验证失败时的提示

            number: "必须是数字",
            email: "请输入正确格式的电子邮件",
            url: "请输入合法的网址",
            digits: "只能输入整数",
            maxlength: "请输入一个长度最多是 {val} 的字符串",
            minlength: "请输入一个长度最少是 {val} 的字符串",
            max: "请输入一个最大是 {val} 的数字",
            min: "请输入一个最小是 {val} 的数字",
            idcard: "请输入合法的身份证号",
            phone: "请输入正确的电话",
            date: "请输入有效的日期",
            equalTo: "请输入相同的值",
            dateISO: "请输入有效的日期 (YYYY-MM-DD)",
            range: "请输入范围在 {0} 到 {1} 之间的数值"
        },
        api: {
            number: function (val) {
                return $.isNumeric(val);
            },
            isBlank: function (val) {
                return $.trim(val) == "";
            },
            isEmpty: function (val) {
                return val == null || val == "";
            },
            min: function (val, min) {
                return $.trim(val) >= min;
            },
            max: function (val, max) {
                return $.trim(val) <= max;
            },
            utf8Length: function (val) {
                var utf8length = 0;
                for (var n = 0; n < val.length; n++) {
                    var c = val.charCodeAt(n);
                    if (c < 128) {
                        utf8length++;
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utf8length = utf8length + 2;
                    }
                    else {
                        utf8length = utf8length + 3;
                    }
                }
                return utf8length;
            },
            email: function (val) {
                // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
                // Retrieved 2014-01-14
                // If you have a problem with this implementation, report a bug against the above spec
                // Or use custom methods to implement your own email validation
                return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(val);
            },
            digits: function (val) {  //整数验证
                return /^\d+$/.test(val);
            },
            idcard: function (val) {
                return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(val);
            },
            phone: function (val) {
                return (/^((00|\+)?(86(?:-| )))?((\d{11})|(\d{3}[- ]{1}\d{4}[- ]{1}\d{4})|((\d{2,4}[- ]){1}(\d{7,8}|(\d{3,4}[- ]{1}\d{4}))([- ]{1}\d{1,4})?))$/).test(val);
            },
            url: function (val) {
                return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(val);
            },
            maxlength: function (option, val, length) {
                return length >= this.currentlength(option, val);
            },
            minlength: function (option, val, length) {
                return length <= this.currentlength(option, val);
            },
            currentlength: function (option, val) {
                if (option.twoCharLinebreak) {  //换行符作为两个字符
                    // Count all line breaks as 2 characters
                    val = val.replace(/\r(?!\n)|\n(?!\r)/g, '\r\n');
                } else {
                    // Remove all double-character (\r\n) linebreaks, so they're counted only once.
                    val = val.replace(new RegExp('\r?\n', 'g'), '\n');
                }
                var currentLength = 0;
                if (option.utf8) {
                    currentLength = this.utf8Length(val);
                } else {
                    currentLength = val.length;
                }
                return currentLength;
            },
            date: function (value) {
                value = value.replace(/-/g, "/");
                return !/Invalid|NaN/.test(new Date(value).toString());
            },
            dateISO: function (value) {
                return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
            },
            range: function (value, param) {
                return value >= param[0] && value <= param[1];
            },
            equalTo: function (value, method_val, rule, targetRule) {
                var $target = targetRule.$el;
                var $element = rule.$el;
                if ($target.not(".validate-equalTo-blur").length) {
                    $target.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
                        $element.trigger("change");
                    });
                }
                return value === $target.val();
            }
        }
    };


    var handler = {
        /**
         * 解析自定义message配置为description对应的参数
         * @param message
         * @param ruleKey
         * @returns {{}}
         */
        convertMessage: function (message, ruleKey) {
            //处理提示内容的信息模板
            var current = {};
            var keys = ["required", "pattern", "conditional", "valid"];
            var self = this;
            for (var i in keys) {
                var key = keys[i];
                var value = message[key];
                if (message && value) {
                    var template = value.template,
                        content = value.content;
                    if (typeof template === "function") {
                        template = template.call(value, ruleKey);
                    }

                    if (typeof content === "function") {
                        content = content.call(value, ruleKey);
                    }

                    template = template || "";
                    content = content || "";

                    if (ruleKey) {
                        //存在rule key时应用解析的结果
                        value.template = template;
                        value.content = content;
                    }
                    if (key == "conditional") {
                        var conditional = function (message) {
                            var value;
                            if ($(this).data("required")) {
                                //如果是required时
                                value = message["required"];
                            } else {
                                value = message["conditional"];
                            }
                            //获取条件所对应的提示内容
                            var condContent = self.getDataConfirm($(this)) || value.content;
                            condContent = self.parseContent(/{content}/, value.template, condContent);
                            return condContent;
                        };
                        current["conditional"] = function () {
                            return conditional.call(this, message);
                        };
                    } else {
                        content = this.parseContent(/{content}/, template, content);
                        current[key] = content;
                    }
                }

            }
            return current;
        },
        parseContent: function (reg, all, content) {
            return all.replace(reg, content);
        },
        /**
         * 判断当前元素是否required
         * @param rule
         * @param globalRequired
         * @param rules
         * @returns {boolean}
         */
        required: function ($el, rule, globalRequired, rules) {
            var required = false;  //默认为false
            var equal = rule["equalTo"];
            if (equal != null) {
                var equalRule = rules[equal.key];
                required = !utils.isEmpty(this.getValue(equalRule.$el, equalRule));
                if (!required) {
                    required = this.required(equalRule.$el, equalRule, globalRequired, rules);
                }
            } else {
                if (rule.required != null) {
                    if (typeof rule.required == "boolean") {
                        required = rule.required;
                    } else {
                        if (typeof rule.required == "function") {
                            required = rule.required($el, rule.key, rule);
                        }
                    }
                } else {  //使用全局的验证方式
                    if (globalRequired != null && typeof globalRequired == "function") {
                        required = globalRequired($el, rule.key, rule);
                    } else {
                        if (typeof globalRequired == "boolean") {
                            required = globalRequired;
                        }
                    }
                }
            }

            return required;
        },
        setDataConfirm: function ($description, content) {
            $description.data("data-confirm-content", content);
        },
        getDataConfirm: function ($description) {
            return $description.data("data-confirm-content");
        },
        getValue: function ($el, rule) {
            var value = $el.val();
            if (rule.trim && $el.attr("type") !== "password") {
                value = $.trim(value);
            }
            return value;
        },
        getFunctionName: function (key) {
            var array = key.split("-");
            var name = "";
            for (var i in array) {
                var current = array[i];
                if (i != 0) {
                    current = current.substring(0, 1).toUpperCase() + current.substring(1);
                }
                name += current;
            }
            return name + "Confirm";
        },
        getKeys: function (model) {
            if (model === undefined || model === null) {
                return [];
            } else if (Object && Object.keys) {
                return Object.keys(model);
            } else {
                if (typeof model === "object") {
                    if (Array.isArray(model)) {
                        return [];
                    } else {
                        var keys = [];
                        for (var key in model) {
                            keys.push(key);
                        }
                        return keys;
                    }
                }

            }
        }
    };

    var defaultApi = $.fn.validateSupport.defaults.api;
    var defaultLanguage = $.fn.validateSupport.defaults.language;

    var utils = {
        number: defaultApi.number,
        isBlank: defaultApi.isBlank,
        isEmpty: defaultApi.isEmpty,
        log: function (text) {
            console && console.log(text);
        },
        logError: function (text) {
            console && console.error(text);
        }
    }

    var api = defaultApi;

    var language = function (method) {
        return defaultLanguage[method];
    };

    //验证已存在函数的参数配置值
    var methodParameterValidate = function (rule, rules) {
        var methods_boolean = ["number", "url", "email", "digits", "idcard", "phone", "date", "dateISO"];
        var methods = [];
        for (var i in methods_boolean) {
            var method = methods_boolean[i];
            var method_val = rule[method];
            if (method_val !== undefined) {
                var type = typeof method_val;
                if (type !== "boolean" && method_val !== 1 && method_val !== 0) {
                    throw new Error("rule key named " + rule.key + "'s method " + method + " value must be boolean");
                } else {
                    methods.push(method);
                }
            }
        }

        var methods_number = ["min", "max"];
        for (var i in methods_number) {
            var method = methods_number[i];
            var method_val = rule[method];
            if (method_val !== undefined) {
                if (!utils.number(method_val)) {
                    throw new Error("rule key named " + rule.key + "'s method " + method + " value must be number");
                } else {
                    methods.push(method);
                }
            }
        }

        var methods_length = ["maxlength", "minlength"];
        for (var i in methods_length) {
            var method = methods_length[i];
            var method_val = rule[method];
            if (method_val !== undefined) {
                var type = typeof method_val;
                if ((type === "object" && method_val !== null && !Array.isArray(method_val)) || type === "number") {
                    var option = {
                        twoCharLinebreak: true,
                        utf8: false,
                        size: 0
                    }
                    if (type === "number") {
                        method_val = {size: method_val};
                    }
                    $.extend(option, method_val);
                    rule[method] = option;
                    methods.push(method);
                } else {
                    throw new Error("rule key named " + rule.key + "'s method " + method + " value must be object or number");
                }
            }
        }

        //验证range
        method = "range";
        var method_range_val = rule[method];
        if (method_range_val !== undefined) {
            if (!(Array.isArray(method_range_val) && method_range_val.length === 2)) {
                throw new Error("rule key named " + rule.key + "'s method " + method + " value must be array and length is two");
            }

            if (!(typeof method_range_val[0] === "number" && typeof method_range_val[1] === "number")) {
                throw new Error("rule key named " + rule.key + "'s method " + method + " array value type must be number");
            }
            methods.push(method);
        }

        method = "equalTo";
        method_val = rule[method];
        if (method_val !== undefined) {
            var type = typeof method_val;
            if (type === "string") {
                method_val = {key: method_val, error: language(method)};
            } else if ((type === "object" && method_val !== null && !Array.isArray(method_val))) {
                method_val = $.extend({error: language(method)}, method_val);
            } else {
                throw new Error("rule key named " + rule.key + "'s method " + method + " value not allowed, it must be string or {key: string, error: string}");
            }
            rule[method] = method_val;
            var key = method_val.key;

            if (rules[key] === undefined) {
                throw new Error("rule key named " + rule.key + "'s method " + method + " value must be in rule key");
            }

            methods.push(method);
        }

        var numberIndex = -1;
        var shouldNumber = false;
        for (var i in methods) {
            var method = methods[i];
            if (method === "number") {
                numberIndex = parseInt(i);
            } else if (method === "range" || method === "max" || method === "min") {
                shouldNumber = true;
            }
            if (shouldNumber && numberIndex > -1) {
                break;
            }
        }

        if (shouldNumber) {
            rule["number"] = true;
            if (numberIndex > -1) {
                methods.splice(numberIndex, 1);
            }
            methods.splice(0, 0, "number");
        }

        rule.methods = methods;
    }

    /**
     * 获取方法不通过时的提示信息
     * @param method
     * @param method_value rule方法所配置的值
     * @param value
     */
    function getErrorMessage(method, method_value, value) {
        var message;
        if (method === "equalTo") {
            message = method_value.error;
        } else {
            message = language(method);
            if (message.indexOf("{") >= 0) {
                if (method === "max" || method === "min") {
                    message = handler.parseContent(/{val}/, message, method_value);
                } else if (method === "maxlength" || method === "minlength") {
                    message = handler.parseContent(/{val}/, message, method_value.size);
                } else if (method === "range") {
                    message = handler.parseContent("{0}", message, method_value[0]);
                    message = handler.parseContent("{1}", message, method_value[1]);
                }
            }
        }

        return message;
    }


    var resolver = function (rule, $el, globalRequired, rules) {
        function result() {

            var flag = true;
            var $description = rule.$description;
            var message;

            var required = handler.required($el, rule, globalRequired, rules);
            var $this = $(this);
            var value = handler.getValue($el, rule);

            if (required == true) {
                if (value != null && value.length > 0) {
                    flag = true;
                } else {
                    flag = false;
                }
                var type = $.trim($this.attr("type"));
                if (type != "" && (type == "checkbox" || type == "radio")) {
                    flag = $("[name='" + $el.attr("name") + "']:checked").length > 0;
                }
            } else {
                if (utils.isEmpty(value)) {
                    return flag;
                }
            }
            if (!flag) {
                message = rule.message.required.content;
            }

            //是否required
            $description.data('required', !flag);

            try {
                if (flag) {
                    var methods = rule.methods;
                    for (var i in methods) {
                        var method = methods[i];
                        var method_val = rule[method];

                        if (method === "min" || method === "max") {
                            flag = api[method](value, method_val);
                        } else if (method === "maxlength" || method === "minlength") {
                            flag = api[method](method_val, value, method_val.size);
                        } else if (method === "range") {
                            flag = api[method](value, method_val);
                        } else if (method === "equalTo") {
                            flag = api[method](value, method_val, rule, rules[method_val.key]);
                        } else {
                            flag = api[method](value);
                        }
                        if (!flag) {
                            message = getErrorMessage(method, method_val, value);
                            break;
                        }
                    }
                }


                if (flag) {
                    //最后rule自定义函数的验证
                    if (rule.conditional != null && typeof rule.conditional == "function") {
                        var ruleConditional = rule.conditional($el, rule.key, rule, rules);
                        if (typeof ruleConditional == "boolean") {
                            flag = ruleConditional;
                        } else {
                            if (typeof ruleConditional == "object") {  //是对象时使用其info值作为其实内容
                                if (typeof ruleConditional.status == "undefined") {  //返回的json格式不对时, status 必须
                                    throw new Error("the user conditional function's return json value is not allowed, it's keys must has status," +
                                        "\n which name is " + rule.key + " in the rules option.");
                                }
                                flag = ruleConditional.status;
                                message = ruleConditional.error;
                            } else {
                                throw new Error("the user conditional function return value is not allowed, which name is " + key + " in the rules option.");
                            }
                        }

                        if (utils.isEmpty(message)) {
                            message = rule.message.conditional.content;
                        }
                    }
                }

            } catch (e) {
                flag = false;
                message = e;
                utils.logError(e);
            }

            if (!flag) {
                handler.setDataConfirm($description, message);
            }

            return flag;
        }

        return result;
    }


    //分析：
    /**
     *  data-required  用于验证是否为空
     *  data-conditional 自定义验证，属性值关联
     *  data-description  属性值为关联对象
     *  data-describedby   通过属性值与对应id的元素关联，用于提交时显示对应的描述信息
     *  data-pattern   正则验证
     */
    function validate($form, options) {
        var defaults = {
            onKeyup: true,
            onBlur: true,
            onChange: true,
            sendForm: true,
            eachValidField: function () {
                $(this).parents('.form-group').removeClass('has-error').addClass('has-success');
            },
            eachInvalidField: function () {
                $(this).parents('.form-group').removeClass('has-success').addClass('has-error');
            },
            invalid: function(event, options) {  //提交表单验证不通过时
            },
            valid: function(event, options) {
            }
        };

        var custom = {   //自定义拓展属性
            debug: false,
            clearAll: function ($elements) {
                //用于清除提示的样式
                for (var i in $elements) {
                    var $element = $elements[i];
                    $element.$description.children().remove();
                    $element.$el.parents('.form-group').removeClass("has-success has-error");
                }
            },
            always: null, //为函数时每次验证后执行 fn(key, valid) key(rule key) -- string valid(是否通过验证) -- boolean  this(当前key对应的元素对象)
            scrollToError: null, //表单不通过时定位到当前第一位错误元素的配置 {offset(基于该元素的offset值): number || fn(key, rules)//【this(当前key对应的元素对象)】, duration(scroll duration): number}
            required: false,   //(boolean) || fn($el, key, rule) //全局验证是否required【rule中key的该参数可覆盖全局,参数一致】
            trim: false,  // boolean, 全局默认不进行trim 【rule中key的该参数可覆盖全局,参数一致】
            description: null,  //function($description, $el, key, rule){},  //用于设置提示显示的位置(全局)【rule中key的该参数可覆盖全局,参数一致】
            descriptionPrefix: "validate", //生成提示信息的元素前缀
            message: {  //全局设置消息提示的元素 【rule中key的该参数可覆盖全局,参数一致】
                required: {  //非空验证失败的提示模板
                    template: '<span class="help-block">{content}</span>', // string || fn(key) 返回值需要为string
                    content: $.fn.validateSupport.defaults.language.required // string || fn(key)
                },
                pattern: {
                    template: '<span class="help-block">{content}</span>', //正则验证失败时的提示模板
                    content: $.fn.validateSupport.defaults.language.pattern
                },
                conditional: {  //自定义验证函数失败时的提示模板
                    template: '<span class="help-block">{content}</span>',
                    content: $.fn.validateSupport.defaults.language.conditional
                },
                valid: {  //验证通过时的显示
                    template: '<span class="help-block">{content}</span>',
                    content: $.fn.validateSupport.defaults.language.success
                }
            },
            rules: {}
            /*
             rules: {
                 key: {
                   conditional: fn,  //自定义验证函数fn($el, key, rule, rules)
                   pattern: string,  //正则表达式
                   mask: string,  //
                   id: boolean,  //是否以key作为id选择器
                   selector: string || fn($form),  //选择器或者函数返回当前元素的对象
                   message: object,
             },
             */
        };


        var attrs = handler.getKeys(custom);
        for (var i in attrs) {

            var key = attrs[i];
            var value = options[key];
            var type = typeof value;
            if (type !== "undefined") {
                if (key === "message") {
                    for (var currKey in value) {  // when has property, will replace
                        $.extend(custom[key][currKey], value[currKey]);
                    }
                } else {  // to use options key's value
                    custom[key] = value;
                }
            }
            delete options[key]; //delete options key
        }


        options = $.extend(defaults, options);

        var rules = custom.rules;

        options.conditional = {};  //自定义函数对象
        options.description = {};  //描述


        var globalRequired = custom.required;
        var globalTrim = custom.trim;

        var $elements = [];
        //解析rules进行生成对应的属性，元素等
        if (rules) {
            for (var key in rules) {
                var rule = rules[key];
                rule.key = key;
                var $el;
                var id = rule.id;
                if (typeof id == "boolean" && id) {  //按照id
                    $el = $("#" + key);
                } else {
                    var selector = rule.selector;
                    if (selector) {
                        var selectorType = typeof selector;
                        if (selectorType == "string") {
                            $el = $form.find(rule.selector);
                        } else if (selectorType == "function") {
                            $el = selector.call($form, $form);
                        }
                    } else {
                        $el = $form.find("[name='" + key + "']");
                    }
                }

                var trim = false;
                if (rule.trim != null) {
                    if (typeof rule.trim == "boolean") {
                        trim = rule.trim;
                    }
                } else {  //默认使用全局的验证方式
                    if (typeof globalTrim == "boolean") {
                        trim = globalTrim;
                    }
                }
                rule.trim = trim;

                if (rule.mask) {
                    $el.data("mask", rule.mask);
                }

                if (rule.pattern) {
                    $el.data("pattern", rule.pattern);
                }

                var describedby = (utils.isEmpty(custom.descriptionPrefix) ? "" : custom.descriptionPrefix + "-") + key + "-description";

                //处理提示信息模板
                $el.attr("data-description", key);
                $el.attr("data-describedby", describedby);

                var functionName = handler.getFunctionName(key);
                $el.data("conditional", functionName);

                //验证配置的函数参数
                methodParameterValidate(rule, rules);

                //通过函数调用返回函数的方式来处理避免其中的参数值被覆盖 （定义了该函数,每次都会进行执行）
                options.conditional[functionName] = resolver(rule, $el, globalRequired, rules);

                var $description = $("<div></div>").attr("id", describedby);
                rule.$description = $description;

                rule.$el = $el;

                //如果当前元素的个数大于1只选择第一个元素作为$input用于设置$description的位置
                var $input = $el.length > 1 ? $el.eq(0) : $el;
                $elements.push({$el: $el, key: rule.key, $description: $description});
                if (rule.description != null && typeof rule.description == "function") {
                    rule.description($description, $input, key, rule);  //用于设置提示显示的位置
                } else {
                    if (custom.description != null && typeof custom.description == "function") {
                        custom.description($description, $input, key, rule);  //用于设置提示显示的位置
                    } else {
                        $input.parent().after($description);  //如果不存在,默认在该元素的父元素下显示
                    }
                }

                var clone = $.extend(true, {}, custom.message);  //不会改变全局模板的属性
                if (rule.message) {
                    for (var cloneKey in clone) {
                        $.extend(clone[cloneKey], rule.message[cloneKey]);
                    }
                }
                var message = handler.convertMessage(clone, key);
                rule.message = clone;  //rule应用的message
                options.description[key] = message;  //设置对应的description配置
            }
        }


        function isAllowedField($this) {
            var allowed = $this.isValidateField;
            if (allowed === undefined) {
                for (var i in $elements) {
                    var $element = $elements[i];
                    var $el = $element.$el;
                    if ($el[0] === $this[0]) {
                        allowed = true;
                        $this.ruleKey = $element.key;
                        break;
                    }
                }
                if (!allowed) allowed = false;
                $this.isValidateField = allowed;
            }
            return allowed;
        }

        function sortElements() {
            if (!custom.hasSortElements) {
                var $elements_sort = [];
                $form.find("input, select, textarea").each(function (index, item) {
                    var $item = $(item);
                    for (var i in $elements) {
                        var $element = $elements[i];
                        var $el = $element.$el;
                      /*  if (($el.length == 1 && $item.is($el)) || $el.eq(0).is($item)) {
                            $elements_sort.push($element);
                            break;
                        }
*/
                        if ($el[0] === $item[0]) {
                            $elements_sort.push($element);
                            break;
                        }
                    }
                });
                $elements = $elements_sort;
                custom.hasSortElements = true;
                custom.$elements = $elements;
            }
        }


        var overFns = {
            eachInvalidField: options.eachInvalidField,
            eachValidField: options.eachValidField,
            invalid: options.invalid
        }

        options.eachInvalidField = function () {
            var fn = overFns.eachInvalidField;
            var $this = $(this);
            if (isAllowedField($this)) {
                $this.data("validField", false);
                fn.apply(this, arguments);
                if (custom.always && typeof custom.always === "function") {
                    custom.always.call(this, $this.ruleKey, false);
                }
            }
        }

        options.eachValidField = function () {
            var fn = overFns.eachValidField;
            var $this = $(this);
            if (isAllowedField($this)) {
                $this.data("validField", true);
                fn.apply(this, arguments);
                if (custom.always && typeof custom.always === "function") {
                    custom.always.call(this, $this.ruleKey, true);
                }
            }
        }

        options.invalid = function (event, options) {
            var fn = overFns.invalid;
            fn.apply(this, arguments);
            scrollTo();
        }

        custom.$elements = $elements;

        $form.validate(options);

        $form.on("reset", function (e) {
            custom.clearAll($elements);
        });


        /**
         * 获取当前error filed信息
         * @param key 可选,为空时则为第一个,反之是根据该key对应的field是否error返回
         * @returns {$el: object, key: string}
         */
        function getErrorField(key) {
            sortElements();
            var result = null;
            for (var i in $elements) {
                var $current = $elements[i];
                var $el = $current.$el;
                var isBreak = false;
                if (key != null) {
                    if ($current.key === key) {
                        if ($el.data("validField") === false) {
                            result = $current;
                        }
                        break;
                    }
                } else {
                    if ($el.data("validField") === false) {
                        isBreak = true;
                        result = $current;
                        break;
                    }
                }

            }
            return result;
        }

        /**
         * key不存在时依据配置中的scrollToError进行scroll到指定位置
         * 反之设置该key对应的元素scroll到指定位置
         * @param key rule key
         * @param offset number || function(key)
         * @param duration
         */
        var scrollTo = function (key, offset, duration) {
            var $element;
            var scrollToError = custom.scrollToError;
            var handle = true;
            if (key !== undefined) {
                $element = rules[key].$el;
            } else if (scrollToError) {
                var $current = getErrorField();
                if ($current !== null) {
                    $element = $current.$el;
                    key = $current.key;
                    offset = scrollToError.offset;
                    duration = scrollToError.duration;
                } else {
                    handle = false;
                }
            } else {
                handle = false;
            }
            if (handle) {
                if (typeof offset === "function") {
                    offset = offset.call($element, key, rules);
                }
                offset = parseFloat(offset) || 0;
                duration = parseFloat(duration) || 500;
                $('html, body').animate({
                    scrollTop: $element.offset().top + offset
                }, duration);
            }
        }


        var returns = {
            /**
             * 清除提示的内容及样式
             */
            clearAll: function () {
                custom.clearAll($elements);
            },

            /**
             * scroll指定key的位置
             * @param key
             * @param offset
             * @param duration
             */
            scrollTo: function (key, offset, duration) {
                if (key && rules[key]) {
                    scrollTo(key, offset, duration);
                } else if (custom.debug) {
                    utils.log("the scroll key " + key + " is not exist, so not to scroll");
                }
            },
            /**
             * 根据error配置项执行,必须为error field才会执行
             * @param key 不存在时默认为第一项
             */
            scrollErrorTo: function (key) {
                var scrollToError = custom.scrollToError;
                if (scrollToError) {
                    if (key != null) {
                        var $element = getErrorField(key);
                        if ($element) {
                            scrollTo(key, scrollToError.offset, scrollToError.duration);
                        } else {
                            if (custom.debug) {
                                utils.log("the scroll key " + key + " is not error field, so not to scroll");
                            }
                        }
                    } else {
                        //scroll to first error field
                        scrollTo();
                    }
                } else {
                    if (custom.debug) {
                        utils.log("has no scrollToError setting, not to scroll");
                    }
                }
            },
            getRuleKeys: function (sort) {
              if (sort) {
                  sortElements();
                  var arrays = [];
                  var $currents = $elements;
                  for (var i in $currents) {
                      arrays.push($currents[i].key);
                  }
                  return arrays;
              }
              return handler.getKeys(rules);
            },
            getRule: function (key) {
                return rules[key];
            },
            getField: function (key) {
                var rule = this.getRule(key);
                if (rule) {
                    return rule.$el;
                }
                return null;
            },
            debug: function (flag) {
                if (flag) {
                    this.options = options;
                    this.api = defaultApi;
                    this.custom = custom;
                } else {
                    var keys = ["options","custom", "api"];
                    for (var i in keys) {
                        delete this[keys[i]];
                    }
                }
                custom.debug = flag;
            }
        };

        returns.debug(custom.debug);
        return returns;
    }



})(jQuery);



/*

// to replace language text
$.extend($.fn.validateSupport.defaults.language, {
});

//to replace default method
$.extend($.fn.validateSupport.defaults.api, {
    phone: function (val) {
        return val == ""
    }
});*/
