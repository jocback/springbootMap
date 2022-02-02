<%--
  Created by IntelliJ IDEA.
  User: jaehoonyoun
  Date: 2022/02/01
  Time: 17:31
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
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
                        <button class="btn" id="fileAdd" onclick="postUtil.execDaumPostcode('creAddress')">검색
                        </button>
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
                        <button class="btn" id="fileAdd" onclick="postUtil.execDaumPostcode('modyAddress')">검색
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