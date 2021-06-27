package com.example.springbootjsp.map.service;

import com.alibaba.fastjson.JSONObject;
import com.example.springbootjsp.map.mapper.MapMapper;
import com.example.springbootjsp.map.vo.*;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.*;

@Service
public class MapService {

    private static final Logger log = LoggerFactory.getLogger(MapService.class);

    @Autowired
    MapMapper mapMapper;

    private Long maxSize = Long.valueOf(10485760);

//    private String filePath = "/home/centos/apache-tomcat-8.5.40/zippro/webapps/zippro-web/images/";
    private String filePath = "C:/tempFolder/";

    public List<ProductVO> selectProductList(SearchVO searchData) {
        return mapMapper.selectProductList(searchData);
    }

    // 첨부파일 삭제
    public void setFileDelete(FileVO paramVO){
        FileVO fileVO = mapMapper.getFileInfo(paramVO);

        File file = new File(fileVO.getFilePath()+fileVO.getStorFileNm());
        if(file.exists()){
            file.delete();
        }
    }

    // 매물 파일 리스트
    public List<FileVO> getProductFileList(String productId) {
        return mapMapper.getProductFileList(productId);
    }

    // 매물 등록
    public boolean createProductInfo(CreateVO createVO) {
        String productId = mapMapper.selectProductId();

        String userId = "guest";
        createVO.setUserId(userId);
        createVO.setProductId(productId);

        String codeJsonData = createVO.getCreOpList();
        String fileInfoData = createVO.getFileInfo();

        Gson gson = new Gson();
        List<String> typeList = (List) gson.fromJson(codeJsonData, List.class);
        List<Map<String, String>> fileInfoList = (List) gson.fromJson(fileInfoData, List.class);

        int index = 1;
        for(Map<String, String> file : fileInfoList) {
            FileVO fileVO = new FileVO();
            fileVO.setProductId(productId);
            fileVO.setRealpath(file.get("realpath"));
            fileVO.setOrgName(file.get("orgName"));
            fileVO.setSaveName(file.get("saveName"));
            fileVO.setSizeInBytes(String.valueOf(file.get("sizeInBytes")));
            fileVO.setFileOrd(String.valueOf(index++));
            fileVO.setUserId(userId);
            this.mapMapper.insertFileInfo(fileVO);
        }

        for(String option : typeList) {
            OptionVO optionVO = new OptionVO();
            optionVO.setProductId(productId);
            optionVO.setOption(option);
            optionVO.setUserId(userId);
            this.mapMapper.insertProductOptionInfo(optionVO);
        }

        ProductVO productVO = new ProductVO();
        productVO.setProductId(productId);
        productVO.setCreProNm(createVO.getCreProNm());
        productVO.setCreAddress(createVO.getCreAddress());
        productVO.setCreR(createVO.getCreR());
        productVO.setCreMemo(createVO.getCreMemo());
        productVO.setCreLog(createVO.getCreLog());
        productVO.setCreLat(createVO.getCreLat());
        productVO.setCrePhoneNum(createVO.getCrePhoneNum());
        productVO.setUserId(userId);

        return mapMapper.insertProductInfo(productVO);
    }

    // 매물 수정
    public boolean modifyProductInfo(CreateVO createVO) {
        String userId = "guest";

        String codeJsonData = createVO.getModyOpList().toString();
        String fileInfoData = createVO.getFileInfo().toString();

        Gson gson = new Gson();
        List<String> typeList = (List) gson.fromJson(codeJsonData, List.class);
        List<Map<String, String>> fileInfoList = (List) gson.fromJson(fileInfoData, List.class);

        mapMapper.deleteProductFileInfo(createVO.getProductId());

        int index = 1;
        for(Map<String, String> file : fileInfoList) {
            FileVO fileVO = new FileVO();
            fileVO.setProductId(createVO.getProductId());
            fileVO.setRealpath(file.get("realpath"));
            fileVO.setOrgName(file.get("orgName"));
            fileVO.setSaveName(file.get("saveName"));
            fileVO.setSizeInBytes(String.valueOf(file.get("sizeInBytes")));
            fileVO.setFileOrd(String.valueOf(index++));
            fileVO.setUserId(userId);
            this.mapMapper.insertFileInfo(fileVO);
        }

        mapMapper.deleteProductOptionInfo(createVO.getProductId());

        for(String option : typeList) {
            OptionVO optionVO = new OptionVO();
            optionVO.setProductId(createVO.getProductId());
            optionVO.setOption(option);
            optionVO.setUserId(userId);
            this.mapMapper.insertProductOptionInfo(optionVO);
        }

        ProductVO productVO = new ProductVO();
        productVO.setCreProNm(createVO.getModyProNm());
        productVO.setCreAddress(createVO.getModyAddress());
        productVO.setCreR(createVO.getModyR());
        productVO.setCreMemo(createVO.getModyMemo());
        productVO.setCreLog(createVO.getCreLog());
        productVO.setCreLat(createVO.getCreLat());
        productVO.setCrePhoneNum(createVO.getModyPhoneNum());
        productVO.setProductYn(createVO.getModyYN());
        productVO.setUserId(userId);
        productVO.setProductId(createVO.getProductId());

        mapMapper.updateProductHistInfo(productVO);

        return mapMapper.updateProductInfo(productVO);
    }

    // 매물 삭제
    public boolean deleteProductInfo(CreateVO createVO) {
        List<FileVO> fileList = mapMapper.getProductFileList(createVO.getProductId());

        for(FileVO fileVO:fileList) {
            File deleteFile = new File(fileVO.getFilePath()+""+fileVO.getStorFileNm());
            if(deleteFile.exists()){
                deleteFile.delete();
            }
        }
        mapMapper.deleteProductInfo_Hs(createVO.getProductId());
        return mapMapper.deleteProductInfo(createVO.getProductId());
    }

    // 첨부파일 저장
    public List<Map<String, Object>> fileSave(MultipartHttpServletRequest multipartHttpServletRequest) {
        List<Map<String, Object>> fileList = new ArrayList<Map<String, Object>>();

        Iterator<String> fileNames = multipartHttpServletRequest.getFileNames();

        JSONObject jsonObject = new JSONObject();

        while (fileNames.hasNext()) {
            jsonObject = new JSONObject();
            MultipartFile file = multipartHttpServletRequest.getFile((String) fileNames.next());
            Long fileSize = Long.valueOf(file.getSize());
            if (fileSize.longValue() > this.maxSize.longValue()) {
                throw new MaxUploadSizeExceededException(fileSize.longValue());
            }
            try {
                String orgname = file.getOriginalFilename();
                String fileExt = orgname.substring(orgname.lastIndexOf(".") + 1, orgname.length());
                String uidFileName = UUID.randomUUID().toString().replaceAll("-", "");
                String fileSaveName = String.valueOf(uidFileName) + "." + fileExt;
                if (file.getName().equals("file-999")) {
                    jsonObject.put("viewYn", "Y");
                } else {
                    jsonObject.put("viewYn", "N");
                }
                jsonObject.put("contentType", file.getContentType());
                jsonObject.put("sizeInBytes", fileSize);
                jsonObject.put("orgName", orgname);
                jsonObject.put("saveFullName", String.valueOf(uidFileName) + "." + fileExt);
                jsonObject.put("saveName", String.valueOf(uidFileName) + "." + fileExt);
                jsonObject.put("realpath", this.filePath);
                FileSystemResource fsResource = new FileSystemResource(this.filePath);
                if (!fsResource.exists()) {
                    fsResource.getFile().mkdirs();
                }
                byte[] bytes = file.getBytes();
                BufferedOutputStream stream = new BufferedOutputStream(
                        new FileOutputStream(new File(String.valueOf(fsResource.getPath()) + fileSaveName)));
                try {
                    stream.write(bytes);
                } catch (Exception exception) {
                } finally {
                    stream.close();
                }
                fileList.add(jsonObject);
            } catch (Exception e) {
                e.printStackTrace();
                log.error("파일업로드 오류 : ", e);
            }
        }
        return fileList;
    }
}
