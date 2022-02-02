<%--
  Created by IntelliJ IDEA.
  User: 윤재훈
  Date: 2021-06-06
  Time: 오후 11:06
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>지도쓰</title>
    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=26faddbaa5c5f513af69537a4117eef7&libraries=services,clusterer,drawing"></script>
</head>
<body>

<div id="wrap" class="wrap" style="top-margin:0; bottom-margin:0; left-margin:0; right-margin:0">
    <div id="map_wrap" class="map_wrap">
        <div id="map" class="map">
            <div class="onoff">
                <div class="category" id="category">
                    <ul>
                        <li id="allMenu" type="all" onclick="mapTypeService.handle(this)">
                            <span class="ico_comm ico_all_item"></span>
                            전체
                        </li>
                        <li id="newMenu" type="new" onclick="mapTypeService.handle(this)">
                            <span class="ico_comm ico_new_item"></span>
                            신축
                        </li>

                        <li id="oldMenu" type="old" onclick="mapTypeService.handle(this)">
                            <span class="ico_comm ico_old_item"></span>
                            구옥
                        </li>

                        <!-- 20191006 투자 구옥 추가 hodec -->
                        <li id="rentalMenu" type="rental" onclick="mapTypeService.handle(this)">
                            <span class="ico_comm ico_rental_item"></span>
                            전세
                        </li>
                        <li id="investMenu" type="month" onclick="mapTypeService.handle(this)">
                            <span class="ico_comm ico_month_item"></span>
                            월세
                        </li>
                        <!-- //20191102 월세 구옥 추가 hodec -->
                        <li id="compMenu" type="comp" onclick="mapTypeService.handle(this)">
                            <span class="ico_comm ico_4_item"></span>
                            완료
                        </li>
                    </ul>
                </div>
            </div>

            <div class="onoff2">
                <div class="onoff-top">
                    추가기능 확인
                </div>
                <div class="onoff-bottom">
                    <button class="btn btn2 fa-bars-arrow">검색창</button>
                    <button class="btn btn2" onclick="service.createProduct()">물건추가</button>
                    <button class="btn btn3" onclick="location.reload();">새로고침</button>
                    <button class="btn btn4" onclick="service.logout()">로그아웃</button>
                </div>
            </div>

            <div id="list_panel_content" class="list_panel_content">
                <div id="comm-info" class="tabcontent">
                    <div class="search-area">
                        <input
                                class="map-input"
                                type="text"
                                name="usrname"
                                placeholder="검색어를 입력해주세요."
                                id="searchInput"
                        />
                        <button class="search-btn">검색</button>
                    </div>
                    <div class="option-area">
                        <label class="checkbox">
                            <input type="checkbox" name="roomType" value="1룸"/>
                            <span class="cb"></span>
                            <span>1룸</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="roomType" value="1.5룸"/>
                            <span class="cb"></span>
                            <span>1.5룸</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="roomType" value="2룸"/>
                            <span class="cb"></span>
                            <span>2룸</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="roomType" value="3룸"/>
                            <span class="cb"></span>
                            <span>3룸</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="roomType" value="4룸"/>
                            <span class="cb"></span>
                            <span>4룸</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="roomType" value="테라스"/>
                            <span class="cb"></span>
                            <span>테라스</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="roomType" value="복층"/>
                            <span class="cb"></span>
                            <span>복층</span>
                        </label>
                    </div>
                    <div class="list-result-area">
                        <ul id="searchList">
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="popup" id="dtlPopup" data-popup="popup-4">
            <div class="popup-inner-modal" id="popup-inner">
                <div class="popup-title">
                    <span>상세보기</span>
                    <a class="popup-remove" onclick="service.removeOverlay()" href="#">이동</a>
                    <a class="popup-modify" onclick="service.modifyOverlay()" href="#" id="dtlModify">수정</a>
                    <a class="popup-close" onclick="service.closeOverlay()" data-popup-close="popup-4" href="#">닫기</a>
                </div>
                <div class="popup-content" id="popContent">
                    <table class="road-info">
                        <colgroup>
                            <col width="20%">
                            <col width="40%">
                            <col width="40%">
                        </colgroup>
                        <thead>
                        <tr>
                            <th>물건명</th>
                            <th colspan="2" id="viewProductNm"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>주소</td>
                            <td colspan="2" id="viewAddress"></td>
                        </tr>
                        <tr>
                            <td>메모</td>
                            <td colspan="2" id=viewMemo></td>
                        </tr>
                        <tr>
                            <td>옵션</td>
                            <td colspan="2" id="viewR"></td>
                        </tr>
                        <tr>
                            <td>전화번호</td>
                            <td colspan="2" id="viewPhone">
                            </td>
                        </tr>
                        <tr>
                            <td>R/T</td>
                            <td colspan="2" id="viewCdNm"></td>
                        </tr>
                        <tr>
                            <td>수정자명</td>
                            <td colspan="2" id="viewUpder"></td>
                        </tr>
                        <tr>
                            <td>수정일자</td>
                            <td colspan="2" id="viewCrctDt"></td>
                        </tr>
                        <tr>
                            <td>사진</td>
                            <td colspan="2">
                                <div class="dash_photo" id="viewStr">
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


        <!-- modal영역시작 매물추가-->
        <div class="popup" id="crePopup" data-popup="popup-1">
            <div class="popup-inner-modal">
                <div class="popup-title">
                    <span class="popup-tit">물건등록</span>
                    <a class="popup-modify" id="btn_create" href="#">등록</a>
                    <a class="popup-close" data-popup-close="popup-1" href="#">닫기</a>
                </div>
                <div class="popup-content">
                    <table class="road-info-modal">
                        <colgroup>
                            <col width="20%"/>
                            <col width="40%"/>
                            <col width="40%"/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th>명칭</th>
                            <th colspan="2">설명
                                <input type="hidden" name="creLat" id="creLat">
                                <input type="hidden" name="creLog" id="creLog">
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>물건명</td>
                            <td colspan="2"><input type="text" name="creProNm" id="creProNm"></td>
                        </tr>
                        <tr>
                            <td>주소</td>
                            <!--20191003 req01 by hodec 우편번호 검색 api추가-->
                            <!--                   <td colspan="2"> <input type="text" name="creAddress" id="creAddress"></td> -->
                            <td colspan="2">
                                <input type="text" name="creAddress" id="creAddress">
                                <button class="btn" id="fileAdd" onclick="sample3_execDaumPostcode('creAddress')">검색
                                </button>
                                <!--                     	<button class="btn" id="fileAdd" onclick="postcodeService.openPopup()">검색</button> -->
                            </td>
                        </tr>
                        <tr>
                            <td>메모</td>
                            <td colspan="2"><textarea rows="10" cols="35" id="creMemo"></textarea></td>
                        </tr>
                        <tr>
                            <td>옵션</td>
                            <td colspan="2"><input type="text" name="creR" id="creR"></td>
                        </tr>
                        <tr>
                            <td>전화번호</td>
                            <td colspan="2"><textarea rows="3" cols="35" id="crePhoneNum"></textarea></td>
                        </tr>
                        <tr>
                            <td>R/T</td>
                            <td colspan="2">
                                <label class="checkbox">
                                    <input type="checkbox" name="creRoomType" value="1"/>
                                    <span class="cb"></span>
                                    <span>1룸</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="creRoomType" value="2"/>
                                    <span class="cb"></span>
                                    <span>1.5룸</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="creRoomType" value="3"/>
                                    <span class="cb"></span>
                                    <span>2룸</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="creRoomType" value="4"/>
                                    <span class="cb"></span>
                                    <span>3룸</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="creRoomType" value="5"/>
                                    <span class="cb"></span>
                                    <span>4룸</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="creRoomType" value="6"/>
                                    <span class="cb"></span>
                                    <span>복층</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="creRoomType" value="7"/>
                                    <span class="cb"></span>
                                    <span>테라스</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="creRoomType" value="8"/>
                                    <span class="cb"></span>
                                    <span>월세</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="creRoomType" value="9"/>
                                    <span class="cb"></span>
                                    <span>전세</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="creRoomType" value="10"/>
                                    <span class="cb"></span>
                                    <span>구옥</span>
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>사진</td>
                            <td colspan="2">
                                <div class='upload_img' data-type="create">사진을 올려주세요</div>
                                <div id="fileTableTbody">
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- modal영역끝 매물추가 -->

        <!-- modal영역시작 매물수정 -->
        <div class="popup" id="modyPopup" data-popup="popup-2">
            <div class="popup-inner-modal">
                <div class="popup-title">
                    <span class="popup-tit">물건수정</span>
                    <a class="popup-modify" id="btn_modify" href="#">수정</a>
                    <a class="popup-close" data-popup-close="popup-2" href="#">닫기</a>
                </div>
                <div class="popup-content">
                    <table class="road-info-modal">
                        <colgroup>
                            <col width="20%"/>
                            <col width="40%"/>
                            <col width="40%"/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th>명칭</th>
                            <th colspan="2">설명
                                <input type="hidden" name="modyProductId" id="modyProductId">
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>물건명</td>
                            <td colspan="2"><input type="text" name="modyProNm" id="modyProNm"></td>
                        </tr>
                        <tr>
                            <td>주소</td>
                            <td colspan="2">
                                <input type="text" name="modyAddress" id="modyAddress">
                                <button class="btn" id="fileAdd" onclick="sample3_execDaumPostcode('modyAddress')">검색
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>메모</td>
                            <td colspan="2"><textarea rows="10" cols="35" id="modyMemo"></textarea></td>
                        </tr>
                        <tr>
                            <td>옵션</td>
                            <td colspan="2"><input type="text" name="modyR" id="modyR"></td>
                        </tr>
                        <tr>
                            <td>전화번호</td>
                            <td colspan="2"><textarea rows="3" cols="35" id="modyPhoneNum"></textarea></td>
                        </tr>
                        <tr>
                            <td>R/T</td>
                            <td colspan="2">
                                <label class="checkbox">
                                    <input type="checkbox" name="modyRoomType" value="1"/>
                                    <span class="cb"></span>
                                    <span>1룸</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="modyRoomType" value="2"/>
                                    <span class="cb"></span>
                                    <span>1.5룸</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="modyRoomType" value="3"/>
                                    <span class="cb"></span>
                                    <span>2룸</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="modyRoomType" value="4"/>
                                    <span class="cb"></span>
                                    <span>3룸</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="modyRoomType" value="5"/>
                                    <span class="cb"></span>
                                    <span>4룸</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="modyRoomType" value="6"/>
                                    <span class="cb"></span>
                                    <span>복층</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="modyRoomType" value="7"/>
                                    <span class="cb"></span>
                                    <span>테라스</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="modyRoomType" value="8"/>
                                    <span class="cb"></span>
                                    <span>월세</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="modyRoomType" value="9"/>
                                    <span class="cb"></span>
                                    <span>전세</span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="modyRoomType" value="10"/>
                                    <span class="cb"></span>
                                    <span>구옥</span>
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>사진</td>
                            <td colspan="2">
                                <div class='upload_img' data-type="modify">사진을 올려주세요</div>
                                <div id="modyFileTbody">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>완료여부</td>
                            <td colspan="2">
                                <label class="checkbox">
                                    <input type="checkbox" name="modyYN" id="modyYN" value="9"/>
                                    <span class="cb"></span>
                                    <span>물건완료</span>
                                </label>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button class="btn" id="btn_delete">삭제</button>
                </div>
            </div>
        </div>
        <!-- modal영역끝 매물수정 -->


    </div>

    <!-- modal영역시작 이미지 상세 -->
    <div class="popup" id="imagePopup" data-popup="popup-3" style="width:100%; height:100%; z-index:100;">
        <div class="popup-inner-newimage" id="imagePopup2">
            <div class="popup-title">
                <span class="popup-tit"></span>
                <a class="popup-close" data-popup-close="popup-3">닫기</a>
            </div>
            <div class="popup-content" id="popImage">
                <div class="flexslider1">
                    <ul class="slides" id="popSlideImage">
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <!-- modal영역끝 이미지 상세 -->

    <div id="addWrap"
         style="display:none;border:1px solid;width:500px;max-height:466px;margin:5px 0;overflow:auto;z-index:10;"
         class="popup-inner-modal">
        <img src="//t1.daumcdn.net/postcode/resource/images/close.png" id="btnFoldWrap"
             style="cursor:pointer;position:absolute;right:0px;top:-1px;z-index:1" onclick="foldDaumPostcode()"
             alt="접기 버튼">
    </div>

</div>


<script src="/js/map/map.js"></script>
</body>
</html>
