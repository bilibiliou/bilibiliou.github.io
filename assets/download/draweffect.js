function draweffect( obj )
{

	var effect = [];
	obj.effect ? effect = obj.effect : effect[0] = 'default'; 
	var x = obj.x || 0;
	var y = obj.y || 0;
	var MosaicValue = obj.MosaicValue || 5;
	if(!obj.ImageSrc)
	{
		console.log( '%c 请输入您的图片引用源:' , 'background:red; color:white;' );
		console.log( '%c 在对象想中添加 ImageSRc : "图片路径" ' , 'background:#edc; color:yellow;'); 
		return;
	}

	var yImg = new Image();
	yImg.src = obj.ImageSrc;
	
	oCanvas.width = yImg.width;
	oCanvas.height = yImg.height;
	oGc.drawImage( yImg , x , y );
	
	var w = yImg.width;
	var h = yImg.height; 
	yImg.onload = function(){

		for(var t = 0 ; t<effect.length ; t++)
		{
			switch( true )
			{
				case effect[t] == 'default':
				break;

				//反色
				case effect[t] == 'inverseColor':
				var oImg = oGc.getImageData( x , y , yImg.width , yImg.height );
				for( var i = 0 ; i<h ; i++ )
				{
					for( var j = 0 ; j<w ; j++ )
					{
						var result = [];
						var color = getXY( oImg , j , i );

						result[0] = 255 - color[0];
						result[1] = 255 - color[1];
						result[2] = 255 - color[2];
						result[3] = color[3];
						setXY( oImg , j , i ,result );
					}
				}
				oGc.putImageData( oImg , x , y );
				break;

				//竖直方向渐变
				case effect[t] == 'GradientX':
				var oImg = oGc.getImageData( x , y , yImg.width , yImg.height );
				for( var i = 0 ; i<h ; i++ )
				{
					for( var j = 0 ; j<w ; j++ )
					{
						var result = [];
						var color = getXY( oImg , j , i );

						result[0] = color[0];
						result[1] = color[1];
						result[2] = color[2];
						result[3] = 255*i/h;
						setXY( oImg , j , i ,result );
					}
				}
				oGc.putImageData( oImg , x , y );
				break;

				//水平方向渐变
				case effect[t] == 'GradientY':
				var oImg = oGc.getImageData( x , y , yImg.width , yImg.height );
				for( var j = 0 ; j<w ; j++ )
				{
					for(  var i = 0 ; i<h ; i++)
					{
						var result = [];
						var color = getXY( oImg , j , i );

						result[0] = color[0];
						result[1] = color[1];
						result[2] = color[2];
						result[3] = 255*j/h;
						setXY( oImg , j , i ,result );
					}
				}
				oGc.putImageData( oImg , x , y );
				break;

				//图片取反
				case effect[t] == 'invertedImage':
				var oImg = oGc.getImageData( x , y , yImg.width , yImg.height );
				var newImage = oGc.createImageData(yImg.width , yImg.height);
				for( var i = h ; i>0 ; i-- )
				{
					for( var j = 0 ; j<w ; j++ )
					{
						var result = [];
						var color = getXY( oImg , j , i );

						result[0] = color[0];
						result[1] = color[1];
						result[2] = color[2];
						result[3] = color[3];
						setXY( newImage , j , h - i ,result );
					}
				}
				oGc.putImageData( newImage , x , y );
				break;

				//马赛克
				case effect[t] == 'MosaicImage':
				var oImg = oGc.getImageData( x , y , yImg.width , yImg.height );
				var newMosaicImage = oGc.createImageData(yImg.width,yImg.height);


				var stepW = Math.floor(w/MosaicValue);
				var stepH = Math.floor(h/MosaicValue);

				for( var i = 0 ; i<stepH ; i++ )
				{
					for( var j = 0; j<stepW ; j++)
					{
						//每一个 MosaicValue*MosaicValue 大格中取一个小格的像素的颜色 并以这个颜色给整个大格的所有像素赋值
						var color = getXY( oImg , j*MosaicValue + Math.floor(Math.random()*MosaicValue) , i*MosaicValue + Math.floor(Math.random()*MosaicValue) );
						
						for( var k = 0 ; k<MosaicValue ; k++ )
						{
							for( var l = 0 ; l<MosaicValue ; l++ )
							{
								setXY( newMosaicImage , j*MosaicValue+l , i*MosaicValue+k , color );
							}
						}


					}
				}
				oGc.putImageData( newMosaicImage , x , y );
				break;
			}	
		}
	}
	
	

	/* 内置函数 */
	function setXY( obj , x , y  , color )
	{
	  var w = obj.width;
	  var h = obj.height;
	  var d = obj.data;

	  d[4*(y*w+x)] = color[0];
	  d[4*(y*w+x)+1] = color[1];
	  d[4*(y*w+x)+2] = color[2];
	  d[4*(y*w+x)+3] = color[3];
	}

	function getXY( obj , x , y )
	{
	  var w = obj.width;
	  var h = obj.height;
	  var d = obj.data;

	  var color = [];
	  
	  color[0] = d[4*(y*w+x)];
	  color[1] = d[4*(y*w+x)+1];
	  color[2] = d[4*(y*w+x)+2];
	  color[3] = d[4*(y*w+x)+3];

	  return color;
	}
}	