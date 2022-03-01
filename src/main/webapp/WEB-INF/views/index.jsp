<%--
  Created by IntelliJ IDEA.
  User: 윤재훈
  Date: 2021-04-18
  Time: 오후 1:36
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
Hello World<br>
이 컨트롤러의 NAME은 ${name} 입니다.1111
<button type="button" onclick="testBridge()">브릿지 테스트</button>
<script>
    function testBridge(){
        window.MyApp.callMessage();
    }
</script>

</body>
</html>
