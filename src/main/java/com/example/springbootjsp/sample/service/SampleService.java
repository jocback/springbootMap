package com.example.springbootjsp.sample.service;

import com.example.springbootjsp.sample.mapper.SampleMapper;
import com.example.springbootjsp.sample.vo.SampleVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SampleService {

    @Autowired
    public SampleMapper mapper;

    public List<SampleVO> selectTest() {
        return mapper.selectTest();
    }

    public String selectUserNm() {
        return mapper.selectUserNm();
    }
}
