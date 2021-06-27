package com.example.springbootjsp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/imgFolder/**")
                .addResourceLocations("file:///C:/tempFolder/");
//                .addResourceLocations("file:///C:/centos/images/");
//        registry.addResourceHandler("/static/img/")
//                .addResourceLocations("file:///C:/tempFolder/")
//                .setCachePeriod(3600)
//                .resourceChain(true)
//                .addResolver(new PathResourceResolver());
    }
}
