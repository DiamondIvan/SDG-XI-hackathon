import React, { useState } from 'react';
import MapComponent from './MapComponent';
import AutocompleteInput from './AutocompleteInput';

function GreenRouteDemo() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState(['']);
  const [routes, setRoutes] = useState([]); // Changed from 'result' to 'routes'
  const [selectedRoute, setSelectedRoute] = useState(null); // New state for selected route
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleStopChange = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const addStop = () => {
    setStops([...stops, '']);
  };

  const removeStop = (index) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
  };

  const handleReverse = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const handleClick = () => {
    setLoading(true);
    setRoutes([]); // Clear previous routes
    setSelectedRoute(null); // Clear selected route
    setError('');

    const waypoints = stops.filter(stop => stop.trim() !== '').join('|');
    let url = `http://localhost:8080/route?origin=${origin}&destination=${destination}`;
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("Data received from backend:", data); // Add this line
        if (data && Array.isArray(data) && data.length > 0) {
            // Check if it's an error message disguised as a single-element array
            if (data.length === 1 && data[0].content && data[0].content.startsWith('Error')) {
                setError(data[0].content);
                setRoutes([]);
                setSelectedRoute(null);
            } else {
                setRoutes(data);
                setSelectedRoute(data[0]); // Select the first route by default
            }
        } else {
            setError('No routes found or unexpected data format.');
            setRoutes([]);
            setSelectedRoute(null);
        }
      })
      .catch(() => setError('Error fetching data. Is the backend running?'))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Green Route Demo</h2>
      <p>Find the shortest route by distance to save fuel and get AI predictions.</p>

      <div>
        <label>Origin:</label>
        <AutocompleteInput value={origin} onChange={setOrigin} onKeyDown={handleKeyPress} placeholder="e.g., Kuala Lumpur"/>
      </div>

      <button onClick={handleReverse} style={{ margin: '10px 0' }}>Reverse</button>

      <div>
        <label>Destination:</label>
        <AutocompleteInput value={destination} onChange={setDestination} onKeyDown={handleKeyPress} placeholder="e.g., Johor Bahru"/>
      </div>

      <div>
        <label>Stops:</label>
        {stops.map((stop, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <AutocompleteInput 
                value={stop} 
                onChange={value => handleStopChange(index, value)} 
                onKeyDown={handleKeyPress} 
                placeholder={`Stop ${index + 1}`}
              />
            </div>
            <button onClick={() => removeStop(index)} style={{ marginLeft: '10px' }}>Remove</button>
          </div>
        ))}
        <button onClick={addStop} style={{ marginTop: '10px' }}>Add Stop</button>
      </div>

      <button onClick={handleClick} disabled={loading} style={{ marginTop: '20px' }}>
        {loading ? 'Finding Route...' : 'Get Green Routes'}
      </button>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <div style={{ flex: 1, height: '500px', marginRight: '20px' }}>
          {routes.length > 0 ? ( // Check if there are any routes to display
            <MapComponent routes={routes} selectedRoute={selectedRoute} />
          ) : (
            <div style={{ textAlign: 'center', paddingTop: '50px' }}>Map will appear here after fetching a route</div>
          )}
        </div>

        {routes.length > 0 && (
          <div style={{ flex: 1, maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            <h3>Alternative Routes:</h3>
            {routes.map(route => (
              <div 
                key={route.routeNumber} 
                style={{ 
                  padding: '10px', 
                  marginBottom: '10px', 
                  border: '1px solid #eee', 
                  cursor: 'pointer',
                  backgroundColor: selectedRoute && selectedRoute.routeNumber === route.routeNumber ? '#e6f7ff' : 'white'
                }}
                onClick={() => {
                  console.log("Route selected:", route);
                  setSelectedRoute(route);
                }}
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
        <div style={{ marginTop: '20px' }}>
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

