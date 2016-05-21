require.config({
    paths : {
        "calendar" : ["calendar"],
        "util" : ["util"]
    }
})

require(["util"] , function () {
    $ = new u();

    var obuildNew = $.f(".build-new"),
        oCs = $.f(".c-s"),
        buildPage = $.f(".build-page")

    $.delegateEvent(oCs , "img span a" , "click" ,function () {
        $.addClass(obuildNew , "none");
        $.removeClass(buildPage , "none");
    });
});

// localStorage.clear();

require( ["calendar","util"] , function (calendar) {
$ = new u();

function oList(o) {
    this.num = o.num;
    this.Title = o.Title;
    this.LTime = o.LTime;
    this.TTime = o.TTime;
    this.deadLine = o.deadLine;
    this.stat = o.stat;    // 1 发布中 2 未发布 3 已结束
    this.qLs = o.qLs;
}

oList.changeToolist = function (o) {
    return new oList({
        num : o.num,
        Title : o.Title,
        LTime : o.LTime,
        TTime : o.TTime,
        deadLine : o.deadLine,
        stat : o.stat,
        qLs : o.qLs
    })
}

oList.prototype = {
    createListBlock : function () {
        var $self = this,
            oDate = new Date(),
            html = "";

        oTr = document.createElement("tr");
        var k = JSON.parse(localStorage.getItem("globalList"));
        if (k) {
            oTr.setAttribute("list-num" , k.length - 1);
            $self.num = k.length - 1; 
        } else {
            oTr.setAttribute("list-num" , 0);
            $self.num = 0;
        }

        $.addClass(oTr , "list-li");
        html += '<td class="task-list-radio-block">' +
                '<input type="checkbox" class="t-l-cbox" name="t-l">' +
            '</td>' +
            '<td class="task-list-title">' +
                '<span>'+$self.Title+'</span>' +
            '</td>' +
            '<td class="task-list-time">' +
                '<span>'+$self.LTime+' </span>' +
                '<span>'+$self.TTime+'</span>' +
            '</td>' +
            '<td class="task-list-stat">';

        switch ($self.stat) {
            case 1:
                html += '<span class="release">发布中</span>';
                break;
            case 2:
                html += '<span>未发布</span>';
                break;
            case 3:
                html += '<span>已结束</span>';
                break;
        }

                
        html +=  '</td>' +
            '<td class="task-list-option">' +
                '<div class="t-l-btn-list none">';

        switch ($self.stat) {
            case 1:
                html += '<button>' +
                        '<a class="rm-t-list" href="javascript:void(0);">' +
                            '删除' +
                        '</a>' +    
                    '</button>';
                break;
            case 2:
                html += '<button>' +
                    '<a class="edit-t-list" href="javascript:void(0);">' +
                        '编辑' +
                    '</a>' +    
                    '</button>';
                break;
            case 3:
                html += '<button>' +
                    '<a class="show-t-list" href="javascript:void(0);">' +
                        '查看数据' +
                    '</a>' +    
                '</button>';
                break;
        }
                     
        html += '</div>' + '</td>';
        oTr.innerHTML = html;
        oTableBody.appendChild(oTr);
        return this;
    }
}

var oNewBuild = $.f(".task-list-option-new-build"),
    otaskList = $.f(".task-list"),
    obuildPage = $.f(".build-page"),
    oTableBody = $.f(".task-list tbody"),
    oAllCheck = $.f(".all-check");

function oQ(o) {
    this.type = o.type || undefined;                      // 类型          
    this.num = o.num || -1;                               // 序号
    this.isMust = o.isMust || false;                      // 是否是必须！
    this.defaultTitle = o.defaultTitle || "";             // 默认标题 

    this.ele;                                             // 对应的node结点
    this.defaultNum = o.defaultNum || 3;                  // 默认选项数目
    this.OptionsTitle = o.OptionsTitle || [];             // 选项内容
    this.functionKeys;                                    // 功能键
    this.textboxPrompt = o.textboxPrompt || "";           // 文本框默认提示
    return this;
}

oQ.changeTooQ = function (o) {
    return new oQ({
        type : o.type,
        num  : o.num,
        isMust : o.isMust,
        defaultTitle : o.defaultTitle,
        textboxPrompt : o.textboxPrompt,
        OptionsTitle : o.OptionsTitle
    });
}

oQ.prototype = {
    createBlock : function () {
        var $self = this,
            html = "",
            oLi  = document.createElement("li"),
            oDiv = document.createElement("div")
            oLi.dataset.num = $self.num;   // 建立耦合
            $.addClass(oDiv , "clearfix");


        html += '<p class="block-title clearfix">' +
                    '<span>Q'+$self.num+'</span>' +
                    '<span class="q-t" contenteditable="true">'+ $self.defaultTitle +'</span>' +
                '</p>' +
                '<div class="ismust">' +
                    '<label>';

        if ($self.isMust) {
            html += '<input type="checkbox" class="check-must"  checked="1" name="ismust">';
        } else {
            html += '<input type="checkbox" class="check-must"  name="ismust">';
        }
        
        html += '<span>此题是否必填?</span>' +
            '</label>' +
        '</div>';
        
        // 文本框不允许添加新的选框
        if ($self.type !== "textbox") {
            html += '<div class="ac-options">' +
                    '<img src="./img/add-a.png" class="add-a" alt="add-a" title="添加新选框">' +
                    '<img src="./img/close-a.png" class="close-a" alt="close-a" title="删除新选框">' +
                '</div>';
        }       
        
        oDiv.innerHTML = html;

        oLi.appendChild(oDiv);

        switch ($self.type) {
            case "radio":
            if ($self.OptionsTitle.length === 0) {
                for (var i = 0 ; i<$self.defaultNum ; i++) {
                    var aDiv = document.createElement("div");
                    $self.addRadioNode(aDiv ,i);
                    $self.OptionsTitle.push('选项'+$.digitCn(i + 1));
                    oLi.appendChild(aDiv);
                }
            } else {
                for (var i = 0 ; i<$self.OptionsTitle.length ; i++) {
                    var aDiv = document.createElement("div");
                    $self.addRadioNode(aDiv ,i , $self.OptionsTitle[i]);
                    oLi.appendChild(aDiv);
                }
            }  
            break;

            case "checkbox":
            if ($self.OptionsTitle.length === 0) {
                for (var i = 0 ; i<$self.defaultNum ; i++) {
                    var aDiv = document.createElement("div");
                    $self.addCheckboxNode(aDiv , i);
                    $self.OptionsTitle.push('选项'+$.digitCn(i+1));
                    oLi.appendChild(aDiv);
                }
            } else {
                 for (var i = 0 ; i<$self.OptionsTitle.length ; i++) {
                    var aDiv = document.createElement("div");
                    $self.addCheckboxNode(aDiv ,i , $self.OptionsTitle[i]);
                    oLi.appendChild(aDiv);
                }
            } 
            break;

            case "textbox":
                var aDiv = document.createElement("div");
                $.addClass(aDiv , "textarea-block clearfix");

                if ($self.textboxPrompt === "") {
                    $self.textboxPrompt = "可设置初始提示内容...";                        
                }

                aDiv.innerHTML += '<textarea class="textbox-area">'+$self.textboxPrompt+'</textarea>';
                
                oLi.appendChild(aDiv);
            break;
        }   
        
        
        var bDiv = document.createElement("div");
            $.addClass(bDiv , "operation-option clearfix");
            oLi.appendChild(bDiv);

            html = '<ul class="operation-option-list clearfix">' +
                      '<li class="none">' + 
                         '<a href="javascript:void(0);" class="block-moveup">上移</a>' +              
                      '</li>' +
                      '<li class="none">' +
                            '<a href="javascript:void(0);" class="block-movedown">下移</a>' +
                      '</li>' + 
                      '<li>' +
                            '<a href="javascript:void(0);" class="block-del">删除</a>' +
                        '</li>' +
                        '<li>' +
                            '<a href="javascript:void(0);" class="block-useagain">复用</a>' +
                        '</li>' +
                    '</ul>';

        bDiv.innerHTML += html;
        
        $self.functionKeys = $.ff(".operation-option-list li" , bDiv );

        if ($self.type === "textbox") {
            oquestionsList.style.height = (oquestionsList.clientHeight + 223) + "px";
        } else {
            oquestionsList.style.height = (oquestionsList.clientHeight + 188) + "px";
        }
        setTimeout(function () {
            oquestionsList.appendChild(oLi); 
            $self.ele = oLi;
        },500);
        
        return this;
    },
    addRadioNode : function (aDiv , num , con) {
        var $self = this,
            con = con || '选项'+$.digitCn(num + 1);

        $.addClass(aDiv , "radio-block clearfix");

        aDiv.innerHTML += '<label>' +
            '<input type="radio" class="c-radio" disabled=true >' +
            '<div class="questions-title" contenteditable="true" data-option-num="'+(num + 1)+'">'+con+'</div>' +
        '</label>';
        
        return this;
    },
    addCheckboxNode : function (aDiv , num , con) {
        var $self = this,
            con = con || '选项'+$.digitCn(num + 1);

        $.addClass(aDiv , "check-block clearfix")

        aDiv.innerHTML += '<label>' +
            '<input type="checkbox" name="edit-checkbox" class="c-check-box" disabled=true >' +
            '<div class="questions-title" contenteditable="true" data-option-num="'+(num + 1)+'">'+con+'</div>' +
        '</label>';
        return this;
    },
    cloneBlockNode : function () {
        var OptionsTitle,
            newArr = [],
            newele = this.ele.cloneNode(true)
            newPrompt = "";

            if(this.OptionsTitle.length !== 0) {
                for(var i = 0 ; i<this.OptionsTitle.length; i++) {
                    newArr.push(this.OptionsTitle[i]);
                }
            }

            if(this.textboxPrompt !== "") {
                newPrompt = this.textboxPrompt;
            }
            return new oQ({
                type : this.type,
                num  : qLs.con.length+1,
                isMust : false,
                defaultTitle : this.defaultTitle,
                ele : newele,
                functionKeys : $.ff(".operation-option-list li",newele),
                OptionsTitle : newArr,
                textboxPrompt : newPrompt
            });
    }
}

var qLs = {
        "ListTitle" : "新建标题",
        "deadLine" : "",
        "con" : [],
    },                                                         // 存储oQ 对象;
    MuchQuestionNum = 10,                                      // 默认能添加的问题数目
    canAddRadioNum = 6,                                        // 可添加单选按钮上限
    canAddCheckBoxNum = 8,                                     // 可添加多选按钮上限
    oBuildPage = $.f(".build-page"),
    oCont = $.f(".container"),
    oquestionsList = $.f(".questions-list"),
    oAddAQuestion = $.f(".add-a-question"),
    oAddQuestionType = $.f(".add-question-type"),
    oCW = $.f(".calendar-wrap"),
    oC = $.f(".calendar-wrap input"),
    oTitle = $.f(".edit-title p"),
    oOtherSet = $.f(".other-set"),
    oEditTitle = $.f(".edit-title p"),
    oBack = $.f(".back"),
    oTaskList = $.f(".task-list"),
    oBtn = $.f(".save"),
    oBtnP = $.f(".push"),
    sQLS = localStorage.getItem("saveQLS");


    // 任务列表逻辑
    var lg = localStorage.getItem("globalList"),
        LS 

    refreshtL(lg);
    if (localStorage.getItem("globalList")) {
        LS.forEach(function (value , idx , array) {
            value.createListBlock();
        });
    }
    
    function refreshtL (lg) {
        if (lg) {
            var arr = JSON.parse(lg);
            LS = arr.map(function (value ,idx ,array) {
                var ol = oList.changeToolist(JSON.parse(value));
                for (var i = 0; i<ol.qLs.con.length; i++) {
                    ol.qLs.con[i] = oQ.changeTooQ(ol.qLs.con[i]);
                }
                return ol;
            });
        }
    }

    // 新建页面
    $.addEvent(oNewBuild, "click" ,function () {
        oquestionsList.innerHTML = "";
        oquestionsList.style.height = "0px";
        oBtn.setAttribute("data-stat","new");
        toggleWindow();
    });

    // 全选功能
    var switched = false; // 控制全部删除功能
    $.addEvent(oAllCheck , "click" , function () {
        var listLis = $.ff(".task-list-radio-block"),
            allbecheck = true,
            oRadio = $.ff(".task-list-radio-block input");

        for (var i = 0 ; i<oRadio.length ; i++) {
            if (oRadio[i].checked == "") { // 使用== 而不能使用全等！！
                allbecheck = false;
                break;
            }
        }

        if (allbecheck) {
            Array.prototype.forEach.call(oRadio,function (value , idx , array) {
                value.checked = "";
                trActive(value)
            });
        } else {
            Array.prototype.forEach.call(oRadio,function (value , idx , array) {
                value.checked = "checked";
                trActive(value);
            });
        }  
    });

    // 按钮点击后，判断是否全选
    $.delegateEvent(otaskList , "input.t-l-cbox" , "click" , function (ev , target) {
        isAllcheck();
    });

    // 关联点击
    $.delegateEvent(otaskList , "tr.list-li td span" ,"click" , function (ev , target) {
        var oTr,
            btnBox;

        switch ( true ) {
            case target.parentNode.parentNode.classList.contains("list-li"):
                oTr = target.parentNode.parentNode;
                btnBox = $.f(".t-l-cbox",oTr);
                checkBox(btnBox);

                break;
            case target.parentNode.classList.contains("list-li"):
                oTr = target.parentNode;
                btnBox = $.f(".t-l-cbox",oTr);
                checkBox(btnBox);
                
                break;
            case target.classList.contains("list-li"): 
                oTr = target;
                btnBox = $.f(".t-l-cbox",oTr);
                checkBox(btnBox);
                break;
        }
    });

    $.delegateEvent( otaskList , "input.t-l-cbox" , "change" , function (ev , target) {
        trActive(target);
    });

    // 编辑
    $.delegateEvent( otaskList , "a.edit-t-list" , "click" , function (ev,target) {
        var oTr = target.parentNode.parentNode.parentNode.parentNode,
            NUM = ~~oTr.dataset.listNum;
            
            oquestionsList.innerHTML = "";
            refreshtL(localStorage.getItem("globalList"));
            LS[NUM].qLs.con.forEach(function (value , idx , array) {
                value.createBlock();
            });
            sortNode();
            refreshFunctionKeys();
            oTitle.innerHTML = LS[NUM].qLs.ListTitle;
            oBtn.setAttribute("data-stat","edit");
            oBtn.setAttribute("data-now-operation",NUM);
            oBtnP.setAttribute("data-exist","true");
            toggleWindow();
    });

    function checkBox (t) {
        if (t.checked == "") {
            t.checked = "checked";
        } else {
            t.checked = "";
        }
        isAllcheck();
        trActive(t);
    }

    function isAllcheck() {
        var listLis = $.ff(".task-list-radio-block"),
            allbecheck = true,
            oRadio = $.ff(".task-list-radio-block input"),
            boff = true;

        for (var i = 0 ; i<oRadio.length ; i++) {
            if (oRadio[i].checked == "") {
                boff = false;
                break;
            }
        }

        if (boff) {
            oAllCheck.checked = "checked";
        } else {
            oAllCheck.checked = "";
        }
    }

    function trActive(t) {
        var oTr = t.parentNode.parentNode,
            btnList = $.f(".t-l-btn-list" , oTr);
            if (t.checked == "") {
                $.addClass(btnList , "none");
                $.removeClass(oTr , "tr-active");
            } else {
                $.removeClass(btnList , "none");
                $.addClass(oTr , "tr-active")
            }
    }

    function toggleWindow() {
        if (otaskList.classList.contains("none")) {
            $.removeClass(otaskList,"none");
            $.addClass(obuildPage , "none");
        } else {
            $.removeClass(obuildPage,"none");
            $.addClass(otaskList , "none");
        }
    }

    // 新建页面逻辑

    // 交换数组中任意的两个值
    Array.prototype.swapItems = function (id1 , id2) {
        this[id2] = this.splice(id1 , 1 , this[id2])[0];
    }

    // 页面问卷标题
    $.addEvent(oTitle , "blur" , function (ev) {
        qLs.ListTitle = this.innerHTML;
    });

    // 选项改名
    $.delegateEvent( oquestionsList , "div.questions-title" , "blur" , function (ev , target) {
        var oLi = target.parentNode.parentNode.parentNode,
            NUM = oLi.dataset.num - 1,
            optionNum = target.dataset.optionNum - 1,
            value = target.innerHTML;

            qLs.con[NUM].OptionsTitle[optionNum] = value;
    },true);

    // 修改问题题目
    $.delegateEvent( oquestionsList , "span.q-t" , "blur" , function (ev , target) {
        var oLi = target.parentNode.parentNode.parentNode,
            NUM = oLi.dataset.num - 1,
            value = target.innerHTML;

            qLs.con[NUM].defaultTitle=value;
     },true);

    // 设置文本框默认值
    $.delegateEvent( oquestionsList , "textarea.textbox-area" , "blur" , function (ev , target) {
        var oLi = target.parentNode.parentNode,
            NUM = oLi.dataset.num - 1,
            value = target.value
            qLs.con[NUM].textboxPrompt = value;
    },true);

    // 添加选项
    $.delegateEvent( oquestionsList , "img.add-a" , "click" , function (ev , target) {
         var oLi = target.parentNode.parentNode.parentNode,
            NUM = oLi.dataset.num,
            html = "",
            aDiv,
            blocks,
            appendPoint = $.f( ".operation-option", oLi)

            switch(qLs.con[NUM-1].type) {
                case "radio" :
                    blocks = $.ff(".radio-block" , oLi);
                    if (blocks.length >= canAddRadioNum) {
                        alert("已经超过了单选按钮可以添加的上限");
                        return;
                    } else {
                        aDiv = document.createElement("div");
                        qLs.con[NUM-1].addRadioNode(aDiv , blocks.length).OptionsTitle.push("选项"+$.digitCn(blocks.length+1));
                        oLi.insertBefore(aDiv , appendPoint);
                    }
                    break;
                case "checkbox" :
                    blocks = $.ff(".check-block" , oLi);
                    if (blocks.length >= canAddCheckBoxNum) {
                        alert("已经超过了多选按钮可以添加的上限");
                        return;
                    } else {
                        aDiv = document.createElement("div");
                        qLs.con[NUM-1].addCheckboxNode(aDiv , blocks.length).OptionsTitle.push("选项"+$.digitCn(blocks.length+1))
                        oLi.insertBefore(aDiv , appendPoint);
                    }
                    break;
            }
    });

    // 删除选项
    $.delegateEvent( oquestionsList , "img.close-a" , "click" , function (ev , target) {
        var oLi = target.parentNode.parentNode.parentNode,
            NUM = oLi.dataset.num,
            blocks

            switch(qLs.con[NUM-1].type) {
                case "radio" :
                    blocks = $.ff(".radio-block" , oLi);
                    break;
                case "checkbox" :
                    blocks = $.ff(".check-block" , oLi);
                    break;
            }
            
            if(blocks.length <= 1) {
                alert("题目不能一个选项都没有");
            } else {
                oLi.removeChild(blocks[blocks.length - 1]);
                qLs.con[NUM-1].OptionsTitle.pop();
            }
    });

    // 是否必须
    $.delegateEvent( oquestionsList , "input.check-must" , "click" , function (ev , target) {
        var NUM = target.parentNode.parentNode.parentNode.parentNode.dataset.num;
        qLs.con[NUM-1].isMust = !qLs.con[NUM-1].isMust;       
    });

    // 添加问题按钮显隐
    $.addEvent(oAddAQuestion , "click" , function () {
        if($.hasClass(oAddQuestionType , "nh")) {
            $.removeClass(oAddQuestionType , "nh");
        } else {
            $.addClass(oAddQuestionType , "nh");
        }
    });

    // 添加问题块
    $.delegateEvent( oAddQuestionType , "img span a" , "click" , function (ev , target) {
        if (qLs.con.length+1 > MuchQuestionNum) {
            alert("添加最多不能超过"+MuchQuestionNum+"个问题");
            return;
        }
        var oQinit,
            obj = {
                num : qLs.con.length + 1
            }

        switch (true) {
            case ($.hasClass(target.parentNode,"new-radio") || $.hasClass(target,"new-radio")) :
                obj["type"] = "radio";
                obj["defaultTitle"] = "单选题";
                oQinit = new oQ(obj).createBlock();
            break;

            case ($.hasClass(target.parentNode,"new-check") || $.hasClass(target,"new-check")) :
                obj["type"] = "checkbox";
                obj["defaultTitle"] = "多选题";
                obj["defaultNum"] = 4;
                oQinit = new oQ(obj).createBlock();

            break;

            case ($.hasClass(target.parentNode,"new-textbox") || $.hasClass(target,"new-textbox")) :
                obj["type"] = "textbox";
                obj["defaultTitle"] = "文本框";
                oQinit = new oQ(obj).createBlock();
            break;
        }
        qLs.con.push(oQinit);
        refreshFunctionKeys();
    })
    
    // 删除问题块 
    $.delegateEvent( oquestionsList , "a.block-del" , "click" , function (ev , target) {
        var oLi = target.parentNode.parentNode.parentNode.parentNode,
            NUM = oLi.dataset.num - 1,
            oType = qLs.con[NUM].type;

            qLs.con.splice(NUM , 1);
            oquestionsList.removeChild(oLi);

            if (oType === "textbox") {
                oquestionsList.style.height = (oquestionsList.clientHeight - 223) + "px";
            } else {
                oquestionsList.style.height = (oquestionsList.clientHeight - 188) + "px";
            }

            sortNode();
            refreshFunctionKeys();
    });
    
    // 上移问题块
    $.delegateEvent( oquestionsList , "a.block-moveup" , "click" , function (ev , target) {
        var oLi = target.parentNode.parentNode.parentNode.parentNode,
            NUM = oLi.dataset.num - 1,
            newNode = null

            newNode = qLs.con[NUM].ele.cloneNode(true);
            oquestionsList.insertBefore( newNode,qLs.con[NUM-1].ele );
            oquestionsList.removeChild( qLs.con[NUM].ele );
            qLs.con[NUM].ele = newNode;
            qLs.con[NUM].functionKeys = $.ff(".operation-option-list li",newNode)


            qLs.con.swapItems(NUM , NUM - 1);

            refreshFunctionKeys();
            sortNode();
    });

    // 下移问题块
    $.delegateEvent( oquestionsList , "a.block-movedown" , "click" , function (ev , target) {
        var oLi = target.parentNode.parentNode.parentNode.parentNode,
            NUM = oLi.dataset.num - 1,
            newNode = null

            newNode = qLs.con[NUM+1].ele.cloneNode(true);
            oquestionsList.insertBefore( newNode,qLs.con[NUM].ele );
            oquestionsList.removeChild( qLs.con[NUM+1].ele );
            qLs.con[NUM+1].ele = newNode;
            qLs.con[NUM+1].functionKeys = $.ff(".operation-option-list li",newNode)


            qLs.con.swapItems(NUM , NUM + 1);
            
            refreshFunctionKeys();
            sortNode();
    });

    // 复用问题块
    $.delegateEvent( oquestionsList , "a.block-useagain" , "click" , function (ev , target) {
        var oLi = target.parentNode.parentNode.parentNode.parentNode,
            NUM = oLi.dataset.num - 1,
            q

            if (qLs.con.length === MuchQuestionNum) {
                alert("添加最多不能超过"+MuchQuestionNum+"个问题");
                return;
            }

            q=qLs.con[NUM].cloneBlockNode();
            q.createBlock();
            qLs.con.push(q);
            refreshFunctionKeys();
    });

    // 提交
    $.delegateEvent( oOtherSet , "button.push span.push-span" , "click" , function (ev , target) {
        if (qLs.deadLine === "") {
            alert("请选择合适的截至日期")
        } else {
            if ($.isTimeOut(qLs.deadLine)) {
                alert("之前保存的页面的截至日期已过，请重新设置");
            } else {
                if(confirm("你确定要发布问卷？\n\n问卷截至日期为 ("+qLs.deadLine+")")) {
                    var v = JSON.stringify(qLs);
                    
                    if (oBtnP.dataset.exist) {
                        oTableBody.innerHTML = '<tr class="task-list-thead">' +
                        '<td class="task-list-radio-block"></td>' +
                        '<td class="task-list-title">标题</td>' +
                        '<td class="task-list-time">操作时间</td>' +
                        '<td class="task-list-stat">状态</td>' +
                        '<td class="task-list-option">' +
                            '<span>操作</span>' +
                            '<button class="task-list-option-new-build" title="新建问卷">' +
                                '<a href="javascript:;">' +
                                    '<img src="./img/add.png" alt="add">' +
                                    '<span>新建问卷</span>' +
                                '</a>' +
                            '</button>' +
                        '</td>' +
                    '</tr>';

                        if (localStorage.getItem("globalList")) {
                            LS.forEach(function (value , idx , array) {
                                value.createListBlock();
                            });
                        }
                    } else {
                        // 新建一个任务列
                        var oNewList = new oList({
                            Title : qLs.ListTitle,
                            LTime : $.getToday(),
                            TTime : $.getNowTime(),
                            deadLine : qLs.deadLine,
                            stat : 1,
                            qLs : qLs,
                        }).createListBlock();

                        saveLocalStorage(oNewList);
                        refreshtL(localStorage.getItem("globalList"));
                    }
                    
                    toggleWindow();
                }
            }   
        }
    });

    // 保存问卷
    $.delegateEvent( oOtherSet , "button.save span.save-span" , "click" , function (ev , target) {
        if (window.localStorage) {
            switch (oBtn.dataset.stat) {
                case "new" :
                    var v = JSON.stringify(qLs),
                        oNewList = new oList({
                            Title : qLs.ListTitle,
                            LTime : $.getToday(),
                            TTime : $.getNowTime(),
                            deadLine : qLs.deadLine,
                            stat : 2,
                            qLs : qLs,
                        });

                    oNewList.createListBlock(); 
                    saveLocalStorage(oNewList);
                    refreshtL(localStorage.getItem("globalList"));
                    break;
                case "edit" :
                        var NUM = ~~oBtn.dataset.nowOperation;
                        qLs.ListTitle = oTitle.innerHTML;

                        changeLocalStorage(NUM,qLs);
                        refreshtL(localStorage.getItem("globalList"));
                        oTableBody.innerHTML = '<tr class="task-list-thead">' +
                        '<td class="task-list-radio-block"></td>' +
                        '<td class="task-list-title">标题</td>' +
                        '<td class="task-list-time">操作时间</td>' +
                        '<td class="task-list-stat">状态</td>' +
                        '<td class="task-list-option">' +
                            '<span>操作</span>' +
                            '<button class="task-list-option-new-build" title="新建问卷">' +
                                '<a href="javascript:;">' +
                                    '<img src="./img/add.png" alt="add">' +
                                    '<span>新建问卷</span>' +
                                '</a>' +
                            '</button>' +
                        '</td>' +
                    '</tr>';

                        if (localStorage.getItem("globalList")) {
                            LS.forEach(function (value , idx , array) {
                                value.createListBlock();
                            });
                        }
                    break;
            }
            alert("已经成功保存页面");
            toggleWindow();
        } else {
            alert("您的浏览器不支持HTML5本地存储！");
        }
    });

    // 返回任务列
    $.addEvent( oBack , "click" , function () {
       toggleWindow();
    });

    // 日历控件
    calendar( oCW , oC , function () {
        var v = oC.value;
            qLs.deadLine = v;
    });

    // 存
    function saveLocalStorage (l) {
        var k = JSON.stringify(l);
                    
        var n = localStorage.getItem("globalList");
        
        if (n) {
            n = JSON.parse(n);
            n.push(k);
            localStorage.setItem("globalList",JSON.stringify(n));
        } else {
            var a = [];
            a.push(k);
            localStorage.setItem("globalList" , JSON.stringify(a));
        }
    }

    // 改
    function changeLocalStorage (num,l) {

        var n = JSON.parse(localStorage.getItem("globalList"));

        var target = JSON.parse(n[num]);
        target.qLs = l;
        var oNewList = new oList({
            Title : target.qLs.ListTitle,
            LTime : $.getToday(),
            TTime : $.getNowTime(),
            deadLine : target.qLs.deadLine,
            stat : 2,
            qLs : target.qLs,
        })

        n[num] = JSON.stringify(oNewList);
        localStorage.setItem("globalList",JSON.stringify(n));
    }

    // 功能键 允许或禁止
    function refreshFunctionKeys() {
        var len = qLs.con.length;
        if (len === 1) {
            $.addClass( qLs.con[0].functionKeys[1], "none");
            $.addClass( qLs.con[0].functionKeys[0] , "none");
        }

        if (len === 2) {
            $.addClass( qLs.con[0].functionKeys[0] , "none" );
            $.removeClass( qLs.con[0].functionKeys[1], "none");

            $.addClass( qLs.con[len - 1].functionKeys[1] , "none");            
            $.removeClass( qLs.con[len - 1].functionKeys[0] , "none");            
        } 

        if (len >= 3) {
            $.removeClass( qLs.con[0].functionKeys[1], "none");
            $.addClass( qLs.con[0].functionKeys[0] , "none");
            for (var i = 1 ; i<=len - 2; i++) {
                $.removeClass( qLs.con[i].functionKeys[0] , "none");
                $.removeClass( qLs.con[i].functionKeys[1] , "none" );
            }
            $.removeClass( qLs.con[len-1].functionKeys[0] , "none");
            $.addClass( qLs.con[len-1].functionKeys[1] , "none" )
        }
    }

    function sortNode() {
        // 重新排序
        for (var i = 0 ; i<qLs.con.length ; i++) {
            var ospan = $.f( ".block-title span:nth-of-type(1)",qLs.con[i].ele);
                ospan.innerHTML = "Q" + (i+1);
                qLs.con[i].num = (i+1);
                qLs.con[i].ele.dataset.num = (i+1);
        }
    }
});