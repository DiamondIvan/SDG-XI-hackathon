package com.example.backend.route;

import java.util.List;

public class RouteResponse {
    private String content;
    private String distance;
    private String duration;
    private String fuelUsed;
    private String fuelSavingPrediction; // New field for AI prediction
    private int routeNumber;             // New field for route identification
    private String color;                // New field for route efficiency color
    private List<LatLng> coordinates;
    private List<LatLng> waypoints;

    public static class LatLng {
        private double lat;
        private double lng;


        public LatLng(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public double getLat() {
            return lat;
        }

        public double getLng() {
            return lng;
        }
    }

    // Getters and setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getFuelUsed() {
        return fuelUsed;
    }

    public void setFuelUsed(String fuelUsed) {
        this.fuelUsed = fuelUsed;
    }

    public String getFuelSavingPrediction() {
        return fuelSavingPrediction;
    }

    public void setFuelSavingPrediction(String fuelSavingPrediction) {
        this.fuelSavingPrediction = fuelSavingPrediction;
    }

    public int getRouteNumber() {
        return routeNumber;
    }

    public void setRouteNumber(int routeNumber) {
        this.routeNumber = routeNumber;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public List<LatLng> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<LatLng> coordinates) {
        this.coordinates = coordinates;
    }

    public List<LatLng> getWaypoints() {
        return waypoints;
    }

    public void setWaypoints(List<LatLng> waypoints) {
        this.waypoints = waypoints;
    }
}
