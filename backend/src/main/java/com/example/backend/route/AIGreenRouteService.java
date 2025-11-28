package com.example.backend.route;

import com.google.maps.model.DirectionsResult;
import com.google.maps.model.DirectionsRoute;
import com.google.maps.internal.PolylineEncoding;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AIGreenRouteService {

    @Autowired
    private AIModelService aiModelService;

    public DirectionsResult findBestRoute(DirectionsResult directionsResult) {
        // For now, simply return the original directionsResult.
        // The logic to determine the "best" route based on AI prediction will be implemented here.
        processRoutes(directionsResult); // Process the routes to get AI predictions
        return directionsResult;
    }

    public List<RouteResponse> processRoutes(DirectionsResult result) {
        List<RouteResponse> routeResponses = new ArrayList<>();

        if (result == null || result.routes == null || result.routes.length == 0) {
            return routeResponses;
        }

        int routeNumber = 1;
        for (DirectionsRoute route : result.routes) {
            String distance = "N/A";
            String duration = "N/A";
            long distanceMeters = 0;
            long durationSeconds = 0;

            if (route.legs != null && route.legs.length > 0) {
                distance = route.legs[0].distance.humanReadable;
                duration = route.legs[0].duration.humanReadable;
                distanceMeters = route.legs[0].distance.inMeters;
                durationSeconds = route.legs[0].duration.inSeconds;
            }

            // Create a prompt for the AI model
            String prompt = String.format("Given a route with distance %d meters and duration %d seconds, how much fuel (in liters) would typically be consumed by an average car? Also, classify this route's fuel efficiency as 'green' if it's highly efficient, or 'red' if it's not. Provide the answer in the format: 'Fuel: X liters, Efficiency: [green/red]'.",
                    distanceMeters, durationSeconds);

            String aiResponse = aiModelService.getAIResponse(prompt);

            String fuelPrediction = "N/A";
            String efficiencyColor = "red"; // Default to red

            // Parse AI response
            if (aiResponse != null && !aiResponse.isEmpty()) {
                Pattern fuelPattern = Pattern.compile("Fuel: ([\\d.]+) liters");
                Matcher fuelMatcher = fuelPattern.matcher(aiResponse);
                if (fuelMatcher.find()) {
                    fuelPrediction = fuelMatcher.group(1) + " liters";
                }

                if (aiResponse.toLowerCase().contains("efficiency: green")) {
                    efficiencyColor = "green";
                }
            }

            RouteResponse routeResponse = new RouteResponse();
            routeResponse.setRouteNumber(routeNumber++);
            routeResponse.setDistance(distance);
            routeResponse.setDuration(duration);
            routeResponse.setFuelUsed(fuelPrediction); // Using AI prediction for fuel used
            routeResponse.setFuelSavingPrediction(aiResponse); // Store the raw AI response
            routeResponse.setColor(efficiencyColor);

            List<RouteResponse.LatLng> pathCoordinates = new ArrayList<>();
            if (route.overviewPolyline != null && route.overviewPolyline.getEncodedPath() != null) {
                List<com.google.maps.model.LatLng> decodedPath = PolylineEncoding.decode(route.overviewPolyline.getEncodedPath());
                for (com.google.maps.model.LatLng latLng : decodedPath) {
                    pathCoordinates.add(new RouteResponse.LatLng(latLng.lat, latLng.lng));
                }
            }
            routeResponse.setCoordinates(pathCoordinates);

            routeResponses.add(routeResponse);
        }

        return routeResponses;
    }
}