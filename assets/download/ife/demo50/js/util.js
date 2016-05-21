function u() {

}

u.prototype = {
	constructor : u,
	namespace : {},
	$ : function (selector) {
		var $self = this;
		var aS = this.simpleTrim(selector);
		if (aS.substring(0,1) === "<") {
			createStruct(aS);
			return;
		}

	 	aS = aS.split(" ");

	 	var k;
		if( aS.length === 1 ) {
			 k = mainfn(selector);
		}else {
				k = mainfn(aS[0]);
			for( var i = 1 ; i < aS.length ; i++ ) {
				k = mainfn(aS[i] , k);
			}
		}

		return k;

		function createStruct ( str ) {
			/** create html elements struct **/ 
			
		}		

		function mainfn (selector , parent) {
			parent = parent || document;
			var result = null;
			switch(selector.substring(0,1)) {
				case "#":
					selector = selector.substring(1);
					var f = $self.findById;
					return result = $self.findElement( selector , parent , f );
				case ".":
					selector = selector.substring(1);
					var f = $self.findByClass;
					return result = $self.findElement( selector , parent , f );
				case "[":
					selector = selector.substring(1,selector.length-1);
					var f;
					if(selector.indexOf("=") === -1) {
						f = $self.findByAttrName;
						return result = $self.findElement( selector , parent , f );
					}else {
						f = $self.findByAttrValue;
						return result = $self.findElement( selector , parent , f );
					}
				default :
					var f = $self.findByTagName;
					return result = $self.findElement( selector , parent , f );
			}
		}
	},
	findByAttrValue : function  ( targetAttr , parent ) {
		var o = parent.getElementsByTagName("*");
		var AttrName = targetAttr.split("=");
		var result = [];
		for(var i = 0 ;i<o.length;i++) {
			if (o[i].attributes.length === 0){continue;}
			for(var j  = 0 ; j<o[i].attributes.length ; j++) {
				if( o[i].attributes[j].name === AttrName[0] && o[i].attributes[j].value === AttrName[1] ) {
					result.push(o[i]);
					break;
				}
			}
		}
		return result;
	},
	findByAttrName : function  ( targetAttr , parent ) {
		var o = parent.getElementsByTagName("*");
		var result = [];
		for(var i = 0 ;i<o.length;i++) {
			if (o[i].attributes.length === 0){continue;}
			for(var j  = 0 ; j<o[i].attributes.length ; j++) {
				if( o[i].attributes[j].name ===  targetAttr) {
					result.push(o[i]);
					break;
			    }
			}
		}
		return result;
	},
	findByClass : function  ( targetClass , parent ) { 
		var r = [];
		var o = parent.getElementsByTagName("*");
		for(var i = 0 ; i<o.length; i++) {
			var aclass = o[i].className.split(" ");
			for(var j = 0 ; j < aclass.length ; j++){
				if( aclass[j] ===  targetClass ) {
					r.push(o[i]);
					break;
				}
			}
		}
		return r;
	},
	findById : function  ( targetId , parent ) {
		var r = [];
		var o = parent.getElementsByTagName("*");
		
		for(var i = 0 ; i<o.length ; i++) {
			if( targetId === o[i].id) {
				r.push(o[i]);
				return r;
			};
		}
	},
	findByTagName : function  ( tagName , parent ) {
		return parent.getElementsByTagName(tagName);
	},
	findElement : function  ( selector ,  parent , handle ) {
		var res = [];
		if(this.ObjectTest(parent) === "Array" || this.ObjectTest(parent) === "HTMLCollection") {
			for(var i = 0 ; i<parent.length ; i++) {
				var r = handle( selector , parent[i] );
				if( r !== undefined ) {
					res.push.apply( res , r );
				}
			}
		}else {
			res = handle( selector , parent );
		}

		if (res === undefined) {
			throw new Error(" selector grammer has's some error! ");
			return;
		}

		if(res.length === 1) {
			return res[0];
		} else {
			return res;			
		}

	},
	f : function ( v,d ) {
		d = d || document;
		return d.querySelector(v);
	},
	ff : function ( v,d ) {
		d = d || document;
		return d.querySelectorAll(v);
	},
	isTimeOut : function (dateStr) {
		if (/\-/g.test(dateStr)) {
			dateStr.replace(/-/g,"/");
		} else if(/\./g.test(dateStr)){
			dateStr.replace(/\./g,"/");
		}

		var thisDate = new Date(dateStr),
			NowDate  = new Date();
		console.log(thisDate)
		console.log(NowDate);
		return (NowDate <= thisDate) ? false : true;
	},
	ObjectTest : function (obj) {
		var a = Object.prototype.toString.call(obj).split(/(object )/);
		return a[a.length - 1].substring(0,a[a.length - 1].length - 1);
	},
	cloneObject : function (obj) {
		var a = {};
		if(this.ObjectTest(obj) === "Object") {
			for(var i in obj) {
				var type = this.ObjectTest(obj[i]);
				switch(type) {
					case "Number":
						var newNum = new Number();
						newNum = obj[i];
						a[i] = newNum;
						break;
					case "String":
						var newString = new String();
						newString = obj[i];
						a[i] = newString;
						break;
					case "Array":
						var newArray = new Array();
						newArray = obj[i];
						a[i] = newArray;
						break;	
					case "Object":
						var newObj = new Object();
						newObj = obj[i];
						a[i] = newObj;
						break;
					case "Function":
						var newFun = new Function();
						newFun = obj[i];
						a[i] = newFun;
						break;
					case "RegExp":
						var newReg = new RegExp();
						newReg = obj[i];
						a[i] = newReg;
						break;
				}
			}
		}
		return a;
	},
	random    : function (min , max , toFix) {
		toFix = toFix || 1;
		if (this.ObjectTest(toFix) !== "Number") {
			throw new Error("toFix isn't a number!!");
			return;
		}
		return (min + Math.random()*(max - min)).toFixed(toFix);
	},
	toArray   : function (obj) {
		var result = [];
		if ( obj.length !== undefined ) {
			for ( var i = 0; i<obj.length ; i++ ) {
				result.push(obj[i]);
			}	
		} else {
			throw new Error('This object hasn\'t "length" attribute ');
			return;
		}
		
		return result;
	},
	uniqArray : function (arr) {
		var result = [], hash = {};
		for (var i = 0, elem; (elem = arr[i]) != null; i++) {
			
			if (!hash[elem]) {
				result.push(elem);
				hash[elem] = true;
			}
		}
		return result;
	},
	simpleTrim : function (str) {
		return str.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
	},
	eachObj : function (arr , fn) {
		var obj = {};
		for(var i in arr) {
			obj[i] = arr[i];
			
		}
		fn(obj);
	},
	getObjectLength : function () {
		var j = 0;
		for( var i in obj ) {
			j++;				
		}
		return j;
	},
	addClass : function (element , newClassName) {
		var newClass = element.className.split(" ");	
		for(var i in newClass) {
			if( newClass[i] === newClassName ) {
				return;
			}
		}

		newClass.push(newClassName);

		element.className = newClass.join(" ");
	},
	removeClass : function (element , rmClassName) {
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
	},
	isSiblingNode : function (element,siblingNode) {
		return (element.parentNode === siblingNode.parentNode);
	},
	getPosition : function (element) {
		var result = {
			rx : 0,
			ry : 0
		}
		while (element) {
			result.rx += element.offsetLeft;
			result.ry += element.offsetTop;
			element = element.offsetParent;
		}
		return result;
	},
	addnamespace : function (d , fn) {
		var k;
		// 判断namespace中是否已经存在该事件
		for( var i in this.namespace ) {
			if( d[0] === i && !!d[1] ) {
				k = this.namespace[i][d[1]] = fn;
				return k;
			}
		}

		// 若还未存在，创造这个对象
		// 创建一个默认空间
		this.namespace[d[0]] = {};
		this.namespace[d[0]].default = null;
		
		if( !!d[1] ) {
			// 如果带命名空间，丢入指定空间
			k = this.namespace[d[0]][d[1]] = fn;
		} else {
			// 如果不带命名空间，丢入默认空间
			k = this.namespace[d[0]].default = fn;
		}

		return k;
	},
	rmnamespace : function (d) {
		var r;
		for( var i in this.namespace ) {
			// 如果存在该属性
			if(d[0] === i) {
				// 判断是否是默认函数
				if( !!d[1] ) {
					for( var j in this.namespace[i] ) {
						if( d[1] === j ) {
							r = this.namespace[i][j];
							delete this.namespace[i];
							return r;
						}
					}
				} else {
					r = this.namespace[d[0]].default;
					this.namespace[d[0]].default = null;
					return r;
				}
			}
		}	
	},
	addEvent : function (element , event , listener , isCapture) {
		isCapture = isCapture || false;
		var events = event.split(" ");
		for(var i = 0 ; i<events.length;i++) {
			var d = events[i].split(".");

			if( element.addEventListener ) {
				element.addEventListener( d[0] , this.addnamespace( d , listener ) , isCapture );
			} else {
				element.attachEvent( "on" + events[i] , function() {
					this.addnamespace(d , listener ).call(element);
				});
			}
		}
	},
	removeEvent : function ( element , event , callback ) {
		var events = event.split(" ");

		for( var i = 0 ; i<events.length ; i++ ) {
			var d = events[i].split(".");
			
			if( element.removeEventListener ) {
				element.removeEventListener( d[0] , this.rmnamespace( d ) , false );
			} else {
				element.detachEvent("on" + event , this.rmnamespace( d ));
			}
			
		}

		callback && callback();
	},
	delegateEvent : function ( element , selector , eventName , listener , isCapture ) {
		var $self = this;
		if(!!!listener) {
			throw new Error("listener doesn't bind a function!");
			return;
		} else if ($self.ObjectTest(listener) !== "Function"){
			throw new Error("This listener is not a function!");
			return;
		}
		
		
		listener = listener || null;
		selector = $self.simpleTrim( selector );
		var sS = selector.split(" ");
		var opt = [];

		sS.forEach(function ( value , idx ) {
			opt.push({
			 	nN : value.split(".")[0],
			 	sC : value.split(".")[1]
			});
		});

		
		$self.addEvent( element , eventName , function(ev) {
			var ev = ev || event;
			for( var i = 0 ; i<opt.length ; i++ ) {
				var classS = false;
				var tagS   = false;

				(opt[i].sC === undefined) ? classS = true : classS = $self.hasClass(ev.target , opt[i].sC);
				if (ev.target && ev.target.nodeName === opt[i].nN.toUpperCase() && classS) {
					tagS = true;
				}

				if( tagS && classS) {
					listener && listener( ev , ev.target );
					break;
				}
			}
		},isCapture);
	},
	undelegateEvent : function ( element , event ) {
		this.removeEvent( element , event );
	},
	hasClass : function (ele , tclass) {
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
	},
	setCookie : function ( name , value , expiredays ) {
		expiredays  = expiredays || 1;

		var oDate = new Date();
		oDate.setDate( oDate.getDate() + expiredays );
		document.cookie = name + "=" + value +  ";expires=" + oDate;
	},
	getCookie : function (name) {
		var arr = document.cookie.split('; ');
		var i = 0;

		for(i = 0;i<arr.length;i++)		
		{
			/*arr2通过对arr1以 = 进行分离后 获得的是多个数组 arr2是多个数组组成的数组*/
			var arr2 = arr[i].split('=');
			
			if(arr2[0] === name)
			{
				/*如果第 i 个数组的名字和要找的名字cookie名字相同的话 就返回对应的内容*/
				return arr2[1];
			}
		}
		
		return '';
	},
	rmCookie : function () {
		this.setCookie(name , '1' , -1);
	},
	getIndex : function () {
		var result = -1;
		for( var i = 0 ; i<element.offsetParent.children.length; i++ ) {
			if ( element === element.offsetParent.children[i]) {
				result = i;
				break;
			}
		}
		return result;
	},
	formatNumber : function ( value ) {		
		return (0 < value && value < 10) ? "0" + value : value;
	},
	getToday : function () {
		var $self = this,
			D = new Date(),
			YYYY = D.getFullYear(),
			MM   = $self.formatNumber(D.getMonth() + 1),
			DD   = $self.formatNumber(D.getDate())
		return YYYY + "-" + MM + "-" + DD;
	},
	getNowTime : function () {
		var $self = this,
			oDate = new Date(),
			oHour = oDate.getHours(),
			oMinute = $self.formatNumber(oDate.getMinutes()),
			oSecond = $self.formatNumber(oDate.getSeconds())
		return oHour+":"+oMinute+":"+oSecond;
	},
	Ajax : function (obj) {
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
			xhr.open(ajaxSettings.method , ajaxSettings.url , ajaxSettings.sync );
			xhr.setRequestHeader(ajaxSettings.requestHeader,ajaxSettings.contentType);
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

			if ( $self.ObjectTest(data) === "String" ) {
				url = url + "?" + data + new Date().getTime();
			} else if ( $self.ObjectTest(data) === "Object" ) {
				for( var i in  data ) {
					url += url.indexOf("?") == -1 ? "?" : "&";
					url += encodeURIComponent(i) + "=" + encodeURIComponent(data[i]);
				}

				url += new Date().getTime();
			}

			return url;
		}
	},
	getInnerText : function (e) {
		if( e.nodeType === 1 ) {
			return e.innerText ? e.innerText : e.textContent;
		} else {
			throw new Error("please transmit a param which is a doc element!");
		}
	},
	viewWidth : function () {
		return window.innerWidth || document.documentElement.clientWidth;
	},
	viewHeight : function () {
		return window.innerHeight || document.documentElement.clientHeight;
	},
	digitCn : function ( num ) {
		var M = Math;
		var r = "";
		var t = 0;

		t = parseInt(num);
		if (num < 0) {
			r += "负";
		}
		
		t = M.abs(t);

		switch(true) {
			case (t >= 0 && t <= 9):
				r += baseJudge(t); 
				break;
			case (t >= 10 && t <= 99):
				r += d(t);
				break;
			case (t >= 100 && t <= 999):
				r += h(t);
				break;
			case (t >= 1000 && t<=9999):
				r += th(t);
				break;
			case (t >= 10000 && t<=99999):
				r += bh(t);
				break;
			default: 
				throw new Error("数字转换超出范围 只能是-9999 到 9999");
				break;
		}

		return r;
		function baseJudge (n) {
			switch (n) {
				case 0: 
					return "零";
				case 1:
					return "一";
				case 2:
					return "二";
				case 3:
					return "三";
				case 4:
					return "四";
				case 5:
					return "五";
				case 6:
					return "六";
				case 7:
					return "七";	
				case 8:
					return "八";
				case 9:
					return "九";
			}
		}

		function d (t) {
			var v = "";

			var a = ~~(t / 10) * 10;
			var b = t - a;

			var e = ~~(t / 10);

			if (e !== 1) {
				v += baseJudge(e);					
			}
			v += "十";

			if (b !== 0) {
				v += baseJudge(b);
			}
			return v;
		}

		function h (t) {
			var v = "";
			
			var a = (~~(t / 100) * 100); // 百位
			var b = (~~((t - a) / 10) * 10); // 十位
			var c = ~~(t - a - b);     // 个位

			var e = ~~(t / 100);
			var f = ~~((t - a) / 10);

			v += baseJudge(e);
			v += "百";

			if (f !== 0) {
				v += baseJudge(f);
				v += "十";
			} else if (c !== 0){
				v += "零";
			}
			
			if ( c !== 0 ) {
				v += baseJudge(c);
			}

			return v;	
		}

		function th (t) {
			var v = "";

			var a = ~~(t/1000) * 1000; // 千位
			var b = ~~((t - a) / 100) * 100; // 百位
			var c = ~~((t - a - b) / 10) * 10; // 十位
			var d = ~~(t - a - b - c);     // 个位

			var e = ~~(t/1000); 
			var f = ~~((t - a) / 100);
			var g = ~~((t - a - b) / 10);
			
			v += baseJudge(e);
			v += "千";

			if (f !== 0) {
				v += baseJudge(f);
				v += "百"
			} else if (f === 0 && (g !== 0 || d !== 0)) {
				v += "零";
			}

			if (g !== 0) {
				v += baseJudge(g);
				v += "十"
			} else if (g === 0 && f === 0) {
				v += "";
			} else if (g === 0 && d !== 0) {
				v += "零";
			} 

			if (d !== 0) {
				v += baseJudge(d);
			}
			return v;
		}

		function bh (t) {
			var v = "";

			var a = ~~(t/10000) * 10000; // 万位
			var b = ~~((t - a)/1000) * 1000; // 千位
			var c = ~~((t - a - b) / 100) * 100; // 百位
			var d = ~~((t - a - b - c) / 10) * 10; // 十位
			var e = t - a - b - c - d;     // 个位

			var f = ~~(t/10000); 
			var g = ~~((t - a) / 1000);
			var h = ~~((t - a - b) / 100);
			var i = ~~((t - a - b -c) / 10);

			console.log(f,g,h,i,e);

			v += baseJudge(f);
			v += "万";

			if (g !== 0) {
				v += baseJudge(g);
				v += "千";
			} else if ( g === 0 && ((h !== 0) || (i !== 0)) || (e !== 0) ) {
				v += "零";
			}

			if (h !== 0) {
				v += baseJudge(h);
				v += "百";
			} else if ( h === 0 && g === 0 ) {
				v += "";
			} else if( h === 0 && ((i !== 0) || (e !== 0))  ) {
				v += "零";
			}

			if (i !== 0) {
				v += baseJudge(i);
				v += "十";
			} else if ( i === 0 && h === 0 ) {
				v += "";
			} else if ( i === 0 && e !== 0 ) {
				v += "零";
			}

			if (e !== 0) {
				v += baseJudge(e);
			}
			return v;
		}
	},
	typewriter : function (obj) {
		var animate = obj.animate || "default";

		var input = obj.input;
		var output = obj.output;
		var cursor = obj.output.getElementsByTagName("span")[0];
		var delay  = obj.delay || 120;
		var reverse = obj.reverse || false;
		var chain = {
			"domName" : "span",
			"val" : [],
			"dom" : null,
			"parentChain" : null,
			"attrs" : null
		}
		var $self = this;
		loadCss();
		/* init root */ 
		chain.dom = document.createElement(chain.domName.toLowerCase());
		output.insertBefore( chain.dom , cursor );
		
		if(animate.split("-")[0] === "3d") {
			chain.dom.style.transformStyle = "preserve-3d"; 
			chain.dom.style.perspective =  300+"px"; 
		}

		chain = linkTree( input , chain );
		play(chain);

		function linkTree( input , chain ) { // 把要复制的内容结点树复制一遍
			/* 两边的空格需要清除 */ 
			var children = $self.toArray( input.childNodes );
			
			for ( var i = 0 ; i < children.length; i++ ) {
				var node = children[i];
				// 判断是否是文字结点
				if( node.nodeType === 3 ) {
					chain.val = chain.val.concat(node.nodeValue.split(""));
				} else if ( node.nodeType === 1 ) {
					
					var newChain = {
						"domName" : node.nodeName,
						"val" : [],
						"dom" : null,
						"parentChain" : null,
						"attrs" : node.attributes
					}
					newChain = linkTree( node , newChain );
					chain.val.push(newChain);
				}
			}
			return chain;
		}
		
		function loadCss(style) {
			var oCss = $self.$("style");
			if( oCss === undefined ) {
				oCss = document.createElement("style");
			}
			var styleSheet = ".typing-cursor {color: #fff;font-size: bold;animation: 0.7s blink linear infinite;}@keyframes blink {0% {opacity: 0;}50% {opacity: 1;}100% {opacity: 0;}}@keyframes shake {0% {transform: scale(1); opacity: 0; }10%, 20% {transform: scale(0.8) rotate(-5deg); opacity: 0.3;}30%, 50%, 70%, 90% {transform: scale(1.2) rotate(5deg); opacity: 0.6;}40%, 60%, 80% {transform: scale(1.2) rotate(-5deg); opacity: 0.9;}100% {transform: scale(1) rotate(0); opacity: 1;}}";
			oCss.innerHTML += styleSheet;
			document.getElementsByTagName("head")[0].appendChild(oCss);
		}

		function typing ( dom , span , callback ) {
			setTimeout(function () {
				switch (animate) {
					case "easeOut":
						easeOut(span); 
						break;
					case "number":
						number(span);
						break;
					case "scale":
						scale(span);
						break;
					case "shake":
						shake(span);
						break;
					case "3d-rotate":
						rotate3d(span);
						break;
					case "default" : 
						break;
				}

				dom.appendChild(span);

				callback();
			},  delay);
		}

		function play ( chain , parent ) {
			if ( chain.val.length === 0 ) {
				return;
			}
			parent = parent || null;
			var curr = reverse ?  chain.val.pop() : chain.val.shift();
			
			if ( $self.ObjectTest(curr) === "String" ) {
				var span = document.createElement("span");
				span.appendChild(document.createTextNode(curr));
				
				typing(chain.dom , span , function () {
					if (chain.val.length) {
						play( chain , chain.dom ); 
					} else if (chain.parentChain) { // 回溯
						play( chain.parentChain );
					}
				});
			} else {  //如果是非字符，就创建一个结点
				var dom = document.createElement( curr.domName );
				
				var attrs = $self.toArray(curr.attrs);

				for( var i = 0; i<attrs.length ; i++ ) {
					var attr = attrs[i];
					dom.setAttribute(attr.name , attr.value);
				}
				curr.dom = dom;

				// 父级结点添加新元素
				curr.parentChain = chain;
				parent.appendChild(curr.dom);
				
				// 判断该结点是否有值，如果有就继续遍历，如果没有，就继续遍历父级 
				play( curr.val.length ? curr : chain ,  curr.val.length ? curr.dom : chain.dom );
			}
		}


		/*** animation ***/
		function easeOut (span) {
			span.style.opacity = 0;
			span.style.transition = "1s";

			setTimeout( function () {
				span.style.opacity = 1;
			},120);
		}


		function number (span) {
			var value = span.innerText || textContent;
			var r = Math.floor($self.random(0,2));
			span.innerText ? span.innerText =  r: span.textContent = r;		
			setTimeout( function () {
				span.innerText ? span.innerText =  value: span.textContent = value;
			},1500);
		}

		function shake (span) {
			span.style.animation = "0.5s shake";
		}

		function rotate3d (span) {
			var rDeg   = $self.random(-180 , 180);

			span.style.transition = "0.5s ease";
			span.style.transform = "rotateY("+ rDeg +"deg)";
			
			setTimeout(function() {
				span.style.transform = "rotateY(0deg)";
			},120);
		}
		function scale (span) {
			var rScale = $self.random(0.2 , 0.6);

			span.style.transition = "0.5s ease";
			span.style.transform = "scale("+rScale+")";

			setTimeout(function() {
				span.style.transform = "scale(1)";
			},60);
		}
	}	
}