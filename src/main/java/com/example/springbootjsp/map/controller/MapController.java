package com.example.springbootjsp.map.controller;

import com.alibaba.fastjson.JSON;
import com.example.springbootjsp.map.service.MapService;
import com.example.springbootjsp.map.vo.CreateVO;
import com.example.springbootjsp.map.vo.FileVO;
import com.example.springbootjsp.map.vo.ProductVO;
import com.example.springbootjsp.map.vo.SearchVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;
import java.util.Map;

@Controller
public class MapController {

    @Autowired
    MapService mapService;

    // 매물조회 페이지
    @RequestMapping(value="/map/map", method = RequestMethod.GET)
    public String home(Model model) {
        model.addAttribute("name", "map");
        return "/map/map";
    }

    // 물건 조회
    @RequestMapping(value="/map/productList", method = RequestMethod.POST)
    @ResponseBody
    public List<ProductVO> selectProductList(SearchVO searchData) {
        List<ProductVO> productList = mapService.selectProductList(searchData);
        return productList;
    }

    // 물건 추가
    @ResponseBody
    @RequestMapping(value="/map/createProductInfo", method = RequestMethod.POST)
    public boolean createProductInfo(CreateVO createVO) {
        boolean resultVal = mapService.createProductInfo(createVO);
        return resultVal;
    }

    // 물건 수정
    @ResponseBody
    @RequestMapping(value="/map/modifyProductInfo", method = RequestMethod.POST)
    public boolean modifyProductInfo(CreateVO createVO) {
        boolean result = mapService.modifyProductInfo(createVO);
        return result;
    }

    // 물건 삭제
    @ResponseBody
    @RequestMapping(value="/map/deleteProductInfo", method = RequestMethod.POST)
    public boolean deleteProductInfo(CreateVO createVO) {
        boolean result = mapService.deleteProductInfo(createVO);
        return result;
    }

    // 첨부파일 삭제
    @ResponseBody
    @RequestMapping(value="/map/setFileDelete")
    public void setFileDelete(FileVO param) {
        mapService.setFileDelete(param);
    }

    // 첨부파일 조회
    @ResponseBody
    @RequestMapping(value="/map/getProductFileList")
    public List<FileVO> getProductFileList(String productId) {
        return mapService.getProductFileList(productId);
    }

    // 파일 업로드
    @ResponseBody
    @RequestMapping(value = "/file/fileUpload", method = RequestMethod.POST)
    public String fileUpload(MultipartHttpServletRequest multipartHttpServletRequest) {
        List<Map<String, Object>> fileList = mapService.fileSave(multipartHttpServletRequest);
        return JSON.toJSONString(fileList);
    }

}
