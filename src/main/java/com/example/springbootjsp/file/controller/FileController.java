package com.example.springbootjsp.file.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

@Controller
public class FileController {

    @PostMapping("/file/upload")
    public String uploadFile(@RequestParam("files")MultipartFile file) throws Exception {
        String rootPath = "C:";
        String basePath = rootPath + "/" + "tempFolder";

        String filePath = basePath + "/" + file.getOriginalFilename();

        File dest = new File(filePath);
        file.transferTo(dest);

        return "uploaaded";
    }

    @GetMapping("/file/sendFile")
    public String sendFile() throws Exception {

        URL url = new URL("/file/upload");
        HttpURLConnection con = (HttpURLConnection)url.openConnection();
        con.setDoOutput(true);
        con.setRequestMethod("POST");
        String fileName = "파일경로+파일네임.zip";
        return "";
    }


}
