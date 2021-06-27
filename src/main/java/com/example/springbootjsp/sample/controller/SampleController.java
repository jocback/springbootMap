package com.example.springbootjsp.sample.controller;

import com.example.springbootjsp.sample.service.SampleService;
import com.example.springbootjsp.sample.vo.SampleVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class SampleController {

    @Autowired
    SampleService sampleService;

    @RequestMapping(value="/sample", method = RequestMethod.GET)
    public String home(Model model) {

        List<SampleVO> sampleList = sampleService.selectTest();

        System.out.println("List size : "+sampleList.size());

        System.out.println("home controller start");
        model.addAttribute("name", "HomeController");
        model.addAttribute("list", sampleList);
        return "index";
    }

    @RequestMapping(value="/sample/userList", method=RequestMethod.POST)
    @ResponseBody
    public List<SampleVO> userList() {
        List<SampleVO> sampleList = sampleService.selectTest();
        return sampleList;
    }
}
