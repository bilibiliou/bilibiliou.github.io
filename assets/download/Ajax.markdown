function ajax( method , data , url , success , faild )   
{
  // 设置形参缺省值
  method = method || 'get';
  data = data || undefined;
  url = url || undefined
  success = success || undefined;
  faild = faild || undefined;
  
  //data 以JSON形式传递过来
  try
  {
    var xhr =  new XMLHttpRequest();
  }
  catch(e)
  {
    var xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }

  if(method.toLowerCase() == "post")
  {
    xhr.open( 'post' , url , true );
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //当post方法需要用send方法传递参数时候
    xhr.send(data);
  }
  else if(method.toLowerCase() == "get")
  {
    isData();
    xhr.open( 'get' , url , true );
    xhr.send(null);
  }
  else
  {
    alert("你参数选择的方法输入错误,请修改脚本");
    return;
  }
  
  xhr.onreadystatechange = function()
  {
    if(xhr.readyState == 4 && xhr.status == 200)
    {
      if(success)
      {
        success( xhr.responseText );
      }
      else
      {
        faild && faild();
      }
    }
  }

  function isData()
  {
    if(data)
    {
      if( typeof(data) != 'object')
      {
        //当data是其他数据类型的时候
        //(其他类型以字符串形传参，并且保证符合url格式不然会出错误)
        url = url + '?' +　data + new Date().getTime();
      }
      else
      {
        //当data是JSON的时候
        for(i in data)
        {
          // 这里的 i 就是遍历对象的属性名 data[i] 是属性的值
          url = addURLParam(url , i , data[i]);
        }

        url += new Date().getTime();
      }  
    }
  }

  function addURLParam(url , name , value)
  {
    //遍历url字符串 判断是否有?字符 如果没有 就添加一个?字符 后面跟着加数据
    //如果已经有了 说明需要添加的不是第一个数据了
    //这时候就加一个&后面再跟其他数据

    url += (url.indexOf("?") == -1 ? "?" : "&");
    
    //encodeURIComponent()函数用于将 除url标准字符外的 
    //其他字符转为HTTP编码
    
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
  }
}