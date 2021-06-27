<%--
  Created by IntelliJ IDEA.
  User: 윤재훈
  Date: 2021-04-24
  Time: 오후 3:59
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset-UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
    <head>

        <link rel="stylesheet" media="screen" href="/css/html5Reset.css" />
        <link rel="stylesheet" media="screen" href="/css/style.css" />
        <link rel="stylesheet" media="screen" href="/css/style-responsive.css" />
        <link rel="stylesheet" media="screen" href="/css/flexslider.css" />

        <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
        <script src="/js/common/jquery-3.2.1.min.js"></script>
        <script src="/js/common/jquery-ui.min.js"></script>
        <script src="/js/common/jquery.flexslider-min.js"></script>
        <script src="/js/common/common.js"></script>
        <sitemesh:write property="head" />
    </head>
    <body>
        이 부분은 defaultlayout입니다.
        <div>
            <sitemesh:write property="body" />
        </div>
    </body>
</html>