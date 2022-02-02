var fileUtil = {
    // 파일 리스트 번호
    fileIndex : 0,
    // 등록할 전체 파일 사이즈
    totalFileSize : 0,
    // 파일 리스트
    fileList : new Array(),
    // 파일 사이즈 리스트
    fileSizeList : new Array(),
    // 등록 가능한 파일 사이즈 MB
    uploadSize : 500,
    // 업로드 가능한 총 파일 사이즈  MB
    maxUploadSize : 500,
    // 파일 업로드 영역
    dropZone : null,
    fileTableBody : 'fileTableTbody',
    modifyFileBody : 'modyFileTbody',
    // 초기화
    init : function(){
        fileUtil.fileList = new Array();
        fileUtil.fileSizeList = new Array();
        fileUtil.fileIndex = 0;
    },
    // 이벤트 등록
    bind : function(){

        fileUtil.dropZone = $(".upload_img");
        //Drag기능
        fileUtil.dropZone.on('dragenter',function(e){
            e.stopPropagation();
            e.preventDefault();
            // 드롭다운 영역 css
            fileUtil.dropZone.css('background-color','#E3F2FC');
        });
        fileUtil.dropZone.on('dragleave',function(e){
            e.stopPropagation();
            e.preventDefault();
            // 드롭다운 영역 css
            fileUtil.dropZone.css('background-color','#FFFFFF');
        });
        fileUtil.dropZone.on('dragover',function(e){
            e.stopPropagation();
            e.preventDefault();
            // 드롭다운 영역 css
            fileUtil.dropZone.css('background-color','#E3F2FC');
        });
        fileUtil.dropZone.on('drop',function(e){
            e.preventDefault();
            // 드롭다운 영역 css
            fileUtil.dropZone.css('background-color','#FFFFFF');

            var files = e.originalEvent.dataTransfer.files;
            if(files != null){
                if(files.length < 1){
                    alert("폴더 업로드 불가");
                    return;
                }
                fileUtil.selectFile(files,$(this).data("type"));
            }else{
                alert("ERROR");
            }
        });
    },
    selectFile : function(files, type) {
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

                if(fileUtil.cmpFileChk(fileName,files[i].size,type)=="Y"){
                    break;
                }else{
                    if($.inArray(ext, ['exe', 'bat', 'sh', 'java', 'jsp', 'html', 'js', 'css', 'xml']) >= 0){
                        // 확장자 체크
                        alert("등록 불가 확장자");
                        break;
                    }else if(fileSize > fileUtil.uploadSize){
                        // 파일 사이즈 체크
                        alert("용량 초과\n업로드 가능 용량 : " + fileUtil.uploadSize + " MB");
                        break;
                    }else{
                        // 전체 파일 사이즈
                        fileUtil.totalFileSize += fileSize;
                        // 파일 배열에 넣기
                        fileUtil.fileList[fileUtil.fileIndex] = files[i];
                        // 파일 사이즈 배열에 넣기
                        fileUtil.fileSizeList[fileUtil.fileIndex] = fileSize;
                        // 업로드 파일 목록 생성
                        fileUtil.addFileList(files[i],type);
                        // 파일 번호 증가
                        fileUtil.fileIndex++;
                    }
                }
            }
        }else{
            alert("ERROR");
        }
    },
    cmpFileChk : function(fileName,fileSize,type) {
        var cmpYn="N";
        if(type=='modify'){
            var $addTrLength = $("#"+fileUtil.modifyFileBody+" .add_div");
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
        $.each(fileUtil.fileList, function(k, v) {
            if(v.name!=='undefined' && v.size!=='undefined' && fileName==v.name && fileSize==v.size){
                alert("중복된 파일입니다.");
                cmpYn = "Y";
            }
        });

        return cmpYn;
    },
    addFileList : function(file,type){
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
            $('#'+fileUtil.fileTableBody).append(html);
        }else if(type=="modify"){
            $('#'+fileUtil.modifyFileBody).append(html);
        }
    }
}