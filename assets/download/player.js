window.onload = function()
{
	// 获取DOM节点
	var oFullScreen = $('#full-screen');
	var oControlPlay = $('control-play');
	var oDanmuClose = $('.danmu-close');
	var oDanmubg = $('#danmu-search');
	var oDanmuSearch = $SelectorAll( $('#danmu-search') , 'input' )[0];
	var oExpressButton = $SelectorAll($('#express-button') , 'i' )[0];
	var oLoveIcon = $('#love-icon');
	var oHateIcon = $('#hate-icon');
	
	var oControlVolmueProgress = $('#control-volmue-progress');
	var oControlVolmue = $SelectorAll( $('#control-volmue'), 'i' )[0];
	var oVolmueProgress = $('#volmue-progress');
	
	var oControlPlay = $('#control-play');
	var ocontrolPlayStyle = $SelectorAll( oControlPlay , 'i' )[0];
	
	var oV = $('video');
	var oSource = $SelectorAll( oV , 'source' );
	var oNowTime = $('#now-time');
	var oEndTime = $('#end-time');
	var oControlDot = $('#control-dot');
	
	var oPlayerProgress = $('#player-progress');
	var oPlayerNowProgress = $('#player-now-progress');
	var oFastForward = $('#fast-forward');
	var oRewindDown = $('#rewind-down');
	var oPlayerDot = $('#player-dot');
	
	// 开关 
	var danmuSwitch = false;
	var showdrag = false; // 判断用户现在是否需要拖动进度条
	
	// 变量
	var timer = null;
	var playtimer = null;
	var forward = 5;

	oFastForward.onmouseover = oRewindDown.onmouseover = oPlayerProgress.onmouseover = oPlayerNowProgress.onmouseover = oV.onmouseover = function()
	{
		showdrag = true;
		startMove(oPlayerProgress , { bottom : 89 , height : 16 , width : 838 , left : 22 , opacity : 100},function()
			{
				startMove( oFastForward , {  right : 0 });
				startMove( oRewindDown , {  left : 0 });
				startMove( oPlayerDot , { width : 16 , height : 16 , marginTop : -8 , marginLeft : -8 , opacity : 100})
			});
		startMove(oPlayerNowProgress , { height : 16 , width : parseInt((oV.currentTime/oV.duration)*822)});
	}

	oV.onmouseout = function()
	{
		showdrag = false;
		startMove( oFastForward , {  right : -22});
		startMove( oRewindDown , {  left : -22});
		startMove( oPlayerDot , { width : 0 , height : 0 , marginTop : 0 , marginLeft : 0, opacity : 0},function(){
			startMove(oPlayerProgress , { bottom : 85 , height : 5 , width : 882 , left : 0});
			startMove(oPlayerNowProgress , { height : 5 , width : (oV.currentTime/oV.duration)*882});

		});
		
	}
	oPlayerProgress.onmousedown = function(ev)
	{
		var ev = ev || window.event;
		var disX = ev.clientX - 226;
		
		oV.currentTime = parseInt((disX/822) * oV.duration);
		oPlayerNowProgress.style.width = parseInt((oV.currentTime/oV.duration)*882) + 'px';
		oNowTime.innerHTML = getTime( oV.currentTime );
		return false;
	}
	oPlayerNowProgress.onmousedown = function(ev)
	{
		var ev = ev || window.event;
		var disX = ev.clientX - 226;
		
		oV.currentTime = parseInt((disX/822) * oV.duration);
		this.style.width = parseInt((oV.currentTime/oV.duration)*882) + 'px';
		oNowTime.innerHTML = getTime( oV.currentTime );
		return false;
	}
	oPlayerDot.onmousedown = function(ev)
	{
		var ev = ev || window.event;
		var disX = ev.clientX - this.offsetLeft;
	
		document.onmousemove = function()
		{
			var ev = ev || window.event;
			var to = ev.clientX - disX;

			if(to >= 822){ to = 822;}
			if(to <= 0){ to = 0;}

			oPlayerNowProgress.style.width = to + 'px';
			oV.currentTime = oV.duration * parseInt(oPlayerNowProgress.style.width)/822;
			oNowTime.innerHTML = getTime( oV.currentTime );
			return false;
		}

		document.onmouseup = function()
		{
			document.onmouseup = null;
			document.onmousemove = null;
		}
		return false;
	}

	// 快进
	oFastForward.onclick = function()
	{
		oV.currentTime += forward;
		oNowTime.innerHTML = getTime( oV.currentTime );
		if( showdrag )
		{
			oPlayerNowProgress.style.width = parseInt((oV.currentTime/oV.duration )*822) + 16 + 'px';
		}else{
			oPlayerNowProgress.style.width = parseInt((oV.currentTime/oV.duration )*882) + 'px';
		}
	}
	
	// 快退
	oRewindDown.onclick = function()
	{
		oV.currentTime -= forward;
		oNowTime.innerHTML = getTime( oV.currentTime );
		if( showdrag )
		{
			oPlayerNowProgress.style.width = parseInt((oV.currentTime/oV.duration )*822) + 16 + 'px';
		}else{
			oPlayerNowProgress.style.width = parseInt((oV.currentTime/oV.duration )*882) + 'px';
		}
	}

	// 左 37
	document.onkeydown = function(ev)
	{
		var ev = ev || window.event;

		if(ev.keyCode == 37)
		{
			oV.currentTime -= forward;
			oNowTime.innerHTML = getTime( oV.currentTime );
			if( showdrag )
			{
				oPlayerNowProgress.style.width = parseInt((oV.currentTime/oV.duration )*822) + 16 + 'px';
			}else{
				oPlayerNowProgress.style.width = parseInt((oV.currentTime/oV.duration )*882) + 'px';
			}
		}
		if( ev.keyCode == 39)
		{
			oV.currentTime += forward;
			oNowTime.innerHTML = getTime( oV.currentTime );
			if( showdrag )
			{
				oPlayerNowProgress.style.width = parseInt((oV.currentTime/oV.duration )*822) + 16 + 'px';
			}else{
				oPlayerNowProgress.style.width = parseInt((oV.currentTime/oV.duration )*882) + 'px';
			}
			
		}
		if( ev.keyCode == 13)
		{
			play();
		}
	}

	// 静音按钮
	oControlVolmue.onclick = function()
	{
		if( oV.muted )
		{
			this.className = 'fa fa-volume-up fa-2x';	
			oVolmueProgress.style.width = '76px';
			oV.volume = 1;
			
			// 这里需要手动修改是否静音的属性
			oV.muted = false;
		}
		else
		{
			this.className = 'fa fa-volume-down fa-2x';
			oVolmueProgress.style.width = 0;
			oV.volume = 0;

			oV.muted = true;
		}
	}


	// 音量大小拖拽
	oControlDot.onmousedown = function(ev)
	{
		var ev = ev || window.event;
		var disX = ev.clientX - this.offsetLeft;

		document.onmousemove = function(ev)
		{
			var ev = ev || window.event;
			var to = ev.clientX - disX;

			// 控制音量条是否到达最大 长度 width = 实际长度(76px) + padding(6px)
			if(to >= 82){ to = 82;}
			if(to <= 6){ to = 6;}

			oVolmueProgress.style.width = to + 'px';
			
			if( parseInt(oVolmueProgress.style.width) > 6 )
			{
				oControlVolmue.className = 'fa fa-volume-up fa-2x';
				oV.muted = false;
			}
			
			if( parseInt(oVolmueProgress.style.width) == 6 )
			{
				oControlVolmue.className = 'fa fa-volume-down fa-2x';
				oV.muted = true;
			}
			
			oV.volume = to/82;
			 	
		}

		document.onmouseup = function(ev)
		{
			document.onmousemove = null;
			document.onmouseup = null;
		}

		return false;
	}

	// 音量条大小控制
	oVolmueProgress.onmousedown = function(ev)
	{
		var ev = ev || window.event;
		var disX = ev.clientX - 960;

		if(disX >= 82){ disX = 82;}
		if(disX <= 6){ disX = 6;}
		oVolmueProgress.style.width = disX + 'px';
		
		oV.volume = disX/82;

		
		if( parseInt(oVolmueProgress.style.width) == 6 )
		{
			oControlVolmue.className = 'fa fa-volume-down fa-2x';
			oV.muted = true;
		}

		if( parseInt(oVolmueProgress.style.width) > 6 )
		{
			oControlVolmue.className = 'fa fa-volume-up fa-2x';
			oV.muted = false;
		}
		return false;
	}

	oControlVolmueProgress.onmousedown = function()
	{
		var ev = ev || window.event;
		var disX = ev.clientX - 960;

		if(disX >= 82){ disX = 82;}
		if(disX <= 6){ disX = 6;}
		oVolmueProgress.style.width = disX + 'px';
		oV.volume = disX/82;

		if( parseInt(oVolmueProgress.style.width) == 6 )
		{
			oControlVolmue.className = 'fa fa-volume-down fa-2x';
			oV.muted = true;
		}

		if( parseInt(oVolmueProgress.style.width) > 6 )
		{
			oControlVolmue.className = 'fa fa-volume-up fa-2x';
			oV.muted = false;
		}
		return false;
	}


	oV.onclick = function()
	{
		play();
	}
	
	// 播放开关
  	oControlPlay.onclick = function()
  	{
  		play();
  	}

  	function play()
  	{
  		if( oV.paused )
  		{
  			oV.play();
  			ocontrolPlayStyle.className = 'fa fa-pause fa-2x';
  			timer = setInterval( function(){
		  		if( oV.currentTime >= oV.duration)
		  		{
		  			clearInterval(timer);
		  		}
		  		oNowTime.innerHTML = getTime( oV.currentTime );
		  	} , 1000);

		  	playtimer = setInterval( function()
		  	{
		  		if( oV.currentTime >= oV.duration)
		  		{
		  			clearInterval(playtimer);
		  		}
		  		oPlayerNowProgress.style.width = (oV.currentTime/oV.duration)*882 + 'px';
		  	} , 1000);
  			
  		}
  		else
  		{
  			oV.pause();
  			ocontrolPlayStyle.className = 'fa fa-play fa-2x';
  			// 暂停前还需要再更新一下时间
  			oNowTime.innerHTML = getTime( oV.currentTime );
  			oPlayerNowProgress.style.width = (oV.currentTime/oV.duration)*882 + 'px';
  			clearInterval( timer );
  			clearInterval( playtimer );
  		}
  	}

  	function getTime( iNum )
  	{
  		// 因为duration 获取的时间是以秒为单位,并且
  		// 先将duration转换为整数
  		iNum = parseInt( iNum );

  		// 获得的秒处以3600 , 算算有多少个小时
  		var iH = addZero(Math.floor(iNum/3600));
  		var iM = addZero(Math.floor(iNum%3600/60));
  		var iS = addZero(iNum%60);

  		return iH + ':' + iM + ':' + iS;
  		function addZero( iNum )
  		{
  			if( iNum<9 )
  			{
  				return '0' + iNum;
  			}
  			else
  			{
  				return '' + iNum;
  			}
  		}
  	}

  	// 全屏
  	oFullScreen.onclick = function()
  	{
  		launchFullscreen(oV);
  	}

  	// 双击全屏
 	oV.ondblclick = function()
	{
		launchFullscreen(oV);
	}
  	// 控制全屏兼容
   function launchFullscreen(element)
   {
  	if(element.requestFullscreen)
  	{
    	element.requestFullscreen();
  	}
  	else
  		if(element.mozRequestFullScreen)
  		{
   	 		element.mozRequestFullScreen();
  		} 
  		else 
  			if(element.webkitRequestFullscreen)
  			{
    			element.webkitRequestFullscreen();
  			} else 
  				if(element.msRequestFullscreen)
  				{
    				element.msRequestFullscreen();
  				}	
	}

	// 弹幕开关
	oDanmuClose.onclick = function()
	{
		danmuSwitch ? this.className = 'danmu-close': this.className = 'danmu-open'; 
		danmuSwitch = !danmuSwitch;
	}

	// 发弹幕选框
	oDanmuSearch.onfocus = function()
	{
		oDanmubg.className = 'danmu-search-color-active';
		this.className = 'danmu-search-color-active';
		oExpressButton.classList.toggle('expessButton-active');
	}

	oDanmuSearch.onblur = function()
	{
		oDanmubg.className = 'danmu-search-color';
		this.className = 'danmu-search-color';
		oExpressButton.classList.toggle('expessButton-active');
	}

	oLoveIcon.onmouseover = oHateIcon.onmouseover = function()
	{
		oHateIcon.style.display = 'block';
		startMove( oHateIcon , { top : 24 , opacity : 100 });
	}
	oLoveIcon.onmouseout = oHateIcon.onmouseout = function()
	{
		startMove( oHateIcon , { top : 0 , opacity : 0 },function(){
			oHateIcon.style.display = 'none';
		});
	}

		oEndTime.innerHTML = ' / ' + getTime(oV.duration);
	

	
	// 拖拽打开视频(目前没实现)
	// oV.ondragover = function(ev)
	// {
	// 	var ev = ev || window.event;
	// 	ev.preventDefault();
	// }

	// oV.ondragdrop = function(ev)
	// {
	// 	var ev = ev || window.event;
	// 	ev.preventDefault();

	// 	var fs = ev.dataTransfer.files;
		
	// 	var fd = new FileReader();

	// 	fd.readAsDataURL( fs[i] );

	// 	oV.src = decodeURI(this.result);
	// 	fd.onload = function()
	// 	{
	// 		console.log(this.result);
	// 		console.log(fd.result);
	// 		oV.src = this.result;
			
	// 		oV.load();

	// 	}

		

	// }
	
	
}


// 工具框架
function $(o){
	return document.querySelector(o);
}

function $SelectorAll( obj , element ){
	return obj.querySelectorAll(element);
}

function getStyle(obj,attr)
{
	/*非火狐，获取内部样式*/
	if(obj.currentStyle)
	{
		return obj.currentStyle[attr];
	}
	else
	{
		/*火狐，获取内部样式*/
		return getComputedStyle(obj, false)[attr];
	}
}

function startMove(obj,json,fn)
{
	var SpeedIndex = 8;
	clearInterval(obj.timer);
	obj.timer = setInterval(function()
	{
		/*判断是否停止的标记，先假定为true */
		var bStop = true;	
		
		for(var attr in json)
		{
			//1.取当前的值
			var iCur = 0;
			if(attr != 'opacity')
			{
				/*去单位*/
				iCur = parseInt(getStyle(obj,attr));
			}
			else
			{
				/*如果是透明度的变化，取透明度的值，乘以100*/
				iCur = parseInt(parseFloat(getStyle(obj, attr)*100));
			}
			
			//2.算速度
			/*每次遍历速度都会改变，当某个属性达到终点时，遍历依然进行，但改次遍历速度为0(不变化)*/
			var iSpeed = (json[attr] - iCur)/SpeedIndex;
			iSpeed = iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
			
		
			//3.执行运动
			/*只要有一个运动的值没有运动完，就将标记赋值为false*/
			if(iCur != json[attr])
			{
				bStop = false;	
			}
			
			if(attr == 'opacity')
			{
				obj.style.filter = 'alpha(opacity:' + (iCur + iSpeed) + ')';
				obj.style[attr] = (iCur + iSpeed)/100;
			}
			else
			{
				obj.style[attr] =  iCur + iSpeed + 'px';
			}
		}
		
		/*如果全部运动已经完成，就停止定时器，并执行后继函数*/
		if(bStop)
		{
			if(fn)
			{
				fn();
			}
			clearInterval(obj.timer);
		}
	},30);

}
