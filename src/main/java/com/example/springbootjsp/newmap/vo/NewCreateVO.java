package com.example.springbootjsp.newmap.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NewCreateVO {
    private String creProNm;
    private String creAddress;
    private String creMemo;
    private String creR;
    private String crePhoneNum;
    private String creOpList;
    private String creLat;
    private String creLog;
    private String userId;

    private String modyProNm;
    private String modyAddress;
    private String modyMemo;
    private String modyR;
    private String modyPhoneNum;
    private String modyOpList;
    private String modyYN;



    private String fileInfo;
    private String productId;
}
