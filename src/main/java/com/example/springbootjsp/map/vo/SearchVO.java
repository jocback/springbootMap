package com.example.springbootjsp.map.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SearchVO {

    private String lat1;
    private String lat2;
    private String lng1;
    private String lng2;
    private String searchType;
    private String searchInput;
    private List<String> searchtypeList;

}
