package com.example.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// 1. Tells Spring this class handles web requests (REST endpoints)
@RestController
public class StatusController {

    // 2. Maps HTTP GET requests to the root path (http://localhost:8080/)
    @GetMapping("/")
    public String checkStatus() {
        return "Backend Application is Running Successfully!";
    }

    // 3. Maps HTTP GET requests to a test path (http://localhost:8080/hello)
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello World from Spring Boot!";
    }
}