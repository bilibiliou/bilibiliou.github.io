kCalendarMaker = (function () {
    $ = new u();

    function calendar ( Parent , target , callback ) {
        this.Parent = Parent;
        this.oT = target;
        this.callback = callback;
        this.init();
    }

    calendar.prototype = {
        init : function () {
            // 构建日期控件
            var html = "",
                $self = this,
                oDate = new Date(),
                NowYear = oDate.getFullYear(),
                NowMonth = oDate.getMonth()+1,
                NowDate = oDate.getDate(),
                strsYear = NowYear.toString(),
                sYear = ~~(strsYear.substring(0 , strsYear.length - 1)+"0"),
                eYear = ~~(strsYear.substring(0 , strsYear.length - 1)+"9");

            os = document.createElement("section");
            
            $.addClass(os , "calendar-table c-s none");
            os.setAttribute("data-boff","true");
            html += '<div class="calendar-caption">' +
                        '<div class="m-date-choose">' +
                            '<a href="#" class="l-arrow"></a>' +
                            '<a href="#" class="r-arrow"></a>' +
                            '<ul class="m-date-list" data-voff="3">' +
                                '<li>' +
                                    '<span class="YYYY-range none" data-syear="'+sYear+'" data-eyear="'+eYear+'">'+sYear+'-'+eYear+'</span>' +
                                    '<span class="MM" data-month="'+ NowMonth +'">'+ $.digitCn(NowMonth) +'月</span>' +
                                    '<span class="YYYY" data-year="'+NowYear+'">'+ NowYear +'</span>' +
                                '</li>' +
                            '</ul>' +
                        '</div>' +
                        '<div class="week-list-wrap">' +
                            '<ul class="week-list">' +
                                '<li>Mon</li>' +
                                '<li>Tue</li>' +
                                '<li>Wed</li>' +
                                '<li>Thu</li>' +
                                '<li>Fri</li>' +
                                '<li>Sat</li>' +
                                '<li>Sun</li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                    '<div class="calendar-body">' +
                        '<table class="g-date-list none">' +
                        '</table>' +
                        '<table class="l-date-list none">' +
                        '</table>' +
                        '<table class="n-date-list">' +
                        '</table>' +
                    '</div>';

            os.innerHTML += html;
            $self.Parent.appendChild(os);

            $self.table = os;

            $self.DD(NowYear , NowMonth , NowDate);

            // 挂载淡入淡出事件
            $.addEvent($self.oT ,"click", function (ev) {
                if (os.dataset.boff === "true") {
                    $.removeClass(os , "none");
                    os.dataset.boff = false;
                } else if (os.dataset.boff === "false") {
                    $.addClass(os , "none");
                    os.dataset.boff = true;
                }
            });

            var mdL       = $.f( ".m-date-list",os ),
                YYYYtable = $.f( ".g-date-list" , os ),   
                MMtable   = $.f( ".l-date-list" , os ),
                DDtable   = $.f( ".n-date-list" , os ),
                wlW       = $.f( ".week-list-wrap" , os ),
                oMM       = $.f( ".MM",os ),
                oYYYY     = $.f(".YYYY" , os),
                yRange    = $.f(".YYYY-range" , os);
            
            // 左箭头
            $.delegateEvent( os , "a.l-arrow" ,"click" , function (ev) {
                switch (~~mdL.dataset.voff) {
                    case 3:
                        var k = 0;
                        if(~~oMM.dataset.month > 1) {
                            k = ~~oMM.dataset.month - 1;
                        } else {
                            k = 12;                            
                        }
                        var Y = ~~oYYYY.dataset.year;
                        var M = ~~oMM.dataset.month;

                        if (Y === NowYear && M === NowMonth) {
                            break;
                        }

                        oMM.dataset.month = k;
                        oMM.innerHTML = $.digitCn(k)+"月";
                        if (k === NowMonth) {
                            $self.DD( Y,k,NowDate );
                        } else {
                            $self.DD( Y,k );
                        }
                        if (k !== 12) {
                            break;
                        }
                    case 2:
                        var Y = ~~oYYYY.dataset.year - 1;
                        if ( (Y+1) <= NowYear) {
                            break;
                        }

                        oYYYY.dataset.year = Y;
                        oYYYY.innerHTML = Y;

                        if(Y === NowYear) {
                            $self.MM(Y , NowMonth);
                        } else {
                            $self.MM(Y);                            
                        }


                        if (Y > ~~yRange.dataset.syear) {
                            break; 
                        }
                    case 1:
                        var s = ~~yRange.dataset.syear - 10;
                        if( (s + 10) <= sYear ) { // 如果小于当前年
                            break;
                        }
                        var e =  ~~yRange.dataset.eyear - 10;
                        
                        yRange.dataset.syear = s;
                        yRange.dataset.eyear = e;

                        yRange.innerHTML = s+"-"+e;
                        if(s<=NowYear && NowYear<=e) {
                            $self.YYYY(s , e , NowYear);
                        } else {
                            $self.YYYY(s , e);
                        }
                }
            });
            
            // 右箭头
            $.delegateEvent( os , "a.r-arrow" ,"click" , function (ev) {
                switch (~~mdL.dataset.voff) {
                    case 3:
                        if(~~oMM.dataset.month < 12) {
                            oMM.dataset.month = ~~oMM.dataset.month + 1;
                        } else {
                            oMM.dataset.month = 1;                            
                        }

                        var o = ~~oMM.dataset.month;
                        oMM.innerHTML = $.digitCn(o)+"月";
                        
                        $self.DD( ~~oYYYY.dataset.year,o );
                        if (o !== 1) {
                            break;
                        }
                    case 2:
                        var Y = ~~oYYYY.dataset.year + 1;
                        oYYYY.dataset.year = Y;
                        oYYYY.innerHTML = Y;
                        $self.MM(Y);

                        // 如果当前年份并没有超过当前年表最大年份数额 停止，否则继续向下执行
                        if (Y < ~~yRange.dataset.eyear) {
                            break; 
                        }
                    case 1:
                        var s = ~~yRange.dataset.syear + 10;
                        var e =  ~~yRange.dataset.eyear + 10;
                        
                        yRange.dataset.syear = s;
                        yRange.dataset.eyear = e;

                        yRange.innerHTML = s+"-"+e;
                        $self.YYYY(s , e);
                        break;
                }
            });
            

            // 中间时刻
            $.addEvent( mdL , "click" , function (ev) {
                // voff 对应 年表 1 月表 2 日表3 
                if (mdL.dataset.voff === "3") { // 日表切换到月表
                    if (MMtable.innerHTML === "") {
                        $self.MM( ~~oYYYY.dataset.year, NowMonth);
                    }
                    $.addClass(DDtable , "none");
                    $.removeClass(MMtable , "none");
                    $.addClass( wlW , "hidden" );
                    $.addClass( oMM , "none" );
                    mdL.dataset.voff = "2";
                } else if ( mdL.dataset.voff = "2" ) { // 月表切换到年表
                    if (YYYYtable.innerHTML === "") {
                        $self.YYYY(sYear , eYear , NowYear);
                    }
                    $.addClass(oYYYY , "none")
                    $.removeClass(yRange , "none");
                    
                    $.addClass(MMtable , "none");
                    $.removeClass(YYYYtable , "none");

                    mdL.dataset.voff = "1";
                } 
            });
            
            // 年表 点击 切到月表
            $.delegateEvent(os , "td.yuse" , "click" , function (ev , target) {
                $.addClass(yRange , "none");
                $.removeClass(oYYYY , "none");
                $.addClass(YYYYtable , "none");
                $.removeClass(MMtable , "none");

                oYYYY.dataset.year = target.dataset.yyyy;
                oYYYY.innerHTML = oYYYY.dataset.year;
                if (~~target.dataset.yyyy === NowYear) {
                    $self.MM(target.dataset.yyyy , NowMonth);
                } else {
                    $self.MM(target.dataset.yyyy);
                }
                mdL.dataset.voff = "2";
            });


            // 月表 点击 切到日表
            $.delegateEvent(MMtable , "td.muse" , "click" , function (ev , target) {
                $.addClass(MMtable , "none");
                $.removeClass(DDtable , "none");
                $.removeClass( wlW , "hidden" );
                $.removeClass(oMM , "none");
                mdL.dataset.voff = "3";
                oMM.dataset.month = target.dataset.mm;
                oMM.innerHTML = $.digitCn(~~target.dataset.mm) + "月 ";
                var Y = ~~oYYYY.dataset.year;
                // 如果是当前年月, 需要将当前日期传入，将以前的日子筛去
                if (Y === NowYear && NowMonth === ~~target.dataset.mm) {
                    $self.DD(NowYear , NowMonth , NowDate);
                } else {
                    // 未来的日子正常显示
                    $self.DD(Y , target.dataset.mm );
                }
            });

            // 输出日期
            $.delegateEvent(os , "td.use" , "click" , function (ev , target) {
                $self.oT.value = oYYYY.dataset.year+'-'+oMM.dataset.month+'-'+target.innerHTML;
                $.addClass(os , "none");

                $self.callback && $self.callback();
            });
        },
        YYYY : function (s , e , cYear) {
            var $self = this,
                html = '',
                YYYYtable = $.f(".g-date-list" , $self.table);

                html += '<tbody>' +
                            '<tr>'+
                                '<td class="yuseless" data-yyyy="'+(s-1)+'">'+(s-1)+'</td>';

                for (var i = 0; i<10 ; i++ ) {
                    if (cYear && (s+i)<cYear) {
                        html += '<td class="yuseless" data-yyyy="'+(s+i)+'">'+(s+i)+'</td>';                        
                    } else {
                        html += '<td class="yuse" data-yyyy="'+(s+i)+'">'+(s+i)+'</td>';                        
                    }
                    if ((i + 2) % 4 === 0) {
                        html += '</tr>';
                    }
                }

                html += '<td class="yuseless" data-yyyy="'+(e+1)+'">'+(e+1)+'</td>' +
                        '<tr>' +
                        '</tbody>';

                YYYYtable.innerHTML = html;
        },
        MM : function (Year , cMonth) {
            var $self = this,
                html = '',
                MMtable = $.f( ".l-date-list" , $self.table );

                html += '<tbody>';
                for ( var i = 1 ; i<=12 ;i++) {
                    if (i % 4 === 1) {
                        html += '<tr>';
                    }
                    if (cMonth && i < cMonth ) {
                        html += '<td class="museless" data-mm='+i+'>'+$.digitCn(i)+'月</td>';

                    } else {
                        html += '<td class="muse" data-mm='+i+'>'+$.digitCn(i)+'月</td>';
                    }

                    if (i % 4 === 0) {
                        html += '</tr>';
                    }
                }

                html += '</tbody>';
                MMtable.innerHTML = html;
        },
        DD : function ( Year , Month , cDate ) {
            var $self = this,
                html = "",
                DDtable = $.f( ".n-date-list" , this.table ),
                PrevMonthDay     = $self.jugdeDay(Year , Month-1),  // 上一个月有多少天
                currentMonthDay  = $self.jugdeDay(Year , Month),    // 本月有多少天
                FirstDay         = new Date(Year+"-"+Month+"-1").getDay();
              
                (FirstDay === 0) && (FirstDay = 7);                 // 如果是周日改成7
                
                // 表格开头
                html += '<tbody>' +
                            '<tr>';

                var v = 0; // 控制造出了多少表格
                for (var i = PrevMonthDay - (FirstDay - 2); i <= PrevMonthDay; i++ ) {
                    html += '<td class="useless">'+i+'</td>';
                }

                for (var i = FirstDay,e = 1; i <=7 ; i++,e++) {
                    if(cDate && i<cDate) {
                        html += '<td class="useless">'+e+'</td>';
                    } else {
                        if(cDate && cDate === e) {
                            html += '<td class="use focus">'+e+'</td>';

                        } else {
                            html += '<td class="use">'+e+'</td>';
                        }
                    }
                }

                html += '</tr>';
                
                // 本月部分 和 结尾部分 j 控制换行 i 控制 本月日期输出 , t 控制下月日期输出
                for (var i = e , j = 1 , t = 1; i <= 35 + e - 1; i++ , j++) {
                    if (j === 1) {
                        html += '<tr>';
                    } 

                    if (i<=currentMonthDay) {
                        if (cDate && cDate === i) {
                            html += '<td class="use focus">'+i+'</td>';
                        } else if (cDate && i<cDate) {
                            html += '<td class="useless">'+i+'</td>';    
                        } else {
                            html += '<td class="use">'+i+'</td>'
                        }
                    } else {
                        html += '<td class="useless">'+t+'</td>'
                        t++;
                    }
                    
                    if (j === 7) {
                        html += '</tr>';
                        j = 0;
                    }
                }
                
                html += '</tr>' +
                        '</tbody>';

                DDtable.innerHTML = html;
        },
        jugdeDay : function ( year , Month ) {
            if (Month < 0 && Month > 12) {
                throw new Error("月份使用有误");
            } else if (Month === 0) {
                year--;
                Month = 12;
            }

            
            var $self = this;
            if (/^(1|3|5|7|8|10|12)$/.test(Month.toString())) {
                return 31;
            } else if (/^(4|6|9|11)$/.test(Month.toString())) {
                return 30;
            } else {
                if ( $self.isLeapYear(year) ) {
                     return 29;
                } else {
                    return 28;
                }
            }
        },
        isLeapYear : function (Year) {
            if ( (Year % 4 === 0 && Year % 100 !== 0) || Year % 400 === 0  ) {
                return true;
            } else {
                return false;
            }
        }
    }


    return function ( eWrap , ele , callback ) {
        var type = $.ObjectTest(ele);

        if (type === "Array" || type === "NodeList" || type === "HTMLCollection") {
            ele = Array.from(ele);

            ele.forEach(function ( value , idx ,array ) {
                new calendar( eWrap , value , callback);
            }); 
        } else if ( /^HTML\S+Element$/.test(type) ) { // 如果是单个页面元素
            new calendar( eWrap , ele , callback );
        }
    }
})();