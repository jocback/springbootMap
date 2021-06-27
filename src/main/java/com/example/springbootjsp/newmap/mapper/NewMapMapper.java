package com.example.springbootjsp.newmap.mapper;

import com.example.springbootjsp.newmap.vo.NewFileVO;
import com.example.springbootjsp.newmap.vo.NewOptionVO;
import com.example.springbootjsp.newmap.vo.NewProductVO;
import com.example.springbootjsp.newmap.vo.NewSearchVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface NewMapMapper {

    // 매물 시퀀스 조회
    String selectProductId();

    // 매물조회
    List<NewProductVO> selectProductList(NewSearchVO searchData);

    // 매물등록
    boolean insertProductInfo(NewProductVO productVO);

    // 매물 수정
    boolean updateProductInfo(NewProductVO productVO);

    // 매물 삭제
    boolean deleteProductInfo(String productId);

    // 옵션등록
    boolean insertProductOptionInfo(NewOptionVO optionVO);

    // 옵션삭제
    boolean deleteProductOptionInfo(String productId);

    // 매물 히스토리 등록
    boolean updateProductHistInfo(NewProductVO productVO);

    // 매물 히스토리 삭제
    boolean deleteProductInfo_Hs(String productId);

    // 파일 조회
    List<NewFileVO> getProductFileList(String productId);

    // 파일 상세조회
    NewFileVO getFileInfo(NewFileVO param);

    // 파일등록
    boolean insertFileInfo(NewFileVO fileVO);

    // 파일 삭제
    boolean deleteProductFileInfo(String productId);



}
