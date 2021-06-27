package com.example.springbootjsp.map.mapper;

import com.example.springbootjsp.map.vo.FileVO;
import com.example.springbootjsp.map.vo.OptionVO;
import com.example.springbootjsp.map.vo.ProductVO;
import com.example.springbootjsp.map.vo.SearchVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface MapMapper {

    // 매물 시퀀스 조회
    String selectProductId();

    // 매물조회
    List<ProductVO> selectProductList(SearchVO searchData);

    // 매물등록
    boolean insertProductInfo(ProductVO productVO);

    // 매물 수정
    boolean updateProductInfo(ProductVO productVO);

    // 매물 삭제
    boolean deleteProductInfo(String productId);

    // 옵션등록
    boolean insertProductOptionInfo(OptionVO optionVO);

    // 옵션삭제
    boolean deleteProductOptionInfo(String productId);

    // 매물 히스토리 등록
    boolean updateProductHistInfo(ProductVO productVO);

    // 매물 히스토리 삭제
    boolean deleteProductInfo_Hs(String productId);

    // 파일 조회
    List<FileVO> getProductFileList(String productId);

    // 파일 상세조회
    FileVO getFileInfo(FileVO param);

    // 파일등록
    boolean insertFileInfo(FileVO fileVO);

    // 파일 삭제
    boolean deleteProductFileInfo(String productId);



}
