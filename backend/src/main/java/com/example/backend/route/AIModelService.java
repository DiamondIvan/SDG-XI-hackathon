package com.example.backend.route;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.core.ParameterizedTypeReference;

import java.util.List;
import java.util.Map;

@Service
public class AIModelService {

  @Value("${gemini.api.key}")
  private String apiKey;

  @Value("${gemini.model:gemini-2.0-flash-lite}")
  private String model;

  private final RestTemplate restTemplate = new RestTemplate();

  /**
   * Sends user message to Gemini AI and returns the AI response.
   * 
   * @param userMessage The message from the user
   * @return AI response text
   */
  public String getAIResponse(String userMessage) {
    if (userMessage == null || userMessage.isBlank()) {
      return "Please provide a valid message.";
    }

    try {
      // Gemini AI REST endpoint
      String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;

      // Build JSON payload
      String payload = """
          {
            "contents": [{"parts": [{"text": "%s"}]}],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 256
            }
          }
          """.formatted(userMessage);

      // Set headers
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      // Removed setBearerAuth, as API key is now in the URL

      HttpEntity<String> entity = new HttpEntity<>(payload, headers);

      // Make POST request
      ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
          url,
          HttpMethod.POST,
          entity,
          new ParameterizedTypeReference<Map<String, Object>>() {
          });

      Map<String, Object> body = response.getBody();
      if (body != null && body.containsKey("candidates")) {
        Object candidatesObj = body.get("candidates");
        if (candidatesObj instanceof List<?> candidatesList && !candidatesList.isEmpty()) {
          Object firstCandidate = candidatesList.get(0);
          if (firstCandidate instanceof Map<?, ?> firstMap) {
            Object content = firstMap.get("content");
            if (content != null)
              return content.toString();
          }
        }
      }

      return "AI did not return a response.";

    } catch (Exception e) {
      // Log the error and return a friendly message
      e.printStackTrace();
      return "Error contacting AI: " + e.getMessage();
    }
  }
}
