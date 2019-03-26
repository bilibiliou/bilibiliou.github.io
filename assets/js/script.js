/*!--------------------------------*\
   一些自己添加的功能(原生)
   @author 欧阳湘粤 (Owen)
   https://github.com/bilibiliou/bilibiliou.github.io
\*---------------------------------*/
window.console && console.log && console.log("%c          ___________             ___     ___\n         /   /       \\           /  /__  /  /__\n        /   /         \\         /_____/ /_____/\n       /    |__________\\       |    _______    |\n      /     |_________|        |_  |_______|  _|\n     /  /|  | | |___| |            |__________\n    /__/ |__| |_______|            |__________| \n \n        __    __                               __\n    ___|  |__|  |___            ___       __  |  | \n   |____   __    ___|          |   |     |  |_|  |__ \n  ___|____|_ _|____|___      __|   |__   |   _    __|\n |_____________________|    |___   ___|  |  | |  |\n   /  ____|___|____  \\         |   |     |  | |__|    _\n /___/  __|   |__  \\___\\   ____|   |__   |  |________| |\n      |___________|       |___________|  |_____________|","color:transparent;text-shadow:0 0 1px rgb(240,107,134);");
window.console && console.log && console.log("\n      欢迎加入信管创业基地 %c 面试时请附上console","font:15px/20px '微软雅黑';  background-image: -webkit-linear-gradient(left, #147B96, #E6D205 25%, #147B96 50%, #E6D205 75%, #147B96);-webkit-text-fill-color: transparent;-webkit-background-clip: text; color:red;");
window.console && console.log && console.log("\n      详情请见 http://xgcyjd2014.github.io ");



//console.log模糊
var _log = console.log;
console.log = function() {
  _log.call(console, '%c' + [].slice.call(arguments).join(' '), 'color:transparent;text-shadow:0 0 6px rgba(0,0,0,.5);');
};


// 开场进度条
$(function kaichang(){
  var oContainer = $(".container");
  var oContent = $("#header_progress_content");
  var oProgress = $(".header_progress_expand");
  var oT = $(".header_progress_precentage");
  var oP = $(".precent");
  var oBox = $(".box");

  var timer = null;

  // 响应式改变进度条长度
  $(document).on("resize",function()
  {
    oProgress.css("width", t*oContent.outerWidth());
  });

  timer = setInterval(function(){

    var MaxWidth = oContent.outerWidth();
    var NowWidth = oProgress.outerWidth();
    var t = (NowWidth/MaxWidth);

    if(t >= 1)
    {
      clearInterval(timer);
      oP.html(100);
      oBox.animate({opacity:0} , 500 , function(){
        oContainer.css('display','none');
        oBox.css('display','none');
      });
    }else{
      var precentage = Math.floor(t * 100);
      oP.html(precentage);
    }
  },30);
});

// 消息提醒功能
$(function (){
  window.addEventListener('load',function(){
    if(window.Notification && Notification.permission !== "granted")
    {
      Notification.requestPermission(function(status)
      {
        if(Notification !== status )
        {
          Notification.permission = status;
        }
      });
    }
  })
  if( window.Notification && Notification.permission === "granted" )
  {

    var n = new Notification("仰望星空的天台",{icon:"../../../assets/img/avatar.png",body:"欢迎来到我的博客"});
  }
  else 
    if(window.Notification && Notification.permission !== "denied")
    {
      Notification.requestPermission(function (status){
          if (Notification.permission !== status)
          {
            Notification.permission = status;
          }

          // 如果用户同意了
          if (status === "granted")
          {
            var n = new Notification("Hi!",{icon:"../../../assets/img/avatar.png",body:"欢迎来到我的博客"});
          }
          else 
          {
            return;
          }
        });
    }
});

// 搜索框功能
$(function sousuo(){
  var oSearchInput = document.getElementById('search-input'),
      oSearchList  = document.getElementById('search-list'),
      oSearchButton= document.getElementById('search-button'),
      date         = new Date();

  oSearchButton.onclick = function()
  {
    window.open('http://www.baidu.com/s?wd=' + encodeURI(oSearchInput.value));
    oSearchInput.value = '';
  }
  oSearchInput.onkeydown = function(ev)
  {
    var oEvent = ev || event;
    var index = 0;
    var oLi = oSearchList.getElementsByTagName('li');
    if( oEvent.keyCode == 13 )
    {
      window.open('http://www.baidu.com/s?wd=' + encodeURI(oSearchInput.value));
      oSearchInput.value = '';
    }

    // Up Arrow
    if( oEvent.keyCode == 38 && oSearchInput.value != '' && oSearchList.style.display == 'block' )
    {
      if( index == 0 )
      {
        index = oLi.length - 1;
      }
      else
      {
          index++;  
      }
      console.log(oLi.length);
      for(var i = 0; i<oLi.length ; i++)
      {
        if(i == index)
        {
          console.log(index);
          oLi[i].className = 'search-onfoucs-li';
        }
        oLi[i].className = '';
      }
      return false;
    }

    // Down Arrow
    if( oEvent.keyCode == 40 && oSearchInput.value != '' && oSearchList.style.display == 'block' )
    { 
      if( index == oLi.length - 1 )
      {
        index = 0;
      }
      else
      {
          index++; 
      }
      
      for(var i = 0; i<oLi.length ; i++)
      {
        if(i == index)
        {
            oLi[i].className = 'search-onfoucs-li';
        }
        oLi[i].className = '';
      }

      return false;
    }

    
  }
  oSearchInput.onkeyup = function()
  {  
    if( this.value != '' )
    {
      var oScript = document.createElement('script');
      oScript.src = 'http://suggestion.baidu.com/su?wd='+ this.value + '&cb=callback' + '&t=' + date.getTime();
      document.body.appendChild(oScript);
    }else
    {
      oSearchList.style.display = 'none';
      oSearchList.innerHTML = '';
    }
  }
});

// 搜索框回调函数
function callback( data )
{
  var oSearchInput = document.getElementById('search-input'),
      oSearchList = document.getElementById('search-list'),
      oLi = oSearchList.getElementsByTagName('li'),
      html = '';

  if( data.s.length )
  {
      oSearchList.style.display = 'block';
      html += '<li class="search-onfoucs-li">' + data.s[0] + '</li>'
      for(var i = 1 ; i<data.s.length ; i++)
      {
        html += '<li class="">' + data.s[i] + '</li>'
      }
      oSearchList.innerHTML = html;

      for(var i = 0 ; i<oLi.length; i++)
      {
        oLi[i].index = i;
        oLi[i].onclick = function()
        {
          oSearchInput.value = oLi[this.index].innerHTML;
          oSearchList.style.display = 'none';
        }
      }

      for( var i = 0; i<oLi.length ; i++ )
      {
        oLi[i].onmouseover = function()
        {
          for(var i = 0 ; i<oLi.length ; i++)
          {
            oLi[i].className = '';
          }
          this.className = 'search-onfoucs-li';
        }

      }

  }else
  {
    oSearchList.style.display = 'none';
    oSearchList.innerHTML = '';
  }
}

    /*!--------------------------------*\
       My blog Theme Peiwen Lu & Owen
       
       @Theme author Peiwen Lu (P233)
       https://github.com/P233/3-Jekyll
    \*---------------------------------*/
    // Detect window size, if less than 1280px add class 'mobile' to sidebar therefore it will be auto hide when trigger the pjax request in small screen devices.
    if ($(window).width() <= 1280) {
      $('#sidebar').addClass('mobile')
    }

    // Variables
    var sidebar    = $('#sidebar'),
        container  = $('#post'),
        content    = $('#pjax'),
        button     = $('#icon-arrow');

    // Tags switcher
    var clickHandler = function(id) {
      return function() {
        $(this).addClass('active').siblings().removeClass('active');
        $('.pl__all').hide();
        $('.' + id).delay(50).fadeIn(350);
      }
    };
    $('#tags__ul li').each(function(index){
      $('#' + $(this).attr('id')).on('click', clickHandler($(this).attr('id')));
    });

    // If sidebar has class 'mobile', hide it after clicking.
    $('.pl__all').on('click', function() {
      $(this).addClass('active').siblings().removeClass('active');
      if (sidebar.hasClass('mobile')) {
        $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
      }
    });

    $('#mobile-avatar').on('click', function(){
      $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
    });

    // Pjax 无刷新站内刷新
    $(document).pjax('#avatar, #mobile-avatar, .pl__all', '#pjax', { fragment: '#pjax', timeout: 10000 });
    $(document).on({
      'pjax:click': function() {
        content.removeClass('fadeIn').addClass('fadeOut');
        NProgress.start();
      },
      'pjax:start': function() {
        content.css({'opacity':0});
      },
      'pjax:end': function() {
        NProgress.done();
        container.scrollTop(0);
        content.css({'opacity':1}).removeClass('fadeOut').addClass('fadeIn');
        afterPjax();
      }
    });

    // Re-run scripts for post content after pjax
    function afterPjax() {
      // Open links in new tab
      $('#post__content a').attr('target','_blank');

      // Generate post TOC for h1 h2 and h3
      var toc = $('#post__toc-ul');
      // Empty TOC and generate an entry for h1
      toc.empty().append('<li class="post__toc-li post__toc-h1"><a href="#post__title" class="js-anchor-link">' + $('#post__title').text() + '</a></li>');

      // Generate entries for h2 and h3  目录随机5位哈希值
      $('#post__content').children('h2,h3').each(function() {
        // Generate random ID for each heading
        $(this).attr('id', function() {
          var ID = "",
              alphabet = "abcdefghijklmnopqrstuvwxyz";

          for(var i=0; i < 5; i++) {
            ID += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
          }
          return ID;
        });

        if ($(this).prop("tagName") == 'H2') {
          toc.append('<li class="post__toc-li post__toc-h2"><a href="#' + $(this).attr('id') + '" class="js-anchor-link">' + $(this).text() + '</a></li>');
        } else {
          toc.append('<li class="post__toc-li post__toc-h3"><a href="#' + $(this).attr('id') + '" class="js-anchor-link">' + $(this).text() + '</a></li>');
        }
      });

      // Smooth scrolling  目录平滑滚动
      $('.js-anchor-link').on('click', function() {
        var target = $(this.hash);
        container.animate({scrollTop: target.offset().top + container.scrollTop() - 70}, 500, function() {
          target.addClass('flash').delay(700).queue(function() {
            $(this).removeClass('flash').dequeue();
          });
        });
      });

      // 解决pjax 加载页面后无法收放全屏的问题(暂行)
      $('#js-fullscreen').on('click', function() {
      if (button.hasClass('fullscreen')) {
        sidebar.removeClass('fullscreen');
        button.removeClass('fullscreen');
        content.delay(300).queue(function(){
          $(this).removeClass('fullscreen').dequeue();
        });
      } else {
        sidebar.addClass('fullscreen');
        button.addClass('fullscreen');
        content.delay(200).queue(function(){
          $(this).addClass('fullscreen').dequeue();
        });
      }
    });


    //微信淡入淡出 使用Move.js运动框架
    $(function(){
            var oWeixin = document.querySelector("#weixin");
            var oQR = document.querySelector("#QR-Code");
            var oQrImg = oQR.getElementsByTagName('img')[0];
            var l = $("#QR-Code").css("left"); 
            var t = $("#QR-Code").css("top"); 
            oWeixin.onmouseover = function()
            {
              $("#QR-Code").css("left",l);
              $("#QR-Code").css("top",t);
              $("#QR-Code").css("width",'160');
              oQR.style.display = "block";
              startMove(oQrImg , { width:150 , height :　150 , opacity:70})
              startMove(oQR , { height :　160 , opacity:70});
            }

            oWeixin.onmouseout = function()
            {
                startMove(oQrImg , { width:0 , height :　0 ,  opacity:0} );
                startMove(oQR , { width:0 , height :　0 ,  opacity:0 , top : 20 , left : 15 });   
            }
      });

      // pajx_loadDuodsuo();
    }
    afterPjax();   

/**
 * pjax回调函数.加载多说
 */
function pajx_loadDuodsuo(){
  var dus=$(".ds-thread");
  if($(dus).length==1){
    var el = document.createElement('div');
    el.setAttribute('data-thread-key',$(dus).attr("data-thread-key"));//必选参数
    el.setAttribute('data-url',$(dus).attr("data-url"));
    DUOSHUO.EmbedThread(el);
    $(dus).html(el);
    
  }
}






$(".header_progress_expand").css("width" , "100%");