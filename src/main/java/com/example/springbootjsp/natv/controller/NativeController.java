package com.example.springbootjsp.natv.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class NativeController {
    // 매물조회 페이지
    @RequestMapping(value="/natv/native", method = RequestMethod.GET)
    public String home(Model model) {
        model.addAttribute("name", "map");
        return "/natv/native";
    }
}
