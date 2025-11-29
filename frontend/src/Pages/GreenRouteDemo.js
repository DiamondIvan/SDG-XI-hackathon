import React, { useState } from 'react';
import MapComponent from './MapComponent';
import AutocompleteInput from './AutocompleteInput';
import CO2Calculator from './CO2Calculator';
import './CssPages/GreenRouteDemo.css';

function GreenRouteDemo() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState(['']);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const truncateText = (text, maxLength) =>
    !text ? '' : text.length <= maxLength ? text : text.substring(0, maxLength) + '...';

  const generateWazeUrl = (route) => {
    if (!route?.coordinates?.length) return '';
    const dest = route.coordinates.at(-1);
    return `waze://?ll=${dest.lat},${dest.lng}&navigate=yes`;
  };

  const generateGoogleMapsUrl = (route) => {
    if (!route?.coordinates?.length) return '';

    const originLatLng = route.coordinates[0];
    const destLatLng = route.coordinates.at(-1);

    let waypointsParam = '';
    if (route.waypoints?.length > 0) {
      waypointsParam =
        '&waypoints=' + route.waypoints.map(wp => `${wp.lat},${wp.lng}`).join('|');
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${originLatLng.lat},${originLatLng.lng}&destination=${destLatLng.lat},${destLatLng.lng}${waypointsParam}`;
  };

  const handleStopChange = (index, value) => {
    const updated = [...stops];
    updated[index] = value;
    setStops(updated);
  };

  const addStop = () => setStops([...stops, '']);
  const removeStop = (index) => setStops(stops.filter((_, i) => i !== index));

  const handleReverse = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleClick();
  };

  const handleClick = () => {
    setLoading(true);
    setRoutes([]);
    setSelectedRoute(null);
    setError('');

    const waypoints = stops.filter(s => s.trim() !== '').join('|');

    let url = `https://sdghackathon-1-173683223586.asia-southeast1.run.app/route?origin=${origin}&destination=${destination}`;
    if (waypoints) url += `&waypoints=${waypoints}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data?.length > 0) {
          if (data.length === 1 && data[0].content?.startsWith('Error')) {
            setError(data[0].content);
          } else {
            setRoutes(data);
            setSelectedRoute(data[0]);
          }
        } else {
          setError('No routes found or unexpected data format.');
        }
      })
      .catch(() => setError('Error fetching data. Is the backend running?'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="style">

      {/* ===========================
          HEADER HERO SECTION
      ============================ */}
      <div className="hero-header">

        <h1 className="font">Green Route Finder</h1>
        <p className="desc">
          Discover eco-friendly routes that save fuel, reduce emissions, and get AI-powered
          insights for smarter travel decisions.
        </p>
      </div>

      {/* ===========================
           MAIN CONTENT
      ============================ */}
      <div className="main-content-container">

        {/* LEFT PANEL — Plan Your Journey */}
        <div className="input-panel">

          <h3 style={{ marginTop: 0, marginBottom: '20px', fontWeight: 700, color: '#2c3e50' }}>
            Plan Your Journey
          </h3>

          {/* ORIGIN */}
          <div className="origin">
            <label>Starting Point</label>
            <div className="input-card">
              <AutocompleteInput
                value={origin}
                onChange={setOrigin}
                onKeyDown={handleKeyPress}
                placeholder="Enter your origin location..."
              />
            </div>
          </div>

          {/* Reverse + Add Stop */}
          <div className="reverse-addstop-container">
            <button onClick={handleReverse}>Swap</button>
            <button onClick={addStop}>Add Stop</button>
          </div>

          {/* DESTINATION */}
          <div className="destination">
            <label>Destination</label>
            <div className="input-card">
              <AutocompleteInput
                value={destination}
                onChange={setDestination}
                onKeyDown={handleKeyPress}
                placeholder="Enter your destination location..."
              />
            </div>
          </div>

          {/* STOPS */}
          <div className="stops-container">
            <label>Stops</label>
            {stops.map((stop, i) => (
              <div className="input-card" key={i}>
                <AutocompleteInput
                  value={stop}
                  onChange={(val) => handleStopChange(i, val)}
                  onKeyDown={handleKeyPress}
                  placeholder={`Stop ${i + 1}`}
                />
                <button onClick={() => removeStop(i)}>Remove</button>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button onClick={handleClick} disabled={loading}>
            {loading ? 'Finding Route...' : 'Find Green Routes'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        {/* RIGHT PANEL — Map + Routes */}
        <div className="display-panel">

          <div className="map-routes-container">

            {/* Map */}
            <div className="map-container">
              {selectedRoute ? (
                <MapComponent route={selectedRoute} />
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                  }}
                >
                  <div style={{ fontSize: '70px' }}>📍</div>
                  <p>Your route map will appear here</p>
                  <small>Enter origin and destination to get started</small>
                </div>
              )}
            </div>

            {/* Routes list */}
            {routes.length > 0 && (
              <div className="routes-list">
                <h3>Alternative Routes</h3>

                {routes.map((route) => (
                  <div
                    key={route.routeNumber}
                    className={
                      selectedRoute?.routeNumber === route.routeNumber ? 'selected' : ''
                    }
                    onClick={() => setSelectedRoute(route)}
                  >
                    <h4>
                      Route {route.routeNumber}
                      {route.color && (
                        <span
                          style={{
                            marginLeft: '10px',
                            height: '12px',
                            width: '12px',
                            backgroundColor: route.color,
                            borderRadius: '50%',
                            display: 'inline-block'
                          }}
                        ></span>
                      )}
                    </h4>
                    <p>
                      {route.distance} • {route.duration} • {route.fuelUsed}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom section — Selected Route details */}
          {selectedRoute && (
            <div className="selected-route-details">
              <h3>Selected Route</h3>

              <CO2Calculator
                distance={selectedRoute.distance}
                duration={selectedRoute.duration}
                fuelUsed={selectedRoute.fuelUsed}
              />

              <div className="ai-prediction">
                <strong>AI Insight:</strong>
                <ul>
                  {selectedRoute.fuelSavingPrediction && selectedRoute.fuelSavingPrediction.split('\n').filter(line => line.trim() !== '').map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              </div>

              <div className="navigation-buttons">
                <button
                  onClick={() => window.open(generateWazeUrl(selectedRoute), '_blank')}
                >
                  Open in Waze
                </button>
                <button
                  onClick={() => window.open(generateGoogleMapsUrl(selectedRoute), '_blank')}
                >
                  Open in Google Maps
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GreenRouteDemo;
