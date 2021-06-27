package com.example.springbootjsp.JavaTest;

import java.io.File;

public class FileDelete {
    public static void main(String[] args) {
        File file = new File("C:/tempFolder/sample10f_1_1 - 복사본.png");
        if(file.exists()){
            file.delete();
        }
    }
}
