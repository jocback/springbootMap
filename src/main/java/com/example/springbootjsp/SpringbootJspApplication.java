package com.example.springbootjsp;


import com.example.springbootjsp.config.SiteMeshConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

import javax.servlet.FilterRegistration;

@SpringBootApplication
public class SpringbootJspApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootJspApplication.class, args);
    }

//    @Bean
//    public FilterRegistrationBean<SiteMeshConfig> siteMeshFilter() {
//        FilterRegistrationBean<SiteMeshConfig> filter = new FilterRegistrationBean<SiteMeshConfig>();
//        filter.setFilter(new SiteMeshConfig());
//        return filter;
//    }


}
