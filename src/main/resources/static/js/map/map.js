var map;
var clusterer;
var allInfo = {
	display: false,
	markerList: [],
	infoWindow: []
};

var add_marker_text= [];

var markerImageSrc = "/images/category.png"; // 마커이미지의 주소입니다. 스프라이트 이미지 입니다
var customOverlay = null;
//req03
var customLbOverlayArr = [];
var markerLabel;

var createEvent = false;
var removeEvent = false;

var mapType = "all";
var dataItem;

var creFileCnt = 1;
var modyFileCnt = 1;

// 신규변수

//물건 등록시 주소 가져오 20190928 req01
// 주소-좌표 변환 객체를 생성합니다
var geocoder = new daum.maps.services.Geocoder();
// 상세보기 관련 소스
var searchDataArr = new Array();
// 이미지 시퀀
var imgSeq='';

var imgUrl = '/imgFolder/';

var filter = "win16|win32|win64|mac|macintel";
var platform = "";
if(navigator.platform){
	if(0 > filter.indexOf(navigator.platform.toLowerCase())){
		platform = "mobile";
	}else{
		platform = "pc";
	}
}

var service = {
	// [] 최초 실행 함수
	onLoadEvent: function() {
		var mapContainer = document.getElementById("map"), // 지도를 표시할 div
			mapOption = {
				center: new daum.maps.LatLng(37.503043, 126.775960), // 지도의 중심좌표
				level: 5, // 지도의 확대 레벨
				disableDoubleClickZoom: true
			};

		map = new daum.maps.Map(mapContainer, mapOption);

		daum.maps.event.addListener(map, 'zoom_changed', function() {
			service.changeMarker($(".menu_selected").attr("type"));
		});
		daum.maps.event.addListener(map, "dragend", function() {
			service.changeMarker($(".menu_selected").attr("type"));
		});

//    daum.maps.event.addListener(map, "zoom_changed", function() {
//    });

		// 마커 클러스터러를 생성합니다
		clusterer = new daum.maps.MarkerClusterer({
			map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
			averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
			minLevel: 8 // 클러스터 할 최소 지도 레벨
		});

		service.changeMarker('all');
	},
	// 마커 수정
	// req05 edit by hodec option 추가
	//  changeMarker: function(type){
	changeMarker: function(type, options){
		service.closeOverlay();
		//타입설정
		mapType = type;

		// 20191006 투자 구옥 추가 hodec
		// var allMenu = document.getElementById('allMenu');
		// var newMenu = document.getElementById('newMenu');
		// var oldMenu = document.getElementById('oldMenu');
		// var rentalMenu = document.getElementById('rentalMenu');

		var searchInput = $("#searchInput").val();
		var searchtypeList=[];
		$('input:checkbox[name=roomType]').each(function() {
			if($(this).is(':checked'))
				searchtypeList.push($(this).val());
		});


		// 검색 데이터 셋팅
		var searchData = {
			searchType: mapType,
			searchInput: searchInput,
			searchtypeList: searchtypeList
		}

		// 카테고리가 클릭됐을 때
		$("#category").find('li').each(function(index) {
			if($(this).attr("type") === type) {
				$(this).addClass("menu_selected")
			} else {
				$(this).removeClass("menu_selected")
			}
		});
		// 20191006 투자 구옥 추가 hodec 끝

		// 데이터 불러오기

		// req05 edit by hodec option 추가
		// service.getProductList(searchData);
		service.getProductList(searchData, options);

	},


	// 다음스타일
	createMarkerImage: function(src, size, options) {
		var markerImage = new daum.maps.MarkerImage(src, size, options);
		return markerImage;
	},
	// 다음스타일
	// 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
	createMarker: function(position, image,title) {
		var marker = new daum.maps.Marker({
			position: position,
			image: image,
			title:title
		});

		return marker;
	},

	// 다음스타일
	createInfoWindow: function(content, marker) {
		var overlay = new daum.maps.CustomOverlay({
			content: content,
			map: map,
			position: marker.getPosition()
		});
	},

	// 다음 스타일
	// 전체보기
	setAllMarkers: function(map) {
		for (var i = 0; i < allInfo.markerList.length; i++) {
			allInfo.markerList[i].setMap(map);
		}
	},


	closeOverlay: function() {
		if (!!customOverlay) {
			customOverlay.setMap(null);
		}

	},

	closeInfoWindow: function() {


		for (var i = 0; i < allInfo.infoWindow.length; i++) {
			allInfo.infoWindow[i].close();
		}

	},

	marker_text : function(){
		add_marker_text=[];
		$('area').each(function(i , e){

			if( add_marker_text.indexOf($(this).attr('title')) == -1 ) { //add_marker_text 배열에 존재하지 않을때만
				var node_position = $(this).parent().parent();
				var title = $(this).attr('title');
				//$(this).attr('title',''); //반복생성을 막기위해 title 비우기
				add_marker_text.push($(this).attr('title')); //이미 html을 부여받은 마커는 배열에 추가 add_marker_text

				var inner_html = '<div style="position: relative; margin-left: -32%;    margin-top: -18px;display: table;z-index: 1;border-spacing: 0px;") ">';
				inner_html +='<div style="display: table-cell; vertical-align: middle; white-space: nowrap; text-align: center;">';
				inner_html +='<div style="color: rgb(0, 0, 0); font-size: 14px; font-family: Roboto, Arial, sans-serif;">'+title+'</div></div></div>';
				node_position.append(inner_html);
			}
		});

	},


	//============================================

	// 물건 정보 전체 가져오기
	getProductList: function(searchData, options) {

		searchData.lat1 = null;
		searchData.lat2 = null;
		searchData.lng1 = null;
		searchData.lng2 = null;

		// req05 edit by hodec option 추가
//		if(options==undefined || options.area==undefined || options.area === 'LOCAL'){
		if (common.isEmpty(options)|| common.isEmpty(options.area) || options.area === 'LOCAL') {
			// 지도의 현재 영역을 얻어옵니다
			var bounds = map.getBounds();
			// 영역의 남서쪽 좌표를 얻어옵니다
			var swLatLng = bounds.getSouthWest();
			// 영역의 북동쪽 좌표를 얻어옵니다
			var neLatLng = bounds.getNorthEast();
			// 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다
			var boundsStr = bounds.toString();

			searchData.lat1 = swLatLng.getLat()+'';
			searchData.lat2 = neLatLng.getLat()+'';
			searchData.lng1 = swLatLng.getLng()+'';
			searchData.lng2 = neLatLng.getLng()+'';
		}
		common.ajax("/map/productList",searchData,service.setAllMarker);
	},
	// 물건 정보 전체 리스트 가져오기
//  getProductSearchList: function(searchData) {
//    common.ajax(ctx+"/map/getProductList.do",searchData,service.setAllSearch);
//  },
	setImageOptions:function(icon) {
		var imageOptions;
		switch (icon) {
			case "invest":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 210),
					spriteSize: new daum.maps.Size(36, 590)
				};

				break;
			case "old":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 72),
					spriteSize: new daum.maps.Size(36, 590)
				};

				break;
			case "rental":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 36),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "month":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 560),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "1_t":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 177),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "1_5_t":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 246),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "2_t":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 318),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "3_t":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 390),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "4_t":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 459),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "duplex":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 491),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "4":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 423),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "3":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 354),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "2":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 282),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "1_5":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 210),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			case "1":
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 141),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
			default:
				imageOptions = {
					spriteOrigin: new daum.maps.Point(10, 141),
					spriteSize: new daum.maps.Size(36, 590)
				};
				break;
		}
		return imageOptions;

	},
	// 물건 정보 전체 마커 생성
	setAllMarker: function(data) {

		searchDataArr = data;
		service.setAllSearch(data);
		service.setAllMarkers(null);
		service.closeInfoWindow();
		allInfo.markerList=[];
		clusterer.clear();

		service.deleteMarkerOverlay();
		imgSeq=1;

		$.each(data, function(key, itm) {
			// 이미지 설정 옵션에 따라 설정
			var arr = itm.cdId.split(",");

			var arrMax = Math.max.apply(null, arr);
			var arrMin = 0;

			for(var i = 0; i < arr.length; i++) {
				// maxNum 값이 없는 경우 현재 배열값으로 지정
				if (!arrMin) {
					arrMin = arr[i];
				};

				// minNum의 값과 현재 값을 비교해서 minNum값을 가장 작은 값으로 유지
				if (arrMin < arr[i] && 5 > arr[i]) {
					arrMin = arr[i];
				}
			}

			var icon ="old";
			var icoTxt = "";

			switch (arrMax) {
				case 11: icon ="invest"; break;
				case 10: icon ="old"; break;
				case 9:
					icon ="rental";
					icoTxt = "전";
					if(arrMin==1){
						icon ="1";
					}else if(arrMin==2){
						icon ="1_5";
					}else if(arrMin==3){
						icon ="2";
					}else if(arrMin==4){
						icon ="3";
					}else if(arrMin==5){
						icon ="4";
					}else{
						icon ="rental";
						icoTxt = "";
					}break;
				case 8: icon ="month"; break;
				case 7:
					if(arrMin==1){
						icon ="1_t";
					}else if(arrMin==2){
						icon ="1_5_t";
					}else if(arrMin==3){
						icon ="2_t";
					}else if(arrMin==4){
						icon ="3_t";
					}else if(arrMin==5){
						icon ="4_t";
					}else{
						icon ="4_t";
					}break;
				case 6: icon ="duplex"; break;
				case 5: icon ="4"; break;
				case 4: icon ="3"; break;
				case 3: icon ="2"; break;
				case 2: icon ="1_5"; break;
				case 1: icon ="1"; break;
				default: icon ="old"; break;
			}

			var imageSize = new daum.maps.Size(22, 26);

			var imageOptions = service.setImageOptions(icon);

			var LatLng = new daum.maps.LatLng(itm.latitude, itm.longitude);

			var title = itm.productNm;

			// 마커이미지와 마커를 생성합니다
			var markerImage = service.createMarkerImage(
				markerImageSrc,
				imageSize,
				imageOptions
				),
				marker = service.createMarker(LatLng, markerImage, title);



//// 여기 떄문에 느림
//
//
//      var infowindow = new daum.maps.InfoWindow({
//    	    content : itm.product_nm,
//    	});
//
//      infowindow.open(map, marker);
//      map.setCenter(marker.getPosition());
//
//
//      allInfo.infoWindow.push(infowindow);
//
//     //
//
			daum.maps.event.addListener(marker, "click", function() {
				service.detailOverlay(itm);
			});

			allInfo.markerList.push(marker);

			clusterer.addMarkers(allInfo.markerList);

			service.createMarkerOverlay(itm, icoTxt);
		});


		service.setAllMarkers(map);

		// req03
		// 마커 레이블 생성
		markerLabel = data;
//    service.createMarkerOverlay(data);

	},
	// 마커레이블 생성(커스텀오버레이생성)
	createMarkerOverlay : function(itm, icoTxt){
//	  service.deleteMarkerOverlay();
		var level = map.getLevel();

		if(level<6){
//		  $.each(data, function(key, itm) {
			var LatLng = new daum.maps.LatLng(itm.latitude, itm.longitude);
			// 커스텀 오버레이에 표시할 내용입니다
			// HTML 문자열 또는 Dom Element 입니다
			var incontent = '<div class ="label" style="margin-top: -45px;"><span class="left">'
				+'</span><span class="center" style="font-size:12px; color:white;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">'
				+itm.productNm+'</span><span class="right"></span></div>';
			if(icoTxt!=""){
				incontent += '<div id="imgSeq'+imgSeq+'" class ="label" style="margin-top: -0px; text-align:center;"><span class="left">'
					+'</span><span class="center" style="font-size:14px; color: #FF9900;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">'
					+icoTxt+'</span><span class="right"></span></div>';
			}

			// 커스텀 오버레이가 표시될 위치입니다

			// 커스텀 오버레이를 생성합니다
			var customLbOverlay = new kakao.maps.CustomOverlay({
				position: LatLng,
				content: incontent
			});
			// 커스텀 오버레이를 지도에 표시합니다
			customLbOverlay.setMap(map);
			customLbOverlayArr.push(customLbOverlay);

			$("#imgSeq"+imgSeq).on('click',function(){
				service.detailOverlay(itm);
			});


			imgSeq = imgSeq+1;
//		  });
		}
	},
	//마커레이블 삭제(커스텀오버레이삭제)
	deleteMarkerOverlay : function(){
		for (var i = 0; i < customLbOverlayArr.length; i++) {
			customLbOverlayArr[i].setMap(null);
		}
		customLbOverlayArr = [];
	},
	// 데이터 전체 불러오기
	setAllSearch: function(data) {
		var element = "";
		if (data != null && data.length != 0) {
			$.each(data, function(key, itm) {
				element +='<li>';
				element +='	<div class="tooltip" onclick="service.setCenterMap('+itm.latitude+','+itm.longitude+','+key+')">';
				element +=' 		<p class="tooltip-title">'+itm.productNm+'</p>';
				element +=' 		<hr />';
				element +=' 		<dl>';
				element +='			<dt class="tooltip-address" >'+itm.address+'</dt>';
				element +='			<dd class="txt_post">'+(itm.memo).replace(/\n/g, "<br />");+'</dd>';
				element +='		</dl>';
				element +='	</div>';
				element +='</li>';
			});
		} else {
			element += "<li class='no-data'>검색조건과 일치하는 정보가 없습니다.</li>";
		}

		$("#searchList").html(element);

	},
	setCenterMap: function(latitude,longitude,key) {
		service.closeOverlay();
		// 이동할 위도 경도 위치를 생성합니다
		var moveLatLon = new daum.maps.LatLng(latitude, longitude);

		// 지도 중심을 부드럽게 이동시킵니다
		// 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
		map.panTo(moveLatLon);

		// 상세보기
		service.detailOverlay(searchDataArr[key]);

	},
	// 물건 등록 창열기
	createProduct: function() {

		// 파일 배열 초기화
		fileList = new Array();
		// 파일 사이즈 배열 초기화
		fileSizeList = new Array();
		// 파일 인덱스 초기화
		fileIndex = 0;


		$('#creProNm').val("");
		$('#creAddress').val("");
		$('#creMemo').val("");
		$('#creR').val("");
		$('#crePhoneNum').val("");
		$('input[name=creRoomType]').prop("checked", "");
		$('#creProNm').val("");
		$('#creLat').val("");
		$('#creLog').val("");

		$("#fileTableTbody").html("");

		service.closeOverlay();
		$("#crePopup").fadeIn(350);
	},

	createData: function(){
		//옵션 가져가기
		var creOpList = [];
		$('input:checkbox[name=creRoomType]').each(function() {
			if($(this).is(':checked'))
				creOpList.push($(this).val());
		});


		var viewFileIndex = new Array();

		$.each(fileList, function(i, v) {
			viewFileIndex.push(v);
		});
		var formData = new FormData();

		$.each(viewFileIndex, function(i, file) {
			formData.append('file-' + i, file);
		});

		formData.append('fileType', 'file_type');

		var fileInfo;
		$.ajax({
			dataType : "json",
			data : formData,
			cache : false,
			contentType : false,
			processData : false,
			type : "post",
			async: false,
			url : "/file/fileUpload",
			success : function(data) {

				fileInfo=data;

				var searchData = {
					creProNm: $('#creProNm').val(),
					creAddress: $('#creAddress').val(),
					creMemo: $('#creMemo').val(),
					creR: $('#creR').val(),
					crePhoneNum: $('#crePhoneNum').val(),
					creOpList: JSON.stringify(creOpList),
					creLat: $('#creLat').val(),
					creLog: $('#creLog').val(),
					fileInfo: JSON.stringify(fileInfo)
				}
				console.log(searchData);
				common.ajax("/map/createProductInfo",searchData,service.createDone);
			}
		});
	},
	createDone:function(data){
		alert("물건등록이 완료되었습니다.");
//	location.reload();

		$("#crePopup").hide();
		service.closeOverlay();

		// 이동할 위도 경도 위치를 생성합니다
		var moveModify = new daum.maps.LatLng($("#creLat").val(), $("#creLog").val());

		// 지도 중심을 부드럽게 이동시킵니다
		// 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
		map.panTo(moveModify);

		service.changeMarker($(".menu_selected").attr("type"));

	},
	removeOverlay:function(){
		service.closeOverlay();
		removeEvent = true;
		daum.maps.event.addListener(map, "click", function(mouseEvent) {
			if (removeEvent) {
				// 클릭한 위도, 경도 정보를 가져옵니다
				var latlng = mouseEvent.latLng;

				var lat = latlng.getLat();
				var log = latlng.getLng();

				var searchData = {
					modyProductId: dataItem.productId,
					modyLat: lat,
					modyLog: log,
				}

				common.ajax("/map/removeProductInfo.do",searchData,service.removeDone);

				removeEvent = false;
			}
		});
	},
	removeDone:function(data){
		alert("물건 위치변경이 완료되었습니다.");
		removeEvent = false;
		location.reload();
	},

	// 물건 상세
	detailOverlay: function(itm){
		dataItem=itm;

		service.closeOverlay();

		var str="";
		str2="";
		$("#viewStr").html("");
		str += '<div class="flexslider">';
		str += '<ul class="slides">';

		if(itm.filePath != null){
			var imgArr = itm.filePath.split(",");
			for(var i = 0; i < imgArr.length; i++) {
				str += '<li><a href="javascript:popImg();"><img class="exifImg" width="100%" height="100%" style="pointer-events:none;" src="'+imgUrl+imgArr[i]+'" alt="" /></a></li>';
				if(platform == "pc"){
					str2 += '<li><img class="exifImg" style="height:'+$("#imagePopup").height()*0.90+'px;width:auto;" src="'+imgUrl+imgArr[i]+'" alt="" href="#"/></li>';
				}else if(platform == "mobile"){
					str2 += '<li><img style="width:100%;height:auto;" src="'+imgUrl+imgArr[i]+'" alt="" href="#"/></li>';
				}
			}
		}
		str += '</ul>';
		str += '</div>';

		$("#viewProductNm").html(itm.productNm);
		$("#viewAddress").html(common.toStr(itm.address));
		$("#viewMemo").html(common.toStr(itm.memo));
		$("#viewR").html(common.toStr(itm.r));
		$("#viewPhone").html(common.toStr(itm.phoneNum));
		$("#viewCdNm").html(common.toStr(itm.cdNm));
		$("#viewUpder").html(common.toStr(itm.upder));
		$("#viewCrctDt").html(itm.crctDt);
		$("#viewStr").html(str);



		var messagetoSend = $("#viewMemo").html().replace(/\n/g, "<br />");
		$("#viewMemo").html(messagetoSend);

		var message = $("#viewPhone").html().replace(/\n/g, "<br />");
		$("#viewPhone").html(message);

		$('.flexslider').flexslider({
			slideshow: false,
			smoothHeight: true,
			animation: "slide",
			controlNav: true
		});

		if(itm.productYn=="Y"){
			$("#dtlModify").hide();
		}else{
			$("#dtlModify").show();
		}
		$("#dtlPopup").fadeIn(300);

		if(platform == "mobile"){
			$('#list_panel_content').hide();
			$("#main-content").addClass("list_panel_content-closed");
			$(".fa-bars-arrow img").attr("src", "images/toggle_right_panel_btn.png");
			$(".tab-button").css({"background-image": "url(images/btn_tab_open.png)"});
		}
	},

	// 물건 수정
	modifyOverlay: function() {

		// 파일 배열 초기화
		fileList = new Array();
		// 파일 사이즈 배열 초기화
		fileSizeList = new Array();
		// 파일 인덱스 초기화
		fileIndex = 0;

		service.closeOverlay();

		$("#modyProductId").val(dataItem.productId);
		$("#modyProNm").val(dataItem.productNm);
		$("#modyAddress").val(dataItem.address);
		$("#modyMemo").val(dataItem.memo);
		$("#modyR").val(dataItem.r);
		$("#modyPhoneNum").val(dataItem.phoneNum);

		$("#creLat").val(dataItem.latitude);
		$("#creLog").val(dataItem.longitude);

		//옵션

//    $('input:checkbox[name=creRoomType]').each(function() {
//	      if($(this).is(':checked'))
//	    	creOpList.push($(this).val());
//	  });

		$("input[name=modyRoomType]:checkbox").each(function() {
			$(this).attr("checked", false);
		});
		$("input[name=modyYN]").attr("checked", false);
		var arr = dataItem.cdId.split(",");
		$.each(arr, function(key, itm){
			$("input[name=modyRoomType][value="+itm+"]").attr("checked", true);
		})

		//modyProNm
		var searchData={ productId : dataItem.productId};
		common.ajax("/map/getProductFileList",searchData,service.modyFileSet);

		$("#modyPopup").fadeIn(350);
	},

	modyFileSet:function(data){
		var element = '';
		if (data != null && data.length != 0) {
			$.each(data, function(key, itm) {
//	  		element += '<tr>';
//			element += '	<td>';
//			element += '<input type="hidden" name="fileOrd" value="'+itm.FILE_ORD+'">';
//			element += '<input type="hidden" name="filePath" value="'+itm.FILE_PATH+'">';
//			element += '<input type="hidden" name="fileSeq" value="'+itm.FILE_SEQ+'">';
//			element += '<input type="hidden" name="fileSize" value="'+itm.FILE_SIZE+'">';
//			element += '<input type="hidden" name="productId" value="'+itm.productId+'">';
//			element += '<input type="hidden" name="rgstFileNm" value="'+itm.RGST_FILE_NM+'">';
//			element += '<input type="hidden" name="storFileId" value="'+itm.STOR_FILE_NM+'">';
//			element += itm.RGST_FILE_NM;
//			element += '</td>';
//			element += '	<td>';
//			element += '		<button type="button" onclick="service.moveUp(this)">올리기</button>';
//			element += '		<button type="button" onclick="service.moveDown(this)">내리기</button>';
//			element += '		<button type="button" onclick="service.fileDelete(this)">삭제</button>';
//			element += '	</td>';
//			element += '</tr>';

				element += '<div class="add_div" style="">';
				element += '<input type="hidden" name="fileOrd" value="'+itm.fileOrd+'">';
				element += '<input type="hidden" name="filePath" value="'+itm.filePath+'">';
				element += '<input type="hidden" name="fileSeq" value="'+itm.fileSeq+'">';
				element += '<input type="hidden" name="fileSize" value="'+itm.fileSize+'">';
				element += '<input type="hidden" name="productId" value="'+itm.productId+'">';
				element += '<input type="hidden" name="rgstFileNm" value="'+itm.rgstFileNm+'">';
				element += '<input type="hidden" name="storFileId" value="'+itm.storFileNm+'">';
				element += '	<div class="img_title_name">'+itm.rgstFileNm+'</div>';
				element += '	<div class="img_file_border">';
				element += '		<button class="file_sort" type="button" onclick="service.crtMoveUp(this)"><img  src="/images/file_arrow_up.png"></button>';
				element += '		<button class="file_sort" type="button" onclick="service.crtMoveDown(this)"><img  src="/images/file_arrow.png"></button>';
				element += '		<button class="file_sort" type="button" onclick="service.crtFileDelete(this)"><img  src="/images/del_x.png"></button>';
				element += '	</div>';
				element += '	<div style="clear:both;"></div>';
				element += '</div>';

				console.log(itm);

			});
		}

		$("#modyFileTbody").html(element);
	},

	modifyData: function(){
		//옵션 가져가기
		var modyOpList = [];
		$('input:checkbox[name=modyRoomType]').each(function() {
			if($(this).is(':checked'))
				modyOpList.push($(this).val());
		});

		var viewFileIndex = new Array();

		var sendFileList = new Array();

		var $addTrLength = $("#modyFileTbody .add_div");

		for (var i = 0; i < $addTrLength.length; i++) {

			var id = $addTrLength.eq(i).data("chk");

			if(typeof id !== 'undefined'){

				sendFileList.push(null);

//			  var fileList = document.getElementById(id).files;


			} else {
				var fileOrd = $addTrLength.eq(i).children('input:hidden').eq(0).val();
				var filePath = $addTrLength.eq(i).children('input:hidden').eq(1).val();
				var fileSeq = $addTrLength.eq(i).children('input:hidden').eq(2).val();
				var fileSize = $addTrLength.eq(i).children('input:hidden').eq(3).val();
				var productId = $addTrLength.eq(i).children('input:hidden').eq(4).val();
				var rgstFileNm = $addTrLength.eq(i).children('input:hidden').eq(5).val();
				var storFileId = $addTrLength.eq(i).children('input:hidden').eq(6).val();

				var map = {
					fileOrd	:fileOrd,
					realpath:filePath,
					fileSeq:fileSeq,
					sizeInBytes:fileSize,
					productId:productId,
					orgName:rgstFileNm,
					saveName:storFileId
				}
				sendFileList.push(map);
			}
		}

		$.each(fileList, function(i, v) {
			viewFileIndex.push(v);
		});

		var formData = new FormData();

		$.each(viewFileIndex, function(i, file) {
			formData.append('file-' + i, file);
		});

		formData.append('fileType', 'file_type');


		var fileInfo;
		$.ajax({
			dataType : "json",
			data : formData,
			cache : false,
			contentType : false,
			processData : false,
			type : "post",
			async: false,
			url : "/file/fileUpload",
			success : function(data) {
				if (data != null && data.length != 0) {
					$.each(data, function(key, itm) {
						var stopFlg="N";
						$.each(sendFileList, function(key, file) {
							if(stopFlg=="N"){
								if(file == null){
									sendFileList[key] = itm;
									stopFlg="Y";
								}
							}

						});
					});
				}


				var modyYN = $('input:checkbox[name="modyYN"]').is(":checked") == true ? 'Y' : 'N';

				var searchData = {
					productId: $('#modyProductId').val(),
					modyProNm: $('#modyProNm').val(),
					modyAddress: $('#modyAddress').val(),
					modyMemo: $('#modyMemo').val(),
					modyR: $('#modyR').val(),
					modyPhoneNum: $('#modyPhoneNum').val(),
					modyOpList: JSON.stringify(modyOpList),
					modyYN: modyYN,
					creLat: $("#creLat").val(),
					creLog: $("#creLog").val(),
					fileInfo: JSON.stringify(sendFileList)
				}

				common.ajax("/map/modifyProductInfo",searchData,service.modifyDone);
			}
		});

	},
	modifyDone:function(data){
		alert("물건수정이 완료되었습니다.");
		$("#modyPopup").hide();
		$("#dtlPopup").hide();
		service.closeOverlay();

		// 이동할 위도 경도 위치를 생성합니다
		var moveModify = new daum.maps.LatLng($("#creLat").val(), $("#creLog").val());

		// 지도 중심을 부드럽게 이동시킵니다
		// 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
		map.panTo(moveModify);

		service.changeMarker($(".menu_selected").attr("type"));


//	location.reload();
	},

	deleteData: function(){

		var searchData = {
			productId: $('#modyProductId').val()
		}

		common.ajax("/map/deleteProductInfo",searchData,service.deleteDone);

	},
	deleteDone:function(data){
		alert("삭제가 완료되었습니다.");
		$("#modyPopup").hide();
		$("#dtlPopup").hide();
		service.closeOverlay();

		// 이동할 위도 경도 위치를 생성합니다
		var moveModify = new daum.maps.LatLng($("#creLat").val(), $("#creLog").val());

		// 지도 중심을 부드럽게 이동시킵니다
		// 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
		map.panTo(moveModify);

		service.changeMarker($(".menu_selected").attr("type"));


//	location.reload();
	},

	//============================================

	// 문자열 정보를 일정크기만큼 subString + ... 후 반환
	subStrInfo: function(data, sttIdx, leng) {
		var dataStr = "";
		if ((data.length = "20")) {
			dataStr += data.substr(sttIdx, leng);
			dataStr += "...";
		}
		return dataStr;
	},

	moveUp: function(el){
		var $tr = $(el).parent().parent(); // 클릭한 버튼이 속한 tr 요소
		$tr.prev().before($tr); // 현재 tr 의 이전 tr 앞에 선택한 tr 넣기
	},

	moveDown: function(el){
		var $tr = $(el).parent().parent(); // 클릭한 버튼이 속한 tr 요소
		$tr.next().after($tr); // 현재 tr 의 다음 tr 뒤에 선택한 tr 넣기
	},
	crtMoveUp: function(el){
		var $tr = $(el).parent().parent(); // 클릭한 버튼이 속한 tr 요소

		var fIndex = $(".add_div").index($tr);
		var total = $(".add_div").length;
		var tmpFile;
		var tmpFileSize;

		if(fIndex != 0){
			tmpFile = fileList[fIndex];
			tmpFileSize = fileSizeList[fIndex];

			fileList[fIndex] = fileList[fIndex-1];
			fileSizeList[fIndex] = fileSizeList[fIndex-1];

			fileList[fIndex-1] = tmpFile;
			fileSizeList[fIndex-1] = tmpFileSize;
			$tr.prev().before($tr); // 현재 tr 의 이전 tr 앞에 선택한 tr 넣기
		}
	},

	crtMoveDown: function(el){
		var $tr = $(el).parent().parent(); // 클릭한 버튼이 속한 tr 요소

		var fIndex = $(".add_div").index($tr);
		var total = $(".add_div").length;
		var tmpFile;
		var tmpFileSize;

		if(fIndex+1 != total){
			tmpFile = fileList[fIndex];
			tmpFileSize = fileSizeList[fIndex];

			fileList[fIndex] = fileList[fIndex+1];
			fileSizeList[fIndex] = fileSizeList[fIndex+1];

			fileList[fIndex+1] = tmpFile;
			fileSizeList[fIndex+1] = tmpFileSize;
			$tr.next().after($tr); // 현재 tr 의 다음 tr 뒤에 선택한 tr 넣기
		}
	},
	crtFileDelete:function(el){
		var $tr = $(el).parent().parent(); // 클릭한 버튼이 속한 tr 요소
		var fIndex = $(".add_div").index($tr);
		fileList.splice(fIndex,1);
		fileSizeList.splice(fIndex,1);

		$(el).parent().parent().remove();
	},

	addFileInput:function(){

		var element = '';
		element += '<tr>';
		element += '	<td><input type="file" name="file_'+creFileCnt+'" id="file_'+creFileCnt+'"></td>';
		element += '	<td>';
		element += '		<button type="button" onclick="service.moveUp(this)">올리기</button>';
		element += '		<button type="button" onclick="service.moveDown(this)">내리기</button>';
		element += '		<button type="button" onclick="service.fileDelete(this)">삭제</button>';
		element += '	</td>';
		element += '</tr>';

		$("#fileTbody").append(element);
		creFileCnt++;
	},

	addModyFileInput:function(){

		var element = '';
		element += '<tr>';
		element += '	<td><input type="file" name="file_'+modyFileCnt+'" id="file_'+modyFileCnt+'"></td>';
		element += '	<td>';
		element += '		<button type="button" onclick="service.moveUp(this)">올리기</button>';
		element += '		<button type="button" onclick="service.moveDown(this)">내리기</button>';
		element += '		<button type="button" onclick="service.fileDelete(this)">삭제</button>';
		element += '	</td>';
		element += '</tr>';

		$("#modyFileTbody").append(element);
		modyFileCnt++;
	},

	fileDelete:function(el){
		$(el).parent().parent().remove();
	},

	logout: function(){
		if(confirm('로그아웃 하시겠습니까?')){
			location.href = "/logout.do";
		}
	}

};

//-------------------------------------------------------
//검색 이벤트 분기
$(document).on("click", ".search-btn", function() {
//	var searchInput = $("#searchInput").val();
//
//    var searchData = {
//	    searchType: mapType,
//	    searchInput: searchInput
//    }
//
//    service.getProductSearchList(searchData);
//	service.changeMarker(mapType);
	service.changeMarker(mapType, {"area": "GLOBAL"});

});

//검색 엔터키 이벤트
$(document).on("keydown", ".map-input", function(key) {
	if (key.keyCode == 13) {
		$(".search-btn").trigger("click");
	}
});

//물건 등록 버튼
$(document).on('click','#btn_create',function(){

	if(common.validate($('#creProNm').val(), "물건명을 입력하세요.")) { return; }
	if(common.validate($('#creLat').val(), "주소를 다시 선택해 주세요.")) { return; }
	if(common.validate($('#creLog').val(), "주소를 다시 선택해 주세요.")) { return; }
	if($("input:checkbox[name=creRoomType]:checked").length < 1){alert('옵션을 선택해주세요.'); return;}

	service.createData();
});

//물건 수정 버튼
$(document).on('click','#btn_modify',function(){

	if(common.validate($('#modyProNm').val(), "물건명을 입력하세요.")) { return; }
	if($("input:checkbox[name=modyRoomType]:checked").length < 1){alert('옵션을 선택해주세요.'); return;}

	service.modifyData();
});

//물건 수정 버튼
$(document).on('click','#btn_delete',function(){
	service.deleteData();
});

//-------------------------------------------------------
// 화면 초기화 호출
$(document).ready(function() {
	service.onLoadEvent();

});

function popImg(){

	$("#imagePopup").css("overflow","hidden");
	scWidth = $("#imagePopup").width()*0.93;
	scHeight = $("#imagePopup").height()*0.95;
//	$("#imagePopup2").css("width",scWidth);
//	$("#imagePopup2").css("height",scHeight);

//      var testimg = $("#testimg");
//if (testimg.exif("Orientation") == 6) {
//    testimg.addClass("rotate90");
//}

	$("#imagePopup").html("");
	var lyrContent =
		'          <div class="popup-inner-newimage" id="imagePopup2"style="width:100%;height:100%";>' +
		'            <div class="popup-title">' +
		'              <span class="popup-tit" ></span>' +
		'             <a class="popup-close" data-popup-close="popup-3" href="javascript:popClose();">닫기</a>' +
		'            </div>' +
		'            <div class="popup-content" id="popImage">' +
		'				<div class="flexslider1">' +
		'					<ul class="slides" id="popSlideImage">' +
		str2+
		'					</ul>' +
		'				</div>' +
		'            </div>' +
		'          </div>' +
		"</div>";

	$("#imagePopup").html(lyrContent);
	$(".flexslider1").flexslider({
		slideshow: false,
		smoothHeight: true,
		animation: "slide",
		controlNav: true,
	});
	setTimeout(function() {      $(".flexslider1 ol li").eq(1).find("a").click(); $(".flexslider1 ol li").eq(0).find("a").click(); }, 500);

	$("#popSlideImage li img").on('click',function(){
		var win = window.open($(this).attr("src"), '_blank');
		win.focus();

	});
	/*
     */
	$("#imagePopup").fadeIn(350);

}

function popClose(){
	$("#imagePopup").fadeOut(350);
}

//물건 등록시 주소 가져오 20190928 req01
function searchDetailAddrFromCoords(coords, callback) {
	// 좌표로 법정동 상세 주소 정보를 요청합니다
	geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

//20191003 req01 by hodec 우편번호 검색 api추가
var postcodeService = {
	openPopup: function() {
		new daum.Postcode({
			oncomplete: function(data) {
				$("#creAddress").val(data.jibunAddress)
				// 주소로 좌표를 검색합니다
				geocoder.addressSearch($("#creAddress").val(), function(result, status) {
					$("#creLat").val(result[0].y); // latitude
					$("#creLog").val(result[0].x); // longitude
				});
			}
		}).open();
	}
}

//20191006 투자 구옥 추가 hodec
var mapTypeService = {
	handle : function(el) {
		var $this = $(el);
		service.changeMarker($this.attr("type"))

	}
}

//req02
//파일 리스트 번호
var fileIndex = 0;
//등록할 전체 파일 사이즈
var totalFileSize = 0;
//파일 리스트
var fileList = new Array();
//파일 사이즈 리스트
var fileSizeList = new Array();
//등록 가능한 파일 사이즈 MB
var uploadSize = 500;
//등록 가능한 총 파일 사이즈 MB
var maxUploadSize = 500;
var dropZone = $(".upload_img");

//Drag기능
dropZone.on('dragenter',function(e){
	e.stopPropagation();
	e.preventDefault();
	// 드롭다운 영역 css
	dropZone.css('background-color','#E3F2FC');
});
dropZone.on('dragleave',function(e){
	e.stopPropagation();
	e.preventDefault();
	// 드롭다운 영역 css
	dropZone.css('background-color','#FFFFFF');
});
dropZone.on('dragover',function(e){
	e.stopPropagation();
	e.preventDefault();
	// 드롭다운 영역 css
	dropZone.css('background-color','#E3F2FC');
});
dropZone.on('drop',function(e){
	e.preventDefault();
	// 드롭다운 영역 css
	dropZone.css('background-color','#FFFFFF');

	var files = e.originalEvent.dataTransfer.files;
	if(files != null){
		if(files.length < 1){
			alert("폴더 업로드 불가");
			return;
		}
		selectFile(files,$(this).data("type"));
	}else{
		alert("ERROR");
	}
});

//파일 선택시
function selectFile(files,type){

	// 다중파일 등록
	if(files != null){
		for(var i = 0; i < files.length; i++){
			// 파일 이름
			var fileName = files[i].name;
			var fileNameArr = fileName.split("\.");
			// 확장자
			var ext = fileNameArr[fileNameArr.length - 1];
			// 파일 사이즈(단위 :MB)
			var fileSize = files[i].size / 1024 / 1024;

			if(cmpFileChk(fileName,files[i].size,type)=="Y"){
				break;
			}else{
				if($.inArray(ext, ['exe', 'bat', 'sh', 'java', 'jsp', 'html', 'js', 'css', 'xml']) >= 0){
					// 확장자 체크
					alert("등록 불가 확장자");
					break;
				}else if(fileSize > uploadSize){
					// 파일 사이즈 체크
					alert("용량 초과\n업로드 가능 용량 : " + uploadSize + " MB");
					break;
				}else{
					// 전체 파일 사이즈
					totalFileSize += fileSize;
					// 파일 배열에 넣기
					fileList[fileIndex] = files[i];
					// 파일 사이즈 배열에 넣기
					fileSizeList[fileIndex] = fileSize;
					// 업로드 파일 목록 생성
					addFileList(files[i],type);
//				addFileList(fileIndex, fileName, fileSize);
					// 파일 번호 증가
					fileIndex++;
				}
			}

		}
	}else{
		alert("ERROR");
	}
}

function cmpFileChk(fileName,fileSize,type){
	var cmpYn="N";
	if(type=='modify'){
		var $addTrLength = $("#modyFileTbody .add_div");
		for (var j = 0; j < $addTrLength.length; j++) {
			var id = $addTrLength.eq(j).data("chk");
			if(typeof id === 'undefined'){
				var cmpFileSize = $addTrLength.eq(j).children('input:hidden').eq(3).val();
				var rgstFileNm = $addTrLength.eq(j).children('input:hidden').eq(5).val();
				if(fileName==rgstFileNm && fileSize==cmpFileSize){
					alert("중복된 파일입니다.");
					cmpYn = "Y";
				}
			}
		}
	}
	$.each(fileList, function(k, v) {
		if(v.name!=='undefined' && v.size!=='undefined' && fileName==v.name && fileSize==v.size){
			alert("중복된 파일입니다.");
			cmpYn = "Y";
		}
	});

	return cmpYn;
}


//업로드 파일 목록 생성
function addFileList(file,type){
	var html = "";
	html += '						<div class="add_div" data-chk="new">';
	html += '							<div class="img_title_name">'+file.name+'</div>';
	html += '							<div class="img_file_border">';
	html += '								<button class="file_sort" type="button" onclick="service.crtMoveUp(this)"><img  src="/images/file_arrow_up.png"></button>';
	html += '								<button class="file_sort" type="button" onclick="service.crtMoveDown(this)"><img  src="/images/file_arrow.png"></button>';
	html += '								<button class="file_sort" type="button" onclick="service.crtFileDelete(this)"><img  src="/images/del_x.png"></button>';
	html += '							</div>';
	html += '							<div style="clear:both;"></div>';
	html += '						</div>';
	if(type=="create"){
		$('#fileTableTbody').append(html);
	}else if(type=="modify"){
		$('#modyFileTbody').append(html);
	}
}

if(getCookie('searchType')=='N'){
	$('#list_panel_content').hide();
	$("#main-content").addClass("list_panel_content-closed");
	$(".fa-bars-arrow img").attr("src", "images/toggle_right_panel_btn.png");
	$(".tab-button").css({"background-image": "url(images/btn_tab_open.png)"});
}

// 우편번호 찾기 찾기 화면을 넣을 element
var element_wrap = document.getElementById('addWrap');

function foldDaumPostcode() {
	// iframe을 넣은 element를 안보이게 한다.
	element_wrap.style.display = 'none';
}

function sample3_execDaumPostcode(addVal) {
	// 현재 scroll 위치를 저장해놓는다.
	var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
	new daum.Postcode({
		oncomplete: function(data) {
			console.log('주소검색결과');
			console.log(data);
			// 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 각 주소의 노출 규칙에 따라 주소를 조합한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var addr = ''; // 주소 변수
			var extraAddr = ''; // 참고항목 변수

			//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
				addr = data.roadAddress;
			} else { // 사용자가 지번 주소를 선택했을 경우(J)
				addr = data.jibunAddress;
			}

			// 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
			if(data.userSelectedType === 'R'){
				// 법정동명이 있을 경우 추가한다. (법정리는 제외)
				// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
				if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
					extraAddr += data.bname;
				}
				// 건물명이 있고, 공동주택일 경우 추가한다.
				if(data.buildingName !== '' && data.apartment === 'Y'){
					extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
				}
				// 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
				if(extraAddr !== ''){
					extraAddr = ' (' + extraAddr + ')';
				}
				// 조합된 참고항목을 해당 필드에 넣는다.
//                document.getElementById("sample3_extraAddress").value = extraAddr;

			} else {
//                document.getElementById("sample3_extraAddress").value = '';
			}

			// 우편번호와 주소 정보를 해당 필드에 넣는다.
//            document.getElementById('sample3_postcode').value = data.zonecode;
			document.getElementById(addVal).value = addr;

			$("#"+addVal).val(data.address)
			// 주소로 좌표를 검색합니다
			geocoder.addressSearch($("#"+addVal).val(), function(result, status) {
				$("#creLat").val(result[0].y); // latitude
				$("#creLog").val(result[0].x); // longitude
			});

			// 커서를 상세주소 필드로 이동한다.
//            document.getElementById("sample3_detailAddress").focus();

			// iframe을 넣은 element를 안보이게 한다.
			// (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
			element_wrap.style.display = 'none';

			// 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
			document.body.scrollTop = currentScroll;
		},
		// 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
		onresize : function(size) {
			element_wrap.style.height = size.height+'px';
		},
		width : '100%',
		height : '100%'
	}).embed(element_wrap);

	// iframe을 넣은 element를 보이게 한다.
	element_wrap.style.display = 'block';
}