							
									/*--------------------------------------------*\
											  	  仿京东金融页js
									   		   	   Finish By Owen
									      Github:http://github.com/bilibiliou
									\*--------------------------------------------*/
/* header */ 
$(function() {
	var oAppJr   = $(".app-jr");
	var oDropBox = $(".dropbox");

	oAppJr.on("mouseover" , function() {
		oDropBox.css("display" , "block");
	});
	oDropBox.on("mouseover" , function() {
		oDropBox.css("display" , "block");
	});

	oAppJr.on("mouseover" , function() {
		oDropBox.css("display" , "none");
	});
	oDropBox.on("mouseout" , function() {
		oDropBox.css("display" , "none");
	});
})

/* nav */ 
$(function (){
	var oSearchWrapInput = $(".search-wrap-input");
	var oSearchResult    = $(".search-result");
	
	oSearchWrapInput.on("focus" , function() {
		$(this).css("border" , "1px solid #FF5256");
		oSearchResult.css("display" , "block");
	});

	oSearchWrapInput.on("blur" , function() {
		$(this).css("border" , "1px solid #E6E6E6");
		oSearchResult.css("display" , "none");
	});

});

/* prime左列表 */
$(function() {
	// 主列表元素
	var oCateM = $(".cate-m");

	// 主列表内容盒子
	var oCateContentList = $(".cate-content-list");
	
	// 主列表 
	var oCateTitleList = $(".cate-title-list");

	// 副列表
	var oCateActList = $(".cate-act-list");

	// 主列表内容
	var oCateMc   = $(".cate-mc");
	
	// 主列表按钮内容
	var oCateMt   = $(".cate-mt");

	var oRedArrow = $(".red-arrow");
	var oTitle    = $(".title-a");
	var CatemMark = $(".cate-m-mark");



	var Index = 0;
	var IndexOut = 0;

	// 切换按钮
	var oCateTabsList = $(".cate-tabs-list ul li");
	oCateTabsList.eq(0).click(function() {
		$(this).css("background" , "#fff url(./images/financial/prime/fore-list-active.png)");
		oCateTabsList.eq(1).css("background" , "#f6f6f6 url(./images/financial/prime/fore-act-list.png)");
		oCateTitleList.css("display" , "block");
		oCateActList.css("display" , "none");
	});

	oCateTabsList.eq(1).click(function() {
		oCateTabsList.eq(0).css("background" , "#f6f6f6 url(./images/financial/prime/fore-list.png)");
		$(this).css("background" , "#fff url(./images/financial/prime/fore-act-list-active.png)");
		oCateTitleList.css("display" , "none");
		oCateActList.css("display" , "block");
	});

	oCateM.hover(function(){
		Index = $(this).index();
		show();
		
	},function(){
		IndexOut = $(this).index();
		hidden();
	});


	oCateContentList.hover(function() {
		show();
	},function() {
		hidden();
	});


	function show() {
		

		oCateContentList.css("display" , "block");
		oCateMc.eq(Index).css("display" , "block");
		CatemMark.eq(Index).css("display" , "block");
		if(Index == 5)
		{
			oCateContentList.css("display" , "none");
			return;
		}

		oTitle.eq(Index).css("color" , "#FF5256");
		oCateMt.eq(Index).css("transform" , "translateX(15px)");
		oRedArrow.eq(Index).css("display" , "block");
		
	}

	function hidden() {
		
		
		oCateContentList.css("display" , "none");
		oCateMc.css("display" , "none");
		CatemMark.eq(Index).css("display" , "none");
		if(IndexOut == 5)
		{
			return;
		}
		oCateMt.eq(IndexOut).css("transform" , "translateX(0px)");
		oRedArrow.eq(IndexOut).css("display" , "none");
		oTitle.css("color" , "#323232");
	}
});

/* 焦点图背景 + 轮播切换 + 右侧小轮播 */
$(function() {

	// 背景
	var oPsBgItem   = $(".ps-bg-item");
	var iNow        = 0;  // 总焦点位置
	var timer       = null
	var oURL        = ["./images/financial/prime/56619f1dNe36c259b.jpg","./images/financial/prime/56619f62Ncbb4bc5d.jpg","./images/financial/prime/56619fe2N74763033.jpg",
	"./images/financial/prime/565b9f94N0491ddce.jpg"];

	// 焦点内容
	var oPsItem     = $(".ps-item");

	// 焦点内容的各个模块
	var oPuzzleItem = $(".puzzle-item");

	// 选项卡
	var oPsTrigger    = $(".ps-trigger");
	var oTriggerItem  = $(".trigger-item");
	var oEm           = $(".trigger-item em");
	
	// 右小图轮播
	var PGiNow = 0;    // 轮播图位置
	var PG     = 0;    // 当前轮播图
	var oPuzzleGoodsBodyShow = $(".puzzle-goods-body-show");
	var oPuzzleGoodsBodyShowLis = $(".puzzle-goods-body-show li");
	var oPuzzleGoodsBody     = $(".puzzle-goods-body");
	var oArrows = oPuzzleGoodsBody.eq(PG).find(".puzzle-goods-body-show-arrow");
	
	oPsBgItem.each(function(i , value) {
		oPsBgItem.eq(i).css("background" , "url("+ oURL[i] +")");
	})

		
	timer = setInterval(BgFlash,2000);

	oPuzzleItem.hover(function() {
		clearInterval(timer);
	},function() {
		timer = setInterval(BgFlash,2000);
	});

	oPuzzleGoodsBodyShow.each(function(i , value) {
		var aPuzzleGoodsBodyShowLis = oPuzzleGoodsBodyShow.eq(i).find("li");
		oPuzzleGoodsBodyShow.eq(i).css("width" , aPuzzleGoodsBodyShowLis.length * 200);
	});

	Arrowsclick();

	oTriggerItem.on("click" , function() {
		oEm.removeClass("trigger-item-active");
		var Index = $(this).index();
		oEm.eq(Index).addClass("trigger-item-active");

		iNow = Index;

		if(iNow == 0)
		{
			PG = 0;
			oArrows = oPuzzleGoodsBody.eq(PG).find(".puzzle-goods-body-show-arrow");
			PGiNow = 0;
			Arrowsclick();
		}else if( iNow == 2 )
		{
			PG =1;
			oArrows = oPuzzleGoodsBody.eq(PG).find(".puzzle-goods-body-show-arrow");
			PGiNow = 0;
			Arrowsclick();
		}
		change();
		primeChange();
		oEm.removeClass("trigger-item-active");
		oEm.eq(iNow).addClass("trigger-item-active");
		return false;
	});

	function BgFlash() {
		if( iNow == oPsBgItem.length - 1){
			iNow = 0;
		}else {
			iNow ++;
		}
		change();
		primeChange();
		oEm.removeClass("trigger-item-active");
		oEm.eq(iNow).addClass("trigger-item-active");
	}

	function change() {
		oPsBgItem.css("opacity" , "0");
		oPsBgItem.css("z-index" , "0");
		oPsBgItem.eq(iNow).css("opacity" , "1");
		oPsBgItem.eq(iNow).css("z-index" , "1");
	}
	function primeChange() {
		oPsItem.css("z-index" , 4);
		oPsItem.eq(iNow).css("opacity" , "0");
		oPsBgItem.eq(iNow).css("marginLeft" , "-440");
		oPsItem.eq(iNow).css("z-index" , 5);
		oPsItem.eq(iNow).css("opacity" , "1");
		oPsBgItem.eq(iNow).css("marginLeft" , "0");
	}





	function Arrowsclick() {
		oArrows.off("click");

		oArrows.eq(0).on("click" , function() {
			if( PGiNow == 0 ){
				PGiNow = oPuzzleGoodsBodyShow.eq(PG).find("li").length - 1;
			}else {
				PGiNow--;
			}
			oPuzzleGoodsBodyShow.eq(PG).css("marginLeft" , PGiNow*(-200)+"px");
		});

		oArrows.eq(1).on("click" , function() {
			if( PGiNow == oPuzzleGoodsBodyShow.eq(PG).find("li").length - 1 )
			{
				PGiNow = 0;
			}else {
				PGiNow++;
			}
			oPuzzleGoodsBodyShow.eq(PG).css("marginLeft" , PGiNow*(-200)+"px");
		});
	}
});

/* fixed 按钮组 */ 
$(function() {
	var oUISidebar = $(".UI-sidebar");
	var oSidebarElements = $(".sidebar-elements");
	var oPhoneBarCode    = $(".phone-bar-code");

	var BgX = [ -168 , 0 , -42 ];

	for(var i = 0 ; i<BgX.length ; i++)
	{
		oSidebarElements.eq(i).css("backgroundPosition" , BgX[i] + "px 0px")	
	}

	oSidebarElements.hover(function() {
		var Index = $(this).index();
		oSidebarElements.eq(Index - 1).css("backgroundPosition" , BgX[Index - 1] + "px -40px");
	}, function() {
		var Index = $(this).index();

		oSidebarElements.eq(Index - 1).css("backgroundPosition" , BgX[Index - 1] + "px 0px");
	});

	$(document).on("scroll" , function() {
		if( $(document).scrollTop() >= 530 )
		{
			oSidebarElements.eq(2).css("display" , "block");
		}

		if( $(document).scrollTop() <= 530 )
		{
			oSidebarElements.eq(2).css("display" , "none");
		}
	});

	oSidebarElements.eq(2).on("click" , function() {
		$(document).scrollTop(0);
	});

	oSidebarElements.eq(0).hover(function() {
		oPhoneBarCode.css("visibility" , "visible");
		oPhoneBarCode.css("opacity" , "1");
		oPhoneBarCode.css("left" , "-136px");
	} , function() {
		oPhoneBarCode.css("visibility" , "hidden");
		oPhoneBarCode.css("opacity" , "0");
		oPhoneBarCode.css("left" , "-148px");
	});
	
});


/* 滚动上nav */
$(function() {
	var oScrollNav = $(".scroll-nav");
	$(document).on("scroll" , function() {
		if( $(document).scrollTop() >= 218 )
		{
			oScrollNav.addClass("hn-fix");
		}

		if( $(document).scrollTop() <= 218 )
		{
			oScrollNav.removeClass("hn-fix");
		}
	});
});

/* bankList */
$(function() {
	var oCoopBtnPrev = $(".coop-btn-prev");
	var oCoopBtnNext = $(".coop-btn-next");
	var oUiSwitchableItem = $(".ui-switchable-item");
	var oCoopListUl = $(".coop-list-ul");
	var moveWidth = oUiSwitchableItem.outerWidth() + 60;

	var iNow = 0;

	var moveNum = (oCoopListUl.outerWidth() - 7 * 180) / 180;
	
	oCoopBtnPrev.on("click" , function() {

		if( iNow == 0 )
		{
			iNow = moveNum;
		}else{
			iNow--;
		}
		oCoopListUl.css("marginLeft" , iNow*(-moveWidth));
		return false;
	});

	oCoopBtnNext.on("click" , function() {
		if( iNow == moveNum )
		{
			iNow = 0;
		}else{
			iNow++;
		}
		oCoopListUl.css("marginLeft" , iNow*(-moveWidth));
		return false;
	});
});

/* content */
$(function() {

	/* 一楼 */ 
	var oFsTabsLis1 = $(".floor-1 .fs-tabs li");
	var ofcInner1   = $(".floor-content-1 .fc-inner");
	var oFsTabsLisA1  = $(".floor-1 .fs-tabs li a");
	oFsTabsLisA1.eq(0).css("color" , "#ff5256");
	oFsTabsLisA1.eq(0).css("background" , "#fff");
	oFsTabsLis1.on("mouseover" , function() {
		oFsTabsLisA1.css("color" , "#fff");
		oFsTabsLisA1.css("background" , "rgba(255,255,255,0.0980392)");
		ofcInner1.css("display" , "none");
		var Index = $(this).index();
		oFsTabsLisA1.eq(Index).css("color" , "#ff5256");
		oFsTabsLisA1.eq(Index).css("background" , "#fff");
		ofcInner1.eq(Index).css("display" , "block");
	});

	/* 二楼 */
	var oFsTabsLis2 = $(".floor-2 .fs-tabs li");
	var ofcInner2   = $(".floor-content-2 .fc-inner");
	var oFsTabsLisA2  = $(".floor-2 .fs-tabs li a");
	oFsTabsLisA2.eq(0).css("color" , "#6CE2EE");
	oFsTabsLisA2.eq(0).css("background" , "#fff");
	oFsTabsLis2.on("mouseover" , function() {
		oFsTabsLisA2.css("color" , "#fff");
		oFsTabsLisA2.css("background" , "rgba(255,255,255,0.0980392)");
		ofcInner2.css("display" , "none");
		var Index = $(this).index();
		oFsTabsLisA2.eq(Index).css("color" , "#6CE2EE");
		oFsTabsLisA2.eq(Index).css("background" , "#fff");
		ofcInner2.eq(Index).css("display" , "block");
	});

	/* 三楼 */
	var oFsTabsLis3 = $(".floor-3 .fs-tabs li");
	var ofcInner3   = $(".floor-content-3 .fc-inner");
	var oFsTabsLisA3  = $(".floor-3 .fs-tabs li a");
	oFsTabsLisA3.eq(0).css("color" , "#9362DE");
	oFsTabsLisA3.eq(0).css("background" , "#fff");
	oFsTabsLis3.on("mouseover" , function() {
		oFsTabsLisA3.css("color" , "#fff");
		oFsTabsLisA3.css("background" , "rgba(255,255,255,0.0980392)");
		ofcInner3.css("display" , "none");
		var Index = $(this).index();
		oFsTabsLisA3.eq(Index).css("color" , "#9362DE");
		oFsTabsLisA3.eq(Index).css("background" , "#fff");
		ofcInner3.eq(Index).css("display" , "block");
	});

	/* 四楼 */
	var oFsTabsLis4 = $(".floor-4 .fs-tabs li");
	var ofcInner4   = $(".floor-content-4 .fc-inner");
	var oFsTabsLisA4  = $(".floor-4 .fs-tabs li a");
	oFsTabsLisA4.eq(0).css("color" , "#FCCD68");
	oFsTabsLisA4.eq(0).css("background" , "#fff");
	oFsTabsLis4.on("mouseover" , function() {
		oFsTabsLisA4.css("color" , "#fff");
		oFsTabsLisA4.css("background" , "rgba(255,255,255,0.0980392)");
		ofcInner4.css("display" , "none");
		var Index = $(this).index();
		oFsTabsLisA4.eq(Index).css("color" , "#FCCD68");
		oFsTabsLisA4.eq(Index).css("background" , "#fff");
		ofcInner4.eq(Index).css("display" , "block");
	});

	/* 五楼 */ 
	var oFsTabsLis5 = $(".floor-5 .fs-tabs li");
	var ofcInner5   = $(".floor-content-5 .fc-inner");
	var oFsTabsLisA5  = $(".floor-5 .fs-tabs li a");
	oFsTabsLisA5.eq(0).css("color" , " #A0E67B");
	oFsTabsLisA5.eq(0).css("background" , "#fff");
	oFsTabsLis5.on("mouseover" , function() {
		oFsTabsLisA5.css("color" , "#fff");
		oFsTabsLisA5.css("background" , "rgba(255,255,255,0.0980392)");
		ofcInner5.css("display" , "none");
		var Index = $(this).index();
		oFsTabsLisA5.eq(Index).css("color" , " #A0E67B");
		oFsTabsLisA5.eq(Index).css("background" , "#fff");
		ofcInner5.eq(Index).css("display" , "block");
	});

	/* 六楼 */
	var oFsTabsLisA6  = $(".floor-6 .fs-tabs li a");
	oFsTabsLisA6.eq(0).css("color" , "#5EC6FB");
	oFsTabsLisA6.eq(0).css("background" , "#fff"); 
}); 