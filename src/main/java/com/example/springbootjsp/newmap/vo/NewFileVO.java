package com.example.springbootjsp.newmap.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NewFileVO {


    private String productId;
    private String fileSeq;
    private String filePath;
    private String rgstFileNm;
    private String storFileNm;
    private String fileSize;
    private String fileOrd;
    private String reger;
    private String rgstDt;
    private String upder;
    private String crctDt;

    private String realpath;
    private String orgName;
    private String saveName;
    private String sizeInBytes;
    private String userId;

}
