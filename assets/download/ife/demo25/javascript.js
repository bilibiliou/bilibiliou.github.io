/* 暂定结点类型为两种，如需要可自己添加 */ 
var m = new Map();
m.set( "folder" , "ul.folder" );
m.set( "file" , "li.file" );

// tools
function $ (d , v) {
    v = v || document;
    return v.querySelector(d);
}

function getInnerText (e) {
    if( e.nodeType === 1 ) {
        return e.innerText ? e.innerText : e.textContent;
    } else {
        throw new Error("please transmit a param which is a doc element!");
    }
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

function simpleTrim (str) {
    return str.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
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

function TreeNode ( o ) {
    this.parentnode = o.parentnode;  // 父结点
    this.type = o.type;              // 结点类型 包含标签名和类
    this.selfEle = o.selfEle;        // TreeNode结点可以访问Dom树结点
    this.childs = o.childs || [];    // 子结点
    this.data   = o.data || "";      // 数据内容
    this.selfEle.TreeNode = this;    // Dom树结点也可以访问TreeNode结点
    
    if( o.type.split(".")[1] === "folder" ) {
        this.selfEle.isOpen = true;          // 如果是文件类型的给其加一个收缩开关
    }

    this.renderStyle( this );        // 给予样式    
} 

TreeNode.prototype = {
    constructor : TreeNode,
    addChild : function ( type , data , bP , sclass  ) {
        if ( sclass ) {
            sclass = " "+sclass;
        } else {
            var sclass = "";
        }
        data = data || "";
        bP = bP || 1;
        if (bP < 1) {
            bP = 1;
        }

        if( this.selfEle.nodeType !== 1 ) {
            throw new Error("The tree node's parent doesn't a document element!");
        }
        // 在html中实现该结点
        var c = type.split(".");
        var n = document.createElement( c[0] );
        addClass( n , c[1]+sclass );

        this.selfEle.appendChild( n );

        // 新建一个结点
        var nTN = new TreeNode({
            parentnode : this,
            type : type,
            selfEle : n,
            data : data
        }); 
        this.childs.push( nTN );

        // 回溯
        return this.backParent( bP , nTN );
    },
    backParent : function (n , obj) {
        var i = 1;
        while ( i !== n ) {
            if ( obj.parentnode === null ) {
                return obj;
            } else {
                obj = obj.parentnode;
                i++;
            }
        }
        return obj;
    },
    rmSelf : function () {
        this.rmAllChild();

        var index = 0;
        for( var i = 0 ; i<this.parentnode.childs.length ; i++ ) {
            if ( this.parentnode.childs[i] === this ) {
                index = i;
            }
        }

        this.parentnode.rmChild( index );
    },
    rmChild : function ( idx ) {
        if ( this.childs.length === 0 ) {
            throw new Error(" this childs Array is empty !");
        }
        this.selfEle.removeChild( this.childs[idx].selfEle );
        this.childs.splice( idx , 1 );
    },
    rmAllChild : function () {
        while( this.childs.length !== 0 ) {
            this.rmChild( this.childs.length - 1 );
        }
    },
    renderStyle : function ( o ) {
        var c = o.type.split(".");
        // 根据不同的树结点，给予不同的结构和样式
        
        switch (c[1]) {
            case "folder":
                return (function () {
                    var a = document.createElement("a");
                    a.href="javascript:;";
                    addClass( a , "folder-title" );
                    a.innerHTML += o.data;
                    if( o.parentnode !== null ) {
                         var s1 = document.createElement("span");
                        var s2 = document.createElement("span");

                        addClass( s1 , "folder-close" );
                        addClass( s2 , "folder-add" );

                        a.appendChild(s1);  
                        a.appendChild(s2);
                    }
                   
                    o.selfEle.appendChild(a);
                })();
                
            case "file": 
                return (function () {
                    var s = document.createElement("span");
                    addClass( s , "file-close" );
                    o.selfEle.appendChild(s);
                    o.selfEle.innerHTML += o.data;
                })();
        }
    },
    findChild : function ( sValue , r ) {

        this.childs.forEach(function (value,idx) {
            if( value.type.split(".")[1] === "folder" ) {
                if(getInnerText( $( "a" , value.selfEle ) ) == sValue) {
                    r.push( value );
                }

                r.concat(value.findChild( sValue , r ));
            } else if ( value.type.split(".")[1] === "file" ){
                if(getInnerText( value.selfEle ) == sValue) {
                    r.push( value );
                }
            }
        });

        return r;
    }
}

var container = $("article");
var root      = $(".root");
var oFind     = $(".find");
var oCon      = $(".con");

// 创建根节点
var r = new TreeNode({
    parentnode : null,  
    type : m.get("folder"), 
    selfEle : root,
    data : "世界各国国防实力文档"
});

root.addEventListener( "click" , function (ev) {
    if (ev.target && ev.target.nodeType === 1) {
        
        if( ev.target.tagName.toLowerCase() === "a" && hasClass(ev.target , "folder-title") ) {
            return (function () {
                var a = ev.target.parentNode;
                if (a.isOpen) {
                    addClass(a , "folder-hidden");
                } else {
                    removeClass(a , "folder-hidden");
                }
                a.isOpen = !a.isOpen;
            })();
        }

        if( ev.target.tagName.toLowerCase() === "span" && hasClass(ev.target , "folder-add") ) {
            return (function () {
                var typeName = prompt("请输入您需要添加的结点类型?");
                var tN = m.get(typeName)
                
                if(!tN) {
                    alert("无此类型结点！");
                } else {
                    var data = prompt("请输入你需要添加的结点标题(内容)");
                    if( data.length === 0 ) {
                        alert("结点标题（内容）不能为空!");
                    } else {
                        ev.target.parentNode.parentNode.TreeNode.addChild(tN,data);
                    }
                }
            })();
        }

        if( ev.target.tagName.toLowerCase() === "span" && (hasClass(ev.target , "folder-close")) ) {
            return (function () {
               if(confirm("是否确认要删除该文件夹类节点？！")) {
                    ev.target.parentNode.parentNode.TreeNode.rmSelf();
               }
            })();
        }

        if( ev.target.tagName.toLowerCase() === "span" && (hasClass(ev.target , "file-close")) ) {
            return (function () {
               if(confirm("是否确认要删除该文件节点？！")) {
                    ev.target.parentNode.TreeNode.rmSelf();
               }
            })();
        }
    }
});

oFind.addEventListener( "click" , find )
oCon.addEventListener( "keydown" , function (ev) {
    if( ev.keyCode === 13 ) {
        find();
    }
})

function find() {
    var findValue = simpleTrim( oCon.value );
    var b = $$(".findValue-bg");
    if ( b.length !== 0 ) {
        for( var i = 0 ; i < b.length ; i++ ) {
            removeClass( b[i] , "findValue-bg" );
        }
    }
    
    var c = [];
    r.findChild( findValue , c );
    if( c.length !== 0 ) {
        c.forEach( function (value ,idx) {
            openParent(value);
            addClass( value.selfEle , "findValue-bg" );
        });
    }else {
        alert("并没有找到所查项")
    }
    oCon.value = "";
}

function openParent (obj) {
    if( obj.parentnode !== null ) {
        if( !obj.selfEle.isOpen ) {
            removeClass( obj.selfEle , "folder-hidden" )
            obj.isOpen = true;            
        }
        obj = obj.parentnode;
        openParent (obj);
    }
}
r.addChild( m.get("folder") , "中国" )
    .addChild( m.get("folder") , "陆军" )
        .addChild( m.get("file") , "突击兵" , 2 )
        .addChild( m.get("file") , "后勤" , 3 )
    .addChild( m.get("folder") , "海军" )
        .addChild( m.get("file") , "舰艇" , 2 )
        .addChild( m.get("file") , "炮艇" , 2 )
        .addChild( m.get("file") , "两栖陆战队" , 3 )
    .addChild( m.get("folder") , "空军" )
        .addChild( m.get("file") , "地勤" , 2 )
        .addChild( m.get("file") , "航空兵" , 2 )
        .addChild( m.get("file") , "雷达兵" , 3 );


r.addChild( m.get("folder") , "美帝" )
    .addChild( m.get("folder") , "陆军" )
        .addChild( m.get("file") , "海豹突击队" , 2 )
        .addChild( m.get("file") , "后勤" , 3 )
    .addChild( m.get("folder") , "海军" )
        .addChild( m.get("file") , "航空母舰" , 2 )
        .addChild( m.get("file") , "驱逐舰" , 2 )
        .addChild( m.get("file") , "蛙人" , 3 )
    .addChild( m.get("folder") , "空军" )
        .addChild( m.get("file") , "黑鹰直升机" , 2 )
        .addChild( m.get("file") , "阿帕奇" , 2 )
        .addChild( m.get("file") , "伞兵" , 3 );

r.addChild( m.get("folder") , "日本" )
    .addChild( m.get("file") , "自卫队" );

r.addChild( m.get("folder") , "欧洲" );


/**** 用法 ****/
// 如果需要添加一个子结点
// r.addChild( m.get("file") );

// 如果添加的子节点需要添加其他类
// r.addChild( m.get("file") , "结点标题" , "a b c" );

// 删除一个结点 （其下子节点在数组中的索引）
// r.rmChild( 0 );

// r.addChild( m.get("file") );
// r.addChild( m.get("file") );
// r.addChild( m.get("file") );
// r.addChild( m.get("file") );
// r.addChild( m.get("file") );

// 如果要删除所有的孩子
// r.rmAllChild();

// 删自己
//  r.addChild( m.get("file") ).rmSelf();