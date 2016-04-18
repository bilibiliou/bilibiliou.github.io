var oBody = $("body"),
    oWave = $(".wave"),
    oLoading = $(".loading"),
    loadingText = $(".loading-text"),
    oPicsWall = $(".pics-wall"),
    oWaitting = $(".waitting"),
    M = Math,
    R = Math.random,
    boff = true,                      // 加载锁
    protoStack = [],                  // 图片栈
    percentage = 0,                   // 加载面初始百分比
    pN = 0,                           // 资源数 再次加载图片时候  handle(++pN)
    val = 0;                          // 加载面中间变量


+function loading() {  
    setTimeout(() => {
        if (percentage !== val) {
            val++;
            loadingText.innerHTML = val + " %";
            return loading();
        } else if (val === 100) {
            loadingText.innerHTML = val + " %";
            addClass(oLoading , "hidden");
            
            // 加载图层消失
            setTimeout(() => {
                oLoading.style.display = "none";
            },1200)

            return;
        } else {
            return loading();
        }
    },1000/60);
}()

function E() {
   throw new Error("Missing parameter");
}



function addClass(element , newClassName) {
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
        return;
    }   
}

function Ajax (obj) {
    var $self = this;
    var ajaxSettings = {
        url         : obj.url,
        responseType: obj.responseType || "text", 
        requestHeader : obj.requestHeader || "Content-type",
        requestType : obj.requestType || "application/x-www-form-urlencoded",
        sync       : obj.sync || true,
        method      : obj.method.toUpperCase() || "GET",
        data        : obj.data || null,
        time        : obj.timeout  || 0,

        // 回调函数
        success     : obj.success  || function ( data ) {
            console.log("Ajax request is success ~!!! ");
        },
        timeout     : obj.timeout  || function () {
            console.warn(" Ajax request timeout !!!");
        },
        error       : obj.error    || function ( XHR , sta , errThr ) {
            console.log( arguments )
            throw new Error( "error " + sta + " "  + errThr );  
        },
        download : obj.download,
        upload : obj.upload,

        xhr         : 
        window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.XDomainRequest ? 
            function () {
                return new window.XMLHttpRequest();
            } :
            function () {
                return new window.XDomainRequest();
            }),
        accepts: {
            xml: "application/xml , text/xml",
            html: "text/html",
            script: "text/javascript, application/javascript",
            json: "application/json, text/javascript",
            text: "text/plain",
            _default: "*/*"
        }
    }

    var xhr = ajaxSettings.xhr();
    var afterFormat = "";

    xhr.timeout = ajaxSettings.timeout;
    xhr.responseType = ajaxSettings.responseType;

    if ( ajaxSettings.method === "GET" ) {
        afterFormat = formatUrl( ajaxSettings.url , ajaxSettings.data );
        xhr.open(ajaxSettings.method , afterFormat , ajaxSettings.sync );
        xhr.send(null);
    } else if ( ajaxSettings.method === "POST" ) {
        xhr.setRequestHeader(ajaxSettings.requestHeader,ajaxSettings.contentType);
        xhr.open(ajaxSettings.method , ajaxSettings.url , ajaxSettings.sync );
        
        xhr.send(ajaxSettings.data);
    }


    xhr.onload  = function () {
        ajaxSettings.success( xhr.responseText );
    };

    xhr.onprogress = ajaxSettings.download;

    xhr.upload.onprogress = ajaxSettings.upload;

    xhr.ontimeout = function() {
        ajaxSettings.timeout();
    };
    
    xhr.onerror = function() {
        ajaxSettings.error();
    };


    function formatUrl( url , data ) {
        if ( data === null ) {
            return url;
        }
        var type =  Object.prototype.toString.call(data)
        if ( type === "[object String]" ) {
            url = url + "?" + data + new Date().getTime();
        } else if ( type === "[object Object]" ) {
            for( var i in  data ) {
                url += url.indexOf("?") == -1 ? "?" : "&";
                url += encodeURIComponent(i) + "=" + encodeURIComponent(data[i]);
            }

            url += new Date().getTime();
        }

        return url;
    }
}

function $ ( v , d=document ) {
    return d.querySelector(v);
}

function $$ (v , d=document) {
    return d.querySelectorAll(v);
}


// 窗口缩放
+function () {
    oBody.style.height = innerHeight + "px";

    window.addEventListener("resize" , (ev) => {
        oBody.style.height = innerHeight + "px";
    },false)
}();

// 滚动加载
+function () {
    window.addEventListener("scroll" , (ev) => {
        var ScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (ScrollTop > document.body.scrollHeight - 800) {
            if (boff) {
                boff = false;
                removeClass(oWaitting , "hidden");
                handlePic(++pN);    
            }
        }
    });
}();

percentage = 30;


// 处理加载好的图片
function handlePic(num=pN) {
    var p = getResources(num);

    p.then((d) => {
        (percentage !== 100) && (percentage = 60);

        var pics = d.map(( value , idx , array ) => {
            return createPic( value.image.small )
        });

        Promise.all(pics).then((arg) => {
            (percentage !== 100) && (percentage = 100);
            protoStack.push(...arg);
            showPics();
            addClass(oWaitting , "hidden");
            boff = true;
        })
    });

    // 获取资源地址
    function getResources (pageNum = 0 , source = "500px") {
        return new Promise((resolve , reject) => {
            Ajax({
                url: "http://test.facelending.com:3000/?source=" + source + "&page=" + pageNum,
                method : "GET",
                success : (data) => {
                    resolve(JSON.parse(data));
                }
            });
        })
    }

    // 产生图片对象
    function createPic (url=E()) {
        return new Promise((resolve , reject) => {
            var img = new Image();

            img.src = url;
            img.onload = function () {
                this.onload = null;
                
                (percentage !== 100) && (percentage++);

                resolve( img );
            }
        })
    }
};

handlePic(pN)

// 展示图片
function showPics () {
   
    firstType();
    secondType();
    thirdType();
    fouthType();
    secondType();
    fivthType();
    thirdType();
    fouthType();
    sixthType();

    function firstType () {
        var img = Shift(1),
            html = "";
        html += '<div class="pic-box gallery-1"><div class="gallery" style=background-Image:url("'+img[0].src+'"></div></div>'
       
        oPicsWall.innerHTML += html;
    }

    function secondType () {
        var img = Shift(2),
            html = "";
        html += '<div class="pic-box gallery-2"><div class="gallery skew-bg skew-bg-l" style="background-image:url('+ img[0].src +')"></div><div class="gallery skew-bg skew-bg-r" style="background-image:url('+ img[1].src +')"></div></div>';
        oPicsWall.innerHTML += html;
    }

    function thirdType () {
        var img = Shift(3),
            html = "";
        html += '<div class="pic-box gallery-3"><div class="gallery two-three-section-width" style="background-image:url('+ img[0].src +')"></div><div class="gallery three-section-width two-section-height" style="background-image:url('+ img[1].src +')"></div><div class="gallery three-section-width two-section-height" style="background-image:url('+ img[2].src +')"></div></div>';
        oPicsWall.innerHTML += html;
    }

    function fouthType () {
        var img = Shift(4),
            html = "";
        html += '<div class="pic-box gallery-4"><div class="gallery two-section-width two-section-height" style="background-image:url('+ img[0].src +')"></div><div class="gallery two-section-width two-section-height" style="background-image:url('+ img[1].src +')"></div><div class="gallery two-section-width two-section-height" style="background-image:url('+ img[2].src +')"></div><div class="gallery two-section-width two-section-height" style="background-image:url('+ img[3].src +')"></div></div>';
        oPicsWall.innerHTML += html;
    }

    function fivthType () {
        var img = Shift(5),
            html = "";
        html += '<div class="pic-box gallery-5"><div class="gallery two-three-section-width two-three-section-height" style="background-image:url('+ img[0].src +')"></div><div class="gallery three-section-width three-section-height f-right"  style="background-image:url('+ img[1].src +')"></div><div class="gallery three-section-width two-three-section-height f-right" style="background-image:url('+ img[2].src +')"></div><div class="gallery three-section-width three-section-height c-left" style="background-image:url('+ img[3].src +')"></div><div class="gallery three-section-width three-section-height" style="background-image:url('+ img[4].src +')"> </div></div>';
        oPicsWall.innerHTML += html;
    }

    function sixthType () {
        var img = Shift(6),
            html = "";
        html += '<div class="pic-box gallery-6"><div class="gallery two-three-section-width two-three-section-height" style="background-image:url('+ img[0].src +')"></div><div class="gallery three-section-width three-section-height f-right" style="background-image:url('+ img[1].src +')"></div><div class="gallery three-section-width three-section-height f-right" style="background-image:url('+ img[2].src +')"></div><div class="gallery three-section-width three-section-height f-right" style="background-image:url('+ img[3].src +')"></div><div class="gallery three-section-width three-section-height c-left" style="background-image:url('+ img[4].src +')"></div><div class="gallery three-section-width three-section-height" style="background-image:url('+ img[5].src +')"></div>';
        oPicsWall.innerHTML += html;
    }

    function Shift( num ) {
        var arr = [];
        for( var i = 0 ; i<num; i++ ) {
            arr.push(protoStack.shift())
        }
        return arr;
    }
}

