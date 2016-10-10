var Frame = {};
var Utils = {};

$.MyLocale = {};

function getPageWidth()
{
    return $("body").width();
}

/*****************************************************************************
@FuncName, Class, menuBar
@DateCreated: 2013-06-08
@Author: 
@Description: process menu
@Usage:
@ParaIn:
@Return: 
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
function MenuBar()
{
    this.initMenu = initMenu;
	this.resizeMenu = resize;

    var resizeCount = 0;
    var oTimer  = null;

    function onMenuClick(e)
    {
        var jSubMenu = $(this).next();

        // menuitem
        if (false == jSubMenu.hasClass("sub-menu"))
        {
           $('#side_menu .page-sidebar-menu li').removeClass("active")
           $(this).parent().addClass('active');
            return;
        }

        // submenu
        var jParent = $(this).parent().parent();
        if (jSubMenu.is(":visible")) 
        {
            jSubMenu.hide();
        }
        else
        {
            jSubMenu.show();
        }
        return false;
    }

    function onFlowMenu(e)
    {
        var jContent = $('#side_menu');
        var jMenu = $('.page-sidebar-menu',jContent);
        var nTop = jMenu.css('marginTop').replace('px',"")*1;
        var bIsUp = $(this).hasClass('down');
        var nGap = jContent.height()-jMenu.height();

        nGap = nGap > 0 ? 0 : nGap;
        bIsUp ? (nTop -= 78*2) : (nTop += 78*2);
        nTop  = nTop > 0 ? 0 : (nTop < nGap ? nGap : nTop);

        jMenu.animate({marginTop:nTop+'px'},200);
    }

    function resize()
    {
        var jContent = $('#side_menu');
        var jMenu = $('.page-sidebar-menu',jContent);

        if(jMenu.children('li').css("marginBottom") != '40px' && resizeCount < 10)
        {
            oTimer && clearTimeout(this.oTimer);
            oTimer = setTimeout(resize,200);
            resizeCount ++;
            return false;
        }
        resizeCount = 0;

        if(jMenu.height() < jContent.height())
        {
            $('.menu-ctrl').fadeOut(100);
            jContent.css({bottom:0});
            jMenu.animate({marginTop:0+'px'},200);
        }
        else
        {
            $('.menu-ctrl').fadeIn(100);
            jContent.css({bottom:'12px'});
        }
    }

	function initMenu()
	{
        // add events
        $('#side_menu .page-sidebar-menu')
            .on('click', 'li > a', onMenuClick);
        $('.menu-ctrl').off('click.menuCtrl').on('click.menuCtrl',onFlowMenu);
    }
}

var Tablet = {
    resize: function()
    {
        //summary view
        var jPageCont = $("#tabContent");
        //echart
        $(".myEchart", jPageCont).each(function(index,item){
            var jEle = $(this);
            if(jEle.is(":visible"))
            {
                jEle = $(this).data("instance");
                jEle && jEle.chart && jEle.resize();
            }
        });

    },
    init: function (bOpened)
    {
        
    },
    openNewPage: function()
    {
        
    },
    closeNewPage: function()
    {
        
    },
    onBodyClick: function(e)
    {

    }
}

var DeskPC = {
    resize: function()
    {
        var nScreenWidth = getPageWidth();
        var w = 200;
        $("#menu_div").width(w);
        var w2 = (nScreenWidth - w)/2;
        $("#edit_div").width(w2);
        $("#summary_div").width(w2);
    },
    init: function ()
    {
        $("#menu_div").show();
        $("#summary_div").show();
        $("#edit_div").show();

        MyConfig.MList.selectMode = "pc";
    },
    openNewPage: function()
    {
        $("#edit_div").show();
    },
    closeNewPage: function()
    {
        $("#edit_div").hide();
    },
    onBodyClick: function(e)
    {
        
    }
}


/*****************************************************************************
@FuncName, Class, MainFrame
@DateCreated: 2013-06-08
@Author: 
@Description: process main MainFrame
@Usage:
@ParaIn:
@Return: 
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
function MainFrame()
{

	var _oMenuBar = new MenuBar();
    var _oCurDevice = false;
    var _bOpened = false;

    function onNewPageOpen()
    {
        _bOpened = true;
        _oCurDevice.openNewPage();
    }

    function onNewPageClose()
    {
        _bOpened = false;
        _oCurDevice.closeNewPage();
    }

    function onNewPageResize()
    {
        _oCurDevice.resize();
    }

    function onBodyClick(e)
    {
        _oCurDevice.onBodyClick(e);
    }

    function onMenuReady()
    {
       _oMenuBar.initMenu();
    }

    function onMenuResize()
    {
        _oMenuBar.resizeMenu();
    }

    function getDeviceByWidth()
    {
        var oDevice;
        var nScreenWidth = getPageWidth();
        oDevice = Tablet; //DeskPC;
        if(_oCurDevice != oDevice)
        {
            _oCurDevice = oDevice;
        }

        return oDevice;
    }

    function doResize()
    {
        getDeviceByWidth();
        _oCurDevice.resize($(window).height());
        Frame.notify("all", "resize");
    }

    function initResize()
    {
        var oTimer;
        var oScrn = document.documentElement;
        var oOldScrn = {"width": oScrn.clientWidth, "height": oScrn.clientHeight};

        $(window).resize(function() 
        {
            if((oOldScrn.height == oScrn.clientHeight) && (oOldScrn.width == oScrn.clientWidth))
            {
                return;
            }

            oOldScrn = {"width": oScrn.clientWidth, "height": oScrn.clientHeight};

            if (oTimer) 
            {
                clearTimeout(oTimer);
            }
            oTimer = setTimeout(function() {doResize();}, 200);
        });
    }

    function initFrameCenter()
    {
        var _jFrame = $('.page-sidebar-fixed ');
        var bIsIE8 = isIE8Browser();
        if(bIsIE8)
        {
            _jFrame.addClass("ie8");
        }

        function isIE8Browser()
        {
            var bIE8 = false;
            if($.browser.msie && (parseInt($.browser.version) == 8))
            {
                bIE8 = true;
            }
            return bIE8;
        }    
    }

    Frame.regNotify("newPage", "open", onNewPageOpen);
    Frame.regNotify("newPage", "close", onNewPageClose);
    Frame.regNotify("newPage", "resize", onNewPageResize);
    Frame.regNotify("menu", "resize", onMenuResize);

    $("body").addClass("page-header-fixed page-sidebar-fixed page-footer-fixed");
    //$(".header").removeClass("navbar-static-top").addClass("navbar-fixed-top");

    initFrameCenter();
    initResize();
    doResize();

    $("body").on("click", onBodyClick);

    function checkModuleCookie(){
        var menuCookieArr = [];
        $.each( $(".xb-layout-north ul li a"),function(i,v){
             menuCookieArr.push($(this).attr("data-value"));
        });

        if($.inArray($.cookie("current_menu"),menuCookieArr) == -1){
            $.cookie("current_menu","")
        }
    }
    //jiaoyan cookie pipeibuyizhi（delete cookie）
    checkModuleCookie();

    $(".xb-layout-north ul").delegate("li","click",function(){ 
        var dvalue = $(this).children("a").attr("data-value");
        if((FrameInfo.Model == 999)&&(dvalue == "manage")){
            window.location="/v3";
            return ;
        }
        
        window.location.hash="#";
        $(this).siblings().children("a").removeAttr("class")
        $(this).children("a").addClass("active")
        $("#dirText").text($(this).children("a").text());
        $.cookie("current_menu",dvalue);
        createMenu($("#side_menu"), $("#frame_tablist"), $("#frame_nav"), onMenuReady,dvalue);
    });
    if($.cookie("current_menu")){
        $(".xb-layout-north ul li a[data-value="+$.cookie("current_menu")+"]").addClass("active");
        var cokText = $(".xb-layout-north ul li a[data-value="+$.cookie("current_menu")+"]").text();
        $("#dirText").text(cokText);
        createMenu($("#side_menu"), $("#frame_tablist"), $("#frame_nav"), onMenuReady,$.cookie("current_menu"));
        
    }else{
        var firstVale;
        if(FrameInfo.Model == 999){
            firstVale=$(".xb-layout-north ul li:nth-child("+(4-FrameInfo.MenuIndex)+")").children("a").attr("data-value");
        }else{
            firstVale=$(".xb-layout-north ul li:last-child").children("a").attr("data-value");
        }
        
        $.cookie("current_menu",firstVale);
        
        window.location.hash="#";//初始化问题（cookie丢失）hash值不对

        $(".xb-layout-north ul li a:not([data-value='"+firstVale+"'])").removeAttr("class");;

        $(".xb-layout-north ul li a[data-value='"+firstVale+"']").addClass("active");

        createMenu($("#side_menu"), $("#frame_tablist"),$("#frame_nav"), onMenuReady,firstVale);
    }
    Frame.init();
}


var g_oMainFrame;
var local  = false;

/*****************************************************************************
@FuncName, private, documentReady
@DateCreated: 2013-06-08
@Author: 
@Description: main entry
@Usage:
@ParaIn:
@Return: 
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/

jQuery(document).ready(function() 
{
    g_oMainFrame = new MainFrame();
    /*
    if(!window.location.search||window.location.search.indexOf("model=")<=0){
        window.location="/v3";
        return false
    };
    
    var searchData  = window.location.search.split("&");
    var curModel = searchData[0].split("model=")[1];
    if (curModel == 999){
        if(!window.location.search||window.location.search.indexOf("menu=")<=0){
            window.location="/v3";
            return false
        };
        
        FrameInfo.Model = curModel;
        FrameInfo.MenuIndex =  searchData[1].split("menu=")[1];
        
    }else{
        
        if(!window.location.search||window.location.search.indexOf("sn=")<=0){
            window.location="/v3";
            return false
        };

        if(!window.location.search||window.location.search.indexOf("nasid=")<=0){
            window.location="/v3";
            return false
        };
        
        FrameInfo.Model =  curModel;
        FrameInfo.ACSN =  searchData[1].split("sn=")[1];
        FrameInfo.Nasid =   searchData[2].split("nasid=")[1];
    
    }
    function checkDevUser(params){
        return $.ajax({
            url: MyConfig.path+"/scenarioserver",
            type: "POST",
            headers:{Accept:"application/json"},
            contentType: "application/json",
            data: JSON.stringify({
                "Method":"checkDevUser",
                "param" :{
                    "userName":params.userName,
                    "devSN":params.devSn
                }
            }),
            dataType: "json"});
    };

    $.get("/v3/web/cas_session?refresh="+Math.random(),function(data){
        FrameInfo.g_user= data;
        if(data.attributes&&data.attributes.name.toLocaleLowerCase()=="demovistor"){
            $("#username").text("访客");
        }else {
            $("#username").text(data.user);
        }
        //jiaoyan devsn shebeiyuliehao shifu yuyonghu xingxi xiang fuhe
        if(data.attributes.name.toLowerCase() != "super"){
            if (FrameInfo.Model != 999){
                checkDevUser({userName:data.attributes.name,devSn:FrameInfo.ACSN})
                    .done(function(checkData){

                        if(checkData.retCode == "0"){
                            g_oMainFrame = new MainFrame();
                        }else{

                            window.location="/v3";
                            return false
                        }
                    }).fail(function(err){

                        window.location="/v3";
                        return false
                    })
            }else{
                g_oMainFrame = new MainFrame();
            }   

        }else{
            $("#station").hide();
            $(".change_station").hide();
            g_oMainFrame = new MainFrame();
        }

    });
    */
});

