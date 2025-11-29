package com.example.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CO2Controller {

    // Allow CORS for frontend running on another port
    @CrossOrigin(origins = { "http://localhost:3000", "https://sdghackathon-frontend.vercel.app" })
    @PostMapping("/calculate-co2")
    public Map<String, Double> calculateCO2(@RequestBody CO2Request request) {
        double emissionFactor = getEmissionFactor(request.getTransportType());
        double co2 = (request.getDistance() * emissionFactor) / Math.max(1, request.getPassengers());

        Map<String, Double> result = new HashMap<>();
        result.put("co2", co2);
        return result;
    }

    private double getEmissionFactor(String transportType) {
        if (transportType == null)
            return 0;
        switch (transportType.toLowerCase()) {
            case "corolla":
                return 0.14;
            case "camry":
                return 0.18;
            case "myvi":
                return 0.11;
            case "honda city":
                return 0.16;
            case "city":
                return 0.14;
            case "focus":
                return 0.15;
            case "ranger":
                return 0.22;
            case "golf":
                return 0.15;
            case "persona":
                return 0.13;
            case "proton x70":
                return 0.18;
            case "nissan almera":
                return 0.14;
            case "nissan x-trail":
                return 0.20;
            case "mazda 3":
                return 0.15;
            case "mazda cx-5":
                return 0.17;
            case "bmw 3-series":
                return 0.18;
            case "mercedes c-class":
                return 0.18;
            case "picanto":
                return 0.12;
            case "sportage":
                return 0.19;

            default:
                return 0;
        }
    }
}