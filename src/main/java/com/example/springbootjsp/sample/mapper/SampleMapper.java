package com.example.springbootjsp.sample.mapper;

import com.example.springbootjsp.sample.vo.SampleVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface SampleMapper {
    List<SampleVO> selectTest();

    String selectUserNm();
}
