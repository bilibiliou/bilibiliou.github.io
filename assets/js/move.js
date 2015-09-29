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
