package com.example.backend.route;

import com.google.maps.model.DirectionsResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/route")
public class RouteController {

    @Autowired
    private DirectionsService directionsService;

    @Autowired
    private AIGreenRouteService aiGreenRouteService;

    @GetMapping
    public List<RouteResponse> getRoute(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam(required = false) String waypoints
    ) {
        try {
            String[] waypointArray = (waypoints != null && !waypoints.isEmpty()) ? waypoints.split("\\|") : new String[0];
            DirectionsResult directions = directionsService.getDirections(origin, destination, waypointArray);

            if (directions == null || directions.routes == null || directions.routes.length == 0) {
                List<RouteResponse> errorResponses = new ArrayList<>();
                RouteResponse error = new RouteResponse();
                error.setContent("Error: No routes found or unexpected data format.");
                errorResponses.add(error);
                return errorResponses;
            }

            return aiGreenRouteService.processRoutes(directions);

        } catch (Exception e) {
            List<RouteResponse> errorResponses = new ArrayList<>();
            RouteResponse error = new RouteResponse();
            error.setContent("Error: " + e.getMessage());
            errorResponses.add(error);
            e.printStackTrace(); // Log the exception for debugging
            return errorResponses;
        }
    }
}
