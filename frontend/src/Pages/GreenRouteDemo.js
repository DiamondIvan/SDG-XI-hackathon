import React, { useState } from 'react';
import MapComponent from './MapComponent';
import AutocompleteInput from './AutocompleteInput';
import './CssPages/GreenRouteDemo.css';

function GreenRouteDemo() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState(['']);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };

  const handleStopChange = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const addStop = () => setStops([...stops, '']);
  const removeStop = (index) => setStops(stops.filter((_, i) => i !== index));

  const handleReverse = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleClick();
  };

  const handleClick = () => {
    setLoading(true);
    setRoutes([]);
    setSelectedRoute(null);
    setError('');

    const waypoints = stops.filter(stop => stop.trim() !== '').join('|');
    let url = `http://localhost:8080/route?origin=${origin}&destination=${destination}`;
    if (waypoints) url += `&waypoints=${waypoints}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("Data received from backend:", data);
        if (data && Array.isArray(data) && data.length > 0) {
          if (data.length === 1 && data[0].content && data[0].content.startsWith('Error')) {
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
    <div className='style'>
      <div className='font'>Green Route Demo</div>
      <div className='desc'>
        <p>Find the shortest route by distance to save fuel and get AI predictions.</p>
      </div>

      <div className='origin'>
  <label>Origin:</label>
  <div className="input-card">
    <AutocompleteInput
      value={origin}
      onChange={setOrigin}
      onKeyDown={handleKeyPress}
      placeholder="Enter origin location..."
    />
  </div>
</div>

      <div className='reverse-button'>
        <button onClick={handleReverse}>Reverse</button>
      </div>

      <div className='destination'>
  <label>Destination:</label>
  <div className="input-card">
    <AutocompleteInput
      value={destination}
      onChange={setDestination}
      onKeyDown={handleKeyPress}
      placeholder="Enter destination location..."
    />
  </div>
</div>

      <div className='stops-container'>
  <label>Stops:</label>
  {stops.map((stop, index) => (
    <div className="input-card" key={index}>
      <AutocompleteInput
        value={stop}
        onChange={value => handleStopChange(index, value)}
        onKeyDown={handleKeyPress}
        placeholder={`Stop ${index + 1}`}
      />
      <button onClick={() => removeStop(index)}>Remove</button>
    </div>
  ))}
  <button onClick={addStop}>Add Stop</button>
</div>

      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Finding Route...' : 'Get Green Routes'}
      </button>

      {error && <div className='error-message'>{error}</div>}

      <div className='map-routes-container'>
        <div className='map-container'>
          {selectedRoute ? (
            <MapComponent route={selectedRoute} />
          ) : (
            <div>Map will appear here after fetching a route</div>
          )}
        </div>

        {routes.length > 0 && (
          <div className='routes-list'>
            <h3>Alternative Routes:</h3>
            {routes.map(route => (
              <div
                key={route.routeNumber}
                className={selectedRoute && selectedRoute.routeNumber === route.routeNumber ? 'selected' : ''}
                onClick={() => setSelectedRoute(route)}
              >
                <h4>
                  Route {route.routeNumber}: {route.content}
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
                      title={`Efficiency: ${route.color}`}
                    ></span>
                  )}
                </h4>
                <p><strong>Distance:</strong> {route.distance}</p>
                <p><strong>Duration:</strong> {route.duration}</p>
                <p><strong>Fuel Used:</strong> {route.fuelUsed}</p>
                <p><strong>AI Prediction:</strong> {truncateText(route.fuelSavingPrediction, 250)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRoute && (
        <div className='selected-route-details'>
          <h3>Selected Route Details:</h3>
          <p><strong>Route:</strong> {selectedRoute.content}</p>
          <p><strong>Distance:</strong> {selectedRoute.distance}</p>
          <p><strong>Duration:</strong> {selectedRoute.duration}</p>
          <p><strong>Fuel Used:</strong> {selectedRoute.fuelUsed}</p>
          <p><strong>AI Prediction:</strong> {truncateText(selectedRoute.fuelSavingPrediction, 250)}</p>
          <p><strong>Efficiency Color:</strong> <span style={{ color: selectedRoute.color, fontWeight: 'bold' }}>{selectedRoute.color ? selectedRoute.color.toUpperCase() : 'N/A'}</span></p>
        </div>
      )}
    </div>
  );
}

export default GreenRouteDemo;
