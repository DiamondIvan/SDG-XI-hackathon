import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapComponent = ({ routes, selectedRoute }) => {
  if (!routes || routes.length === 0) {
    return <div style={{ textAlign: 'center', paddingTop: '50px' }}>Map will appear here after fetching a route</div>;
  }

  // Use the coordinates of the selected route for centering, or the first route if none selected
  const centerRoute = selectedRoute || routes[0];
  const center = centerRoute.coordinates[0];

  return (
    <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      
      {routes.map((route, index) => {
        const routeCoordinates = route.coordinates.map(coord => [coord.lat, coord.lng]);
        // Determine line color: green for selected green route, red for selected red route, grey for unselected routes
        const lineColor = (selectedRoute && selectedRoute.routeNumber === route.routeNumber)
                          ? (route.color === 'green' ? 'green' : 'red')
                          : 'grey'; // Default to grey for unselected routes
        const weight = (selectedRoute && selectedRoute.routeNumber === route.routeNumber) ? 5 : 3; // Thicker for selected route

        return (
          <Polyline 
            key={route.routeNumber} 
            positions={routeCoordinates} 
            color={lineColor} 
            weight={weight} 
            opacity={0.7}
          />
        );
      })}

      {selectedRoute && (
        <>
          <Marker position={selectedRoute.coordinates[0]}><Popup>Origin</Popup></Marker>
          <Marker position={selectedRoute.coordinates[selectedRoute.coordinates.length - 1]}><Popup>Destination</Popup></Marker>
          
          {selectedRoute.waypoints && selectedRoute.waypoints.map((waypoint, index) => (
            <Marker key={index} position={[waypoint.lat, waypoint.lng]}>
              <Popup>Stop {index + 1}</Popup>
            </Marker>
          ))}
        </>
      )}
    </MapContainer>
  );
};

export default MapComponent;
