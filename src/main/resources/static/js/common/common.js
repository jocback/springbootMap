var common = {
	/***************************************************************************
	 * @ description : AJAX 호출.
	 * @ usage : common.ajax({ url : "requestURL"  , data  : "Parameter" , success : function( json ){ }});
	 **************************************************************************/
	ajax : function (url,data,fnSuccess){
		$.ajax({
			url : url,
			type : "post",
			dataType: "json",
			data:data,
			success:fnSuccess
		});
	},

	/***************************************************************************
	 * @ description : 데이터값 Null 또는 빈값일 경우 "" 로 리턴.
	 * @ param : str : 체크할 데이터
	 * @ usage : common.toStr("onlyNum");
	 **************************************************************************/
	toStr : function(str) {
		if (str == undefined) {
			return "";
		}
		return str;
	},

	/***************************************************************************
	 * @ description : 데이터값 Null 또는 빈값일 경우 "-" 로 리턴.
	 * @ param : str : 체크할 데이터
	 * @ usage : common.toHypen("onlyNum");
	 **************************************************************************/
	toHypen : function(str) {
		if (str == undefined) {
			return "-";
		}
		return str;
	},

	/***************************************************************************
	 * @ description : 돈단위 체크
	 * @ param : str : 체크할 데이터
	 * @ usage : common.numberWithCommas("onlyNum");
	 **************************************************************************/
	numberWithCommas : function(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},

	/***************************************************************************
	 * @ description : 유효성 검사
	 * @ param : target : 체크할 대상
	 * @ param : message : 알림창 메세지
	 * @ usage : common.validate($('#content').val(), "내용을 입력하여 주십시오.");
	 **************************************************************************/
	validate : function( target, message ){
		var result = false;
		if( target == '' ) {
			alert( message );
			result = true ;
		}

		return result;
	},

    // req05 edit by hodec
    // 공통 공백 체크로직 추가
    /***************************************************************************
     * @ description : 공백 객체 체크
     * @ param : obj : 체크할 대상
     * @ usage : common.isEmpty({});
     **************************************************************************/

    isEmpty : function( obj ) {
        if (obj === null || obj === undefined)
            return true
        if (obj instanceof Array) {
            return obj.length === 0
        }
        return Object.keys(obj).length === 0
    }
    // 끝
}


$(document).ready(function() {

  var header = $('head');

  $(window).scroll(function(e) {
    if (header.offset().top >= 10) {
      if (!header.hasClass('shadow')) {
        header.addClass('shadow');
      }
    } else {
      header.removeClass('shadow');
    }
  });

  $(".m-header").click(function() {
    $(".nav").toggle();
    $(".depth1-2").removeClass("on");
    $(".depth2").css({"display": "none"});
    $(this).toggleClass("open");
  });

  $(".depth1-2").click(function() {
    $(this).toggleClass("on").children("ul").slideToggle(200).siblings("depth2").slideUp(100);
  });

  $(".menu01, .submenu01").hover(function() {
    $(".menu01, .submenu01").addClass("on");
  }, function() {
    $(".menu01, .submenu01").removeClass("on");
  });

  $(".menu02, .submenu02").hover(function() {
    $(".menu02, .submenu02").addClass("on");
  }, function() {
    $(".menu02, .submenu02").removeClass("on");
  });

  $(".menu03, .submenu03").hover(function() {
    $(".menu03, .submenu03").addClass("on");
  }, function() {
    $(".menu03, .submenu03").removeClass("on");
  });

  $(".menu04, .submenu04").hover(function() {
    $(".menu04, .submenu04").addClass("on");
  }, function() {
    $(".menu04, .submenu04").removeClass("on");
  });

  $(window).resize(function() {
    // width값을 가져오기
    var width_size = window.outerWidth;
    // 770 이상일때 nav 숨김
    if (width_size >= 1025) {
      $(".nav").css({display: "none"});
      $(".m-header").removeClass("open");

    }
  })

  /* 사이드바 닫기 */
  $('.fa-bars-arrow, .list-result-area>ul>li, .tab-button').click(function() {
      if ($('#list_panel_content').is(":visible") === true) {
        $('#list_panel_content').hide();
        $("#main-content").addClass("list_panel_content-closed");
        $(".fa-bars-arrow img").attr("src", "images/toggle_right_panel_btn.png");
        $(".tab-button").css({"background-image": "url(images/btn_tab_open.png)"});
        setCookie('searchType', 'N', 30);
      } else {
        $("#main-content").removeClass("list_panel_content-closed");
        $('#list_panel_content').show();
        $(".fa-bars-arrow img").attr("src", "images/toggle_left_panel_btn.png");        $(".tab-button").css({"background-image": "url(images/btn_tab_close.png)"});
        setCookie('searchType', 'Y', 30);
      }
    });

  /* 다른 아이템 클릭 시 열려있는 팝업 닫기 */
  $('.list-result-area>ul>li').click(function(){
    $('.popup').css({"display":"none"});
  });



  $('[data-popup-open]').on('click', function(e) {
    var targeted_popup_class = jQuery(this).attr('data-popup-open');
    $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

    e.preventDefault();
  });

  //----- CLOSE
  $('[data-popup-close]').on('click', function(e) {
    var targeted_popup_class = jQuery(this).attr('data-popup-close');
    $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

    e.preventDefault();
  });

});


// 쿠키 생성
function setCookie(cName, cValue, cDay){
	 var expire = new Date();
	 expire.setDate(expire.getDate() + cDay);
	 cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
	 if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
	 document.cookie = cookies;
}

// 쿠키 가져오기
function getCookie(cName) {
	 cName = cName + '=';
	 var cookieData = document.cookie;
	 var start = cookieData.indexOf(cName);
	 var cValue = '';
	 if(start != -1){
		 start += cName.length;
		 var end = cookieData.indexOf(';', start);
		 if(end == -1)end = cookieData.length;
		 cValue = cookieData.substring(start, end);
	 }
	 return unescape(cValue);
}