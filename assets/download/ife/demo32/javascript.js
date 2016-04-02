// 都听说这样闭包都挺有逼格范儿的~~
;(function (w,d){
    var oContainer = $("[data-form-valid-control]");
    var oSubmit    = $("[data-submit-control]");
    var AllIo      = []; // 存放所有的Io对象
    if (!oContainer) {
        throw new Error("需要将一个元素绑定\"data-form-valid-control\"属性！");
    } else if (!oSubmit) {
        throw new Error("需要添加一个元素绑定\"data-submit-control\" 属性")
    }

    rules = { // 内置基础规则
            username : {
                required : true,
                max : 10,
                min : 4,
                regexp : /^[\w\u4e00-\u9fa5]{4,10}$/,
                alertInfo : {
                    tooLong : "用户名长度不能超过10个字符",
                    tooTall : "用户名长度不能少于4个字符",
                    illegalInput : "用户名只能输入数字、大小写英文、\"_\"或中文！"
                }
            },

            phone : {
                required : true,
                len : 11,
                regexp : /^(13|15|18|14|17)\d{9}$/,
                alertInfo : {
                    illegalInput : "手机号码必须为11位数字",
                    illegalStart : "手机号码必须以 13、15、18、14、17开头"
                }
            },

            // 不上网不知道，居然还可以有中文域名和一个超长的museum 域名
            email : {
                required : true,
                regexp: /^\w[\w\-]*@\w+\.[a-zA-Z\u4e00-\u9fa5]{2,6}$/,
                alertInfo : {
                    illegalStart : "邮箱地址开头必须以数字，字母，下划线开头",
                    illegalInput : "不符合正常邮箱格式"
                }
            }, 
            
            password : {
                required : true,
                min : 8,
                regexp : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
                alertInfo : {
                    tooTall : "密码必须8位以上",
                    mustHasDigit : "密码中必须至少包含一个数字",
                    mustHasLowerCase : "密码中必须至少包含一个小写字母",
                    mustHasUpperCase : "密码中必须至少包含一个大写字母",
                    mustHasSpecialLetter : "密码中必须至少包含一个特殊字符（\"$\"、\"@\"、\"$\"、\"!\"、\"%\"、\"*\"、\"?\"、\"&\"）", 
                },  
            },

            reInputPassWord : {
                required : true,
                isCommon : "",
                alertInfo : {
                    illegalInput : "两次输入的密码不一致",
                }
            }
    }


    // input option
    function Io( o ) {
        this.label = o.label || "";             // 表单标题，必填
        this.name = o.name;                     // 表单name属性，选填 若是radio 或 checkbox必填
        this.type = o.type || "text";           // 标签type属性              
        this.conType = o.conType                // 表单内容类型，必填

        this.rule = rules[o.conType]            // 获取规则
        this.alertInfo = null;                  // 提示标签结点
        this.boff = false;                      // 开关 默认关闭
        
        if ( /^(radio|checkbox)$/.test(this.type) ) {
             if ( this.name === "" ) {
               throw new Error("此为单选或复选框,name属性必填!");
            }
        }

        AllIo.push(this);
    }

    Io.prototype = {
        constructor: Io,
        renderIo: function () {
            var inputGroup = d.createElement("div");
            addClass(inputGroup , "input-group");
            var oLabel = d.createElement("label");
            var html = "";
            html += "<span class=\"form-title\">"+this.label+": </span>";
            html += "<input type="+ this.type +" name=\""+ this.name +"\"/>";
            html += "<span class=\"alert-info\"></span>";            
            oLabel.innerHTML = html;
            
            inputGroup.appendChild(oLabel);
            oContainer.appendChild(inputGroup);
            
            this.alertInfo = $(".alert-info" , oLabel);
            this.$input    = $("input" , oLabel); 
            return this;
        },
        checkListener: function () {
            var $self  = this;
            var $input = $self.$input;
            var aInfo  = $self.alertInfo;
            var rule = $self.rule;
            var required = rule.required;
            var regexp   = rule.regexp ? rule.regexp : null;

            this.$input.addEventListener("blur" , function () {
                if ( $input.value === "" && required ) {
                    $self.boff = false;
                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>输入框不能为空";
                    addClass( aInfo , "warn-border" );
                } else {

                    // 确认密码无需正则，只需验证是否相等就行
                    if ( $self.conType === "reInputPassWord" ) {
                        if ( $input.value === rule.isCommon ) {
                            removeClass( aInfo , "warn-border" );
                            $self.boff = true;
                            aInfo.innerHTML = "<i class=\"success-info-icon\"></i>";    
                        } else {
                            $self.boff = false;
                            addClass( aInfo , "warn-border" );
                            aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.illegalInput;
                        }
                    } else if ( regexp.test($input.value) ) { // 需要进行正则匹配的走下面的逻辑逻辑
                        removeClass( aInfo , "warn-border" );
                        $self.boff = true;

                        aInfo.innerHTML = "<i class=\"success-info-icon\"></i>";
                        
                        if ( $self.conType === "password" ) {
                        // 如果当前所选择的是密码框，验证成功之后，将用户提供的密码传人密码确认的规则中
                            rules.reInputPassWord.isCommon = $input.value;
                        }
                        
                        // 符合前端的基本格式之后就可以传Ajax了 当然这里只单独检验前端格式
                    } else {
                        $self.boff = false;
                        addClass( aInfo , "warn-border" );
                        switch ( $self.conType ) {
                            case "username":
                                if ( /[^\w^\u4e00-\u9fa5]/.test($input.value) ){
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.illegalInput;
                                } else if( $input.value.length > rule.max  ) {
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.tooLong;
                                } else if( $input.value.length < rule.min ) {
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.tooTall;
                                }
                                break;
                            case "phone": 
                                if( $input.value.length !== rule.len || /[^\d]/.test($input.value)  ) {
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.illegalInput;
                                } else if ( !/^13|15|18|14|17/.test($input.value) ){
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.illegalStart;
                                }
                                break;
                            case "email":
                                if ( !/^\w/.test($input.value) ) {
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.illegalStart;
                                } else {
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.illegalInput;
                                }
                                break;
                            case "password":
                                if ( $input.value.length < rule.min ) {
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.tooTall;
                                } else if ( !/(?=.*[a-z])/.test($input.value) ) {
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.mustHasLowerCase;
                                } else if ( !/(?=.*[A-Z])/.test($input.value) ) {
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.mustHasUpperCase;
                                } else if ( !/(?=.*[\d])/.test($input.value) ) {
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.mustHasDigit;
                                } else if ( !/(?=.*[$@$!%*?&])/.test($input.value) ) {
                                    aInfo.innerHTML = "<i class=\"alert-info-icon\"></i>" + rule.alertInfo.mustHasSpecialLetter;
                                }
                                break;
                        }
                    }
                }
                
                addClass( aInfo , "active" );
            },false);

            this.$input.addEventListener("focus" , function () {
                removeClass( aInfo , "warn-border" );
                removeClass( aInfo , "active" );
            })
        }
    }

    new Io({
        label : "用户名",
        type  : "text",
        name  : "username",
        conType : "username",
    })
    .renderIo()
    .checkListener();

    new Io({
        label : "电话号码",
        type  : "tel",
        name  : "phone",
        conType : "phone",
    })
    .renderIo()
    .checkListener();

    new Io({
        label : "邮箱",
        type  : "email",
        name  : "email",
        conType : "email",
    })
    .renderIo()
    .checkListener();

    new Io({
        label : "密码",
        type  : "password",
        name  : "password",
        conType : "password",
    })
    .renderIo()
    .checkListener();

    new Io({
        label : "确认密码",
        type  : "password",
        name  : "reInputPassWord",
        conType : "reInputPassWord",
    })
    .renderIo()
    .checkListener();

    oSubmit.addEventListener("click" , function (ev) {
        var Allboff = true; //总开关
        for( var i in AllIo ) {
            if (!AllIo[i].boff) {
                Allboff = false;
            }
        }

        if(!Allboff) {
            alert("表单检验并没有通过！");
        } else {
            alert("表单验证成功");
            // 提交到后端操作
        }
    });
})( window , document )







// tools
function $ (d , v) {
    v = v || document;
    return v.querySelector(d);
}

function $$ (d , v) {
    v = v || document;
    return v.querySelectorAll(d);
}

function hasClass (ele , tclass) {
    tclass = simpleTrim( tclass );

    if( ele === null ) {
        throw new Error("selector has some error!");
        return false;
    }
    var scalss = ele.className.split(" ");
    for( var i = 0 ; i<scalss.length ; i++ ) {
        if( scalss[i] === tclass ) {
            return true;
        }
    }
    return false; 
}

function addClass (element , newClassName) {
    var newClass = element.className.split(" ");    
    for(var i in newClass) {
        if( newClass[i] === newClassName ) {
            return;
        }
    }

    newClass.push(newClassName);

    element.className = newClass.join(" ");
}

function removeClass(element , rmClassName) {
    if( element.className !== undefined ) {
        var EmClass = element.className.split(" ");
        for( var i in EmClass ) {
            if( EmClass[i] === rmClassName) {
                EmClass.splice( i , 1 );
            }
        }

        element.className = EmClass.join(" ");
    } else {
        throw new Error("className is undefined");
        return;
    }   
}