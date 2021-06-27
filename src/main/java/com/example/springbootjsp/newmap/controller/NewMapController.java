package com.example.springbootjsp.newmap.controller;

import com.alibaba.fastjson.JSON;
import com.example.springbootjsp.map.vo.CreateVO;
import com.example.springbootjsp.newmap.service.NewMapService;
import com.example.springbootjsp.newmap.vo.NewCreateVO;
import com.example.springbootjsp.newmap.vo.NewFileVO;
import com.example.springbootjsp.newmap.vo.NewProductVO;
import com.example.springbootjsp.newmap.vo.NewSearchVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;
import java.util.Map;

@Controller
public class NewMapController {

    @Autowired
    NewMapService mapService;

    // 매물조회 페이지
    @RequestMapping(value="/newmap/map", method = RequestMethod.GET)
    public String home(Model model) {
        model.addAttribute("name", "map");
        return "/newmap/newMap";
    }

    // 물건 조회
    @RequestMapping(value="/newmap/productList", method = RequestMethod.POST)
    @ResponseBody
    public List<NewProductVO> selectProductList(NewSearchVO searchData) {
        List<NewProductVO> productList = mapService.selectProductList(searchData);
        return productList;
    }

    // 물건 추가
    @ResponseBody
    @RequestMapping(value="/newmap/createProductInfo", method = RequestMethod.POST)
    public boolean createProductInfo(NewCreateVO createVO) {
        boolean resultVal = mapService.createProductInfo(createVO);
        return resultVal;
    }

    // 물건 수정
    @ResponseBody
    @RequestMapping(value="/newmap/modifyProductInfo", method = RequestMethod.POST)
    public boolean modifyProductInfo(NewCreateVO createVO) {
        boolean result = mapService.modifyProductInfo(createVO);
        return result;
    }

    // 물건 삭제
    @ResponseBody
    @RequestMapping(value="/newmap/deleteProductInfo", method = RequestMethod.POST)
    public boolean deleteProductInfo(CreateVO createVO) {
        boolean result = mapService.deleteProductInfo(createVO);
        return result;
    }

    // 첨부파일 삭제
    @ResponseBody
    @RequestMapping(value="/newmap/setFileDelete")
    public void setFileDelete(NewFileVO param) {
        mapService.setFileDelete(param);
    }

    // 첨부파일 조회
    @ResponseBody
    @RequestMapping(value="/newmap/getProductFileList")
    public List<NewFileVO> getProductFileList(String productId) {
        return mapService.getProductFileList(productId);
    }

    // 파일 업로드
    @ResponseBody
    @RequestMapping(value = "/newmap/fileUpload", method = RequestMethod.POST)
    public String fileUpload(MultipartHttpServletRequest multipartHttpServletRequest) {
        List<Map<String, Object>> fileList = mapService.fileSave(multipartHttpServletRequest);
        return JSON.toJSONString(fileList);
    }

}
