 window.onload = function () {
    var oInput = $$("header label input");
    var oS     = $$("header label>div span");
    var header = $("header");
    var cTableB = $$(".c-table li");

    var C1     = $(".c-1 select");
    var C2     = $$(".c-2 select");



    // 一级联动
    var nowStudent = 0;
    header.addEventListener("click" , function (ev) {
        if( ev.target && ev.target.nodeType === 1 && ev.target.tagName === "INPUT" ) {
            // 单选表单
            removeClass(oS[nowStudent] , "show");
            oInput[nowStudent].removeAttribute("checked");
            removeClass( cTableB[nowStudent] , "table-show");

            nowStudent = ~~ev.target.dataset.value;
            console.log(nowStudent)
            addClass($("span" , ev.target.parentNode) , "show")
            ev.target.setAttribute("checked" , "");
            addClass( cTableB[nowStudent] , "table-show" );
        }
    },false);

   


    // 二级联动 
    var nowSchool = 0;
    C1.addEventListener("change" , function (ev) {
        if ( this.selectedIndex !== nowSchool) {
            removeClass(C2[nowSchool] , "c-show");
            nowSchool = this.selectedIndex;
            addClass(C2[nowSchool] , "c-show");
        }
    },false);

    function $ (d , v) {
        v = v || document;
        return v.querySelector(d);
    }

    function $$ (d , v) {
        v = v || document;
        return v.querySelectorAll(d);
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
    function removeClass (element , rmClassName) {
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
}   