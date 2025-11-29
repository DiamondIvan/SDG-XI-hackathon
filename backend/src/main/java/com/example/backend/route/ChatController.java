package com.example.backend.route;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = { "http://localhost:3000", "https://sdghackathon-frontend.vercel.app" }) // change if frontend
                                                                                                // runs elsewhere
public class ChatController {

    @Autowired
    private AIModelService aiService;

    @PostMapping
    public String ask(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        return aiService.getAIResponse(userMessage);
    }
}
