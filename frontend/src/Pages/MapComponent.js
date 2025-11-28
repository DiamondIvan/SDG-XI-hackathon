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

const MapComponent = ({ route }) => {
  if (!route || !route.coordinates || route.coordinates.length === 0) {
    return <div style={{ textAlign: 'center', paddingTop: '50px' }}>Map will appear here after fetching a route</div>;
  }

  const routeCoordinates = route.coordinates.map(coord => [coord.lat, coord.lng]);
  const center = routeCoordinates[0];
  const lineColor = route.color === 'green' ? 'green' : 'red'; // Use route.color, default to red

  return (
    <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={routeCoordinates[0]}><Popup>Origin</Popup></Marker>
      <Marker position={routeCoordinates[routeCoordinates.length - 1]}><Popup>Destination</Popup></Marker>
      
      {route.waypoints && route.waypoints.map((waypoint, index) => (
        <Marker key={index} position={[waypoint.lat, waypoint.lng]}>
          <Popup>Stop {index + 1}</Popup>
        </Marker>
      ))}

      <Polyline positions={routeCoordinates} color={lineColor} />
    </MapContainer>
  );
};

export default MapComponent;
