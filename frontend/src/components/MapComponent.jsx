import React, { useEffect, useRef } from 'react';

const MapComponent = ({ locations, onMarkerClick, height = '500px', center = { lat: 19.7515, lng: 75.7139 }, zoom = 7, onMapLoad }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Initialize Mapbox map
    if (window.mapboxgl) {
      initializeMap();
    } else {
      // Load Mapbox GL JS
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.onload = () => {
        window.mapboxgl.accessToken = 'pk.eyJ1Ijoia2FyYW54YSIsImEiOiJjbWRmb3R5ZmIwZHQwMmpxeGh1dGRkcjJwIn0.QgzAWXMc3YAvSeXSF-Yymg';
        initializeMap();
      };
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Update markers when locations change
    if (mapInstanceRef.current && locations) {
      updateMarkers();
    }
  }, [locations]);

  const initializeMap = () => {
    if (!mapRef.current || !window.mapboxgl) return;
    
    window.mapboxgl.accessToken = 'pk.eyJ1Ijoia2FyYW54YSIsImEiOiJjbWRmb3R5ZmIwZHQwMmpxeGh1dGRkcjJwIn0.QgzAWXMc3YAvSeXSF-Yymg';
    
    // Create map instance
    mapInstanceRef.current = new window.mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [center.lng, center.lat],
      zoom: zoom
    });
    
    // Add markers after map loads
    mapInstanceRef.current.on('load', () => {
      updateMarkers();
      if (onMapLoad) onMapLoad(mapInstanceRef.current);
    });
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !locations || !window.mapboxgl) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add new markers
    locations.forEach(location => {
      if (!location.coordinates) return;
      
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'mapbox-marker';
      markerEl.style.cssText = `
        background-color: #3B82F6;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;
      
      // Create marker
      const marker = new window.mapboxgl.Marker(markerEl)
        .setLngLat([location.coordinates.lng, location.coordinates.lat])
        .addTo(mapInstanceRef.current);
      
      // Create popup
      const popup = new window.mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-weight: 500; margin-bottom: 4px; font-size: 14px;">${location.name || location.title}</h3>
            ${location.address ? `<p style="font-size: 12px; margin: 0; color: #666;">${location.address}</p>` : ''}
            ${location.phone ? `<p style="font-size: 12px; margin: 4px 0 0; color: #666;">${location.phone}</p>` : ''}
            ${location.capacity ? `<p style="font-size: 12px; margin: 2px 0 0; color: #666;">Capacity: ${location.capacity}</p>` : ''}
          </div>
        `);
      
      // Add click event
      markerEl.addEventListener('click', () => {
        popup.addTo(mapInstanceRef.current);
        if (onMarkerClick) onMarkerClick(location.id);
      });
      
      markersRef.current.push(marker);
    });
  };

  return (
    <div ref={mapRef} style={{ width: '100%', height }} className="mapbox-map"></div>
  );
};

export default MapComponent;