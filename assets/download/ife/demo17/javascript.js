/********* 数据模拟 ***********/ 
// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
  var arr = [];
  var dat = new Date("2016-01-01");
  var datStr = '';

  for (var i = 1; i < 92; i++) {
    var returnData = {};
    datStr = getDateStr(dat);
    returnData.date = datStr;
    returnData.data = Math.ceil(Math.random() * seed);
    arr.push(returnData);
    dat.setDate(dat.getDate() + 1);
  }

  return arr;
}

var aqiSourceData = [
  {
    totalData: randomBuildData(500),
    cityName: "北京"
  },
  {
    totalData: randomBuildData(300),
    cityName: "上海"
  },
  {
    totalData: randomBuildData(200),
    cityName: "广州"
  },
  {
    totalData: randomBuildData(100),
    cityName: "深圳"
  },
  {
    totalData: randomBuildData(300),
    cityName: "成都"
  },
  {
    totalData: randomBuildData(500),
    cityName: "西安"
  },
  {
    totalData: randomBuildData(100),
    cityName: "福州"
  },
  {
    totalData: randomBuildData(100),
    cityName: "厦门"
  },
  {
    totalData: randomBuildData(500),
    cityName: "沈阳"
  },
  {
    totalData: randomBuildData(1000),
    cityName: "哈尔滨"
  },
];


// 用于渲染图表的数据
var chartData = {};

// tools
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
    return;
  } 
}

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: 0,
  nowGraTime: "Day"
}

var aCUl = document.querySelector(".aqi-chart-ul");
var aCLis   = document.querySelectorAll(".aqi-chart-ul li");

var fGT  = document.querySelector("#form-gra-time");
var fGT_Inputs  = document.querySelectorAll("input");

var fGC_CS  = document.querySelector("#form-gra-city #city-select");

var cN    = document.querySelector(".city-name");
var cD    = document.querySelector(".city-date");

/**
 * 渲染图表
 */
function renderChart() {
  var htmlStruct = "";
  
  // render chart Date
  for( var i = 1; i<92 ; i++) {
    var color = "#"+Math.floor(Math.random()*16777215).toString(16);
    htmlStruct += '<div style="background: '+color+';margin-left: 5px;"><span class="Date-datashow"></span></div>';
  }
  aCLis[0].innerHTML = htmlStruct;

  htmlStruct = "";
  for( var i = 1; i<15; i++ ) {
    var color = "#"+Math.floor(Math.random()*16777215).toString(16);
    htmlStruct += '<div style="background: '+color+';margin-left: 20px;"><span class="Week-datashow"></span></div>';
  }
  aCLis[1].innerHTML = htmlStruct;

  htmlStruct = "";
  for( var i = 1; i<=3 ; i++ ) {
    var color = "#"+Math.floor(Math.random()*16777215).toString(16);
    htmlStruct += '<div style="background: '+color+';margin-left: 35px;"><span class="Month-datashow"></span></div>';
  }
  aCLis[2].innerHTML = htmlStruct;
}

function Change() {
  var boff=null;
  fGT.addEventListener("click" , function(ev) {
      if( ev.target && ev.target.nodeType === 1 && ev.target.tagName === "INPUT" ) {
          if( boff !== ev.target ) {
            boff = ev.target;
            var Target;
            if ( ev.target.tagName === "LABEL" ) {
              Target = ev.target.querySelector("input");
            } else {
              Target = ev.target;
            }
            
            cD.innerHTML = Target.value;
            pageState.nowGraTime = Target.value;

            refreshChart();
          } else {
            return;
          }
      }
  },false);

  fGC_CS.addEventListener("click" , function(ev) {
    if ( this.selectedIndex !==  pageState.nowSelectCity) {
      var c = this.selectedIndex;
      pageState.nowSelectCity = c;

      if(c !== 0) {
        cN.innerHTML = this.options[c].text;
        refreshChart();
      } else {
        cN.innerHTML = "";

        backBottom();
        for( var i = 0 ; i<nowLi.children.length; i++ ) {
          nowLi.children[i].children[0].innerHTML = "";
          nowLi.children[i].style.height = 0 + "px";
        }
      }

    } else {
      return;
    }
  },false);
}

var boff2 = null;
var nowLi = aCLis[0];
function refreshChart () {
  if( pageState.nowSelectCity === 0 ) {
    return;
  }
  // 如果日期类型发生变化来才切换chart
  if( boff2 !== pageState.nowGraTime ) {
    boff2 = pageState.nowGraTime;
    for( var i = 0 ; i<aCLis.length ; i++ ) {
      removeClass(aCLis[i] , "show");
      if ( pageState.nowGraTime === aCLis[i].dataset.value ) {
        addClass(aCLis[i] , "show");
        nowLi = aCLis[i];
      }
    }
  }
  backBottom();
  loadData( nowLi );
}

function loadData( nowLi ) {
    switch( nowLi.dataset.value ) {
      case "Day":
      // 日数据
      for (var i = 0; i< nowLi.children.length; i++) {
        nowLi.children[i].style.transition = "0.2s " + i * 0.05 + "s";
        nowLi.children[i].title = "当前城市: " + aqiSourceData[pageState.nowSelectCity - 1].cityName + "," + "时间: " + aqiSourceData[pageState.nowSelectCity - 1].totalData[i].date + " 空气污染指数: " + aqiSourceData[pageState.nowSelectCity - 1].totalData[i].data;
        nowLi.children[i].children[0].innerHTML = aqiSourceData[pageState.nowSelectCity - 1].totalData[i].data;
        nowLi.children[i].style.height =  aqiSourceData[pageState.nowSelectCity - 1].totalData[i].data + "px";
      }
        break;
      case "Week":
      // 周数据
        var dat = new Date("2016-01-01");
        var result = [];
        var arr = [];
        for( var i = 0 ; i<=90 ; i++ ) {
          arr.push(aqiSourceData[pageState.nowSelectCity - 1].totalData[i].data);
          
          if ( dat.getDay() === 0 || i === 90 ) {
            var r = 0;
            for( var j = 0 ; j<arr.length; j++ ) {
              r += arr[j];
            }
            r /= arr.length;
            result.push(Math.floor(r));
            arr.length = 0;
          } 

          dat.setDate(dat.getDate()+1);
        }
        
        for (var i = 0; i<nowLi.children.length; i++) {
          nowLi.children[i].style.transition = "0.2s " + i * 0.05 + "s";
          nowLi.children[i].title = "当前城市: " + aqiSourceData[pageState.nowSelectCity - 1].cityName + "," + "时间: " + aqiSourceData[pageState.nowSelectCity - 1].totalData[i].date + " 周平均空气污染指数: " + result[i];
          nowLi.children[i].children[0].innerHTML = result[i];
          nowLi.children[i].style.height =  result[i] + "px";
        }
        break;
      case "Month":
      // 月数据
      var dat = new Date("2016-01-01");
      var result = [];
      var nowM = 1;
      var arr = [];
      for( var i = 0 ; i<=90 ; i++ ) {
        if( dat.getMonth()+1 !== nowM || i === 90 ) {
          var r = 0;

          for( var j = 0 ; j<arr.length ; j++ ) {
            r += arr[j];
          }
          
          result.push(Math.floor(r / arr.length));

          nowM = dat.getMonth()+1;
          arr.length = 0;
        }

        arr.push(aqiSourceData[pageState.nowSelectCity - 1].totalData[i].data);        
        dat.setDate(dat.getDate()+1);
      }

     for (var i = 0; i< nowLi.children.length; i++) {
        nowLi.children[i].style.transition = "0.2s " + i * 0.05 + "s";
        nowLi.children[i].title = "当前城市: " + aqiSourceData[pageState.nowSelectCity - 1].cityName + "," + "时间: " + aqiSourceData[pageState.nowSelectCity - 1].totalData[i].date + " 月平均空气污染指数: " + result[i];
        nowLi.children[i].children[0].innerHTML = result[i];
        nowLi.children[i].style.height =  result[i] + "px";
      }
      break;
    }
}

function backBottom() {
  var top = document.documentElement.clientHeight;
  scroll(0,top);
}
function init() {
  renderChart();
  Change();
}