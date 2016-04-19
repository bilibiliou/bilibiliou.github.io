var oBody = $("body"),
    oWave = $(".wave"),
    oLoading = $(".loading"),
    loadingText = $(".loading-text"),
    oPicsWallWrap = $(".pics-wall-wrap")
    oPicsWall = $(".pics-wall"),
    oWaitting = $(".waitting"),
    M = Math,
    R = Math.random,
    boff = true,                      // 加载锁
    protoStack = [],                  // 图片栈
    percentage = 0,                   // 加载面初始百分比
    pN = 0,                           // 资源数 再次加载图片时候  handle(++pN)
    val = 0;                          // 加载面中间变量

// tool
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

            removeClass(oWaitting , "hidden");
            return;
        } else {
            return loading();
        }
    },1000/60);
}()

// 窗口缩放
+function () {
    oBody.style.height = innerHeight + "px";

    window.addEventListener("resize" , (ev) => {
        oBody.style.height = innerHeight + "px";
    },false)
}();

percentage = 20;
// 根据AspectRatio 横纵比 来计算每行的高度

// 需要设定一个最小 横纵比 高度为450
// 间距8px
//
var mHeight = 450,
    minAspectRatio = oPicsWall.clientWidth / mHeight;

// 加载图片，每次加载30张
function loadingPic (pageNum = 0 , source = "500px" ) {
    var Picpage = new Promise((resolve , reject) => {
        Ajax({
            url: "http://test.facelending.com:3000/?source=" + source + "&page=" + pageNum,
            method : "GET",
            success : (data) => {
                resolve(JSON.parse(data));
            }
        });
    });

    Picpage.then((d) => {
        var pics = d.map(( value , idx , array ) => {             
            return new Promise(function (resolve) {
                var img = new Image();

                img.src = value.image.small;

                img.onload = function () {
                    this.onload = null;
                    (percentage !== 100) && (percentage++);
                    value.ele = img;
                    resolve( value );
                }

            })
        });

        Promise.all(pics).then((arg) => {
            protoStack.push(...arg);
            (percentage !== 100) && (percentage = 100);

            for (var i = 0; i <5; i++) {
                createRow();
            };

            if (!boff) {
                boff = true;
            }
        })
    }).catch((err) => {
        console.error(err);
    })
}; 


function createRow () {

    append(calAR ())
    
    // 通过通过每张图片的横纵比来计算 
    function calAR () {
        var rAR = 0;                     // 每行的纵横比例
        var _photos = [];                // 每行的图片
        var $row;
        for ( var i = 0; i<protoStack.length; i++ ) {
            var picObj = protoStack.shift();
            _photos.push(picObj);
            rAR += picObj.aspect_ratio;

            if (rAR >= minAspectRatio) {  // 如果横纵比例 已经大于最小比例了
                $row = {
                    AspectRatio : rAR,
                    photos : _photos
                }
                break;
            }
        }

        // 如果图片栈 已经空了，但是一行还未满，说明剩下的图片不足一行
        // 继续加载图片
        if (protoStack.length === 0 && rAR < minAspectRatio && $row == undefined) {
            // 将已经缓存的图片，回归图片栈，
             protoStack.concat(_photos);
             AspectRatio = 0;
            return false;
        } else {
            return $row;
        }
    };

    function append ( row ) {
        if (row !== false) {
            // 除去各个元素的边距 后的宽度
            var totalWidth = oPicsWall.clientWidth;
            
            // 由此获得适应的高度
            var oH = ~~(totalWidth / row.AspectRatio) + "px";

            var galleryRow = document.createElement("div");

            galleryRow.style.height = oH;
            addClass(galleryRow , "gallery-row");
            galleryRow.innerHTML = row.photos.reduce((prev , next) => {
                prev += 
                '<div class="gallery-item-wrapper">' +
                   '<div class="gallery-item">' +
                    '<img ' +
                      'title="' + next.name + '" ' +
                      'class="gallery-image" data-large="' + next.image.large + '" ' +
                      'src="' + next.image.small + '">' +
                   '</div>' +
                   '<div class="info">' +
                        '<p class="info-title">' +
                            '<span class="stress-title">题目：</span>' + next.name +
                        '</p>' +
                        '<p class="info-description">' +
                            '<span class="stress-title">描述：</span>' + next.description +
                            '</p>' +
                    '</div>' +
                '</div>'

                return prev;
            },"");
            
            oPicsWall.appendChild(galleryRow);
        } else {
            return;
        }
        
    }   
}

// 监听滚动
+function () {
    window.addEventListener("scroll" , function (ev) {
        var ScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (ScrollTop > document.body.scrollHeight - 800) {
            if (boff) {
                boff = false;
                loadingPic(++pN);
            }
        }
    });
}();

percentage = 50;

loadingPic(pN);

