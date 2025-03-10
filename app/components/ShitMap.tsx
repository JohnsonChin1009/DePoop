/// <reference types="google.maps" />

'use client';

import { useEffect, useRef, useState } from 'react';
import { useLogs } from '../contexts/LogContext';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';

// Add this at the top of your file
declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof google.maps.Map;
        Marker: typeof google.maps.Marker;
        InfoWindow: typeof google.maps.InfoWindow;
        LatLngBounds: typeof google.maps.LatLngBounds;
      }
    }
  }
}

type BlockchainLog = {
  user: string;
  latitude: number;
  longitude: number;
  sessionDuration: number;
  timestamp: string;
};

// You'll need to get a Google Maps API key
// https://developers.google.com/maps/documentation/javascript/get-api-key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';

// Global variable to track if the script is already loaded
let googleMapsLoaded = false;

export default function ShitMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { logs } = useLogs();
  const { user } = usePrivy();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [blockchainLogs, setBlockchainLogs] = useState<BlockchainLog[]>([]);
  const [isLoadingBlockchain, setIsLoadingBlockchain] = useState(false);

  // Fetch blockchain logs
  useEffect(() => {
    const fetchBlockchainLogs = async () => {
      if (!user?.wallet?.address) return;
      
      setIsLoadingBlockchain(true);
      try {
        const response = await fetch('/api/getUserPoopData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: user.wallet.address
          }),
        });
        
        const data = await response.json();
        
        if (data.message && Array.isArray(data.message)) {
          setBlockchainLogs(data.message);
        } else {
          setBlockchainLogs([]);
        }
      } catch (error) {
        console.error('Error fetching blockchain logs:', error);
        setBlockchainLogs([]);
      } finally {
        setIsLoadingBlockchain(false);
      }
    };

    fetchBlockchainLogs();
  }, [user?.wallet?.address]);

  // Convert blockchain logs to a format compatible with local logs
  const formattedBlockchainLogs = blockchainLogs.map((log, index) => ({
    id: `chain-${index}`,
    timestamp: new Date(parseInt(log.timestamp) * 1000),
    location: {
      latitude: log.latitude / 1000000,
      longitude: log.longitude / 1000000
    },
    status: 'confirmed' as const,
    duration: log.sessionDuration,
    isBlockchain: true
  }));

  // Combine local and blockchain logs
  const allLogs = [...logs, ...formattedBlockchainLogs];

  // Filter logs that have location data
  const logsWithLocation = allLogs.filter(log => log.location);

  // Load Google Maps script only once
  useEffect(() => {
    // Check if script is already loaded or being loaded
    if (googleMapsLoaded || document.querySelector(`script[src*="maps.googleapis.com/maps/api"]`)) {
      setMapLoaded(true);
      googleMapsLoaded = true;
      return;
    }
    console.log(activeMarker);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';
    script.onload = () => {
      setMapLoaded(true);
      googleMapsLoaded = true;
    };
    document.head.appendChild(script);

    // No cleanup needed
  }, [activeMarker]); // Add activeMarker to dependency array

  // Initialize map when script is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    // Wait for window.google to be fully loaded
    if (!window.google || !window.google.maps) {
      setTimeout(() => setMapLoaded(false), 100);
      return;
    }

    // Default to a central location if no logs with location
    const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York City
    
    // Find center of all locations if available
    let center = defaultCenter;
    if (logsWithLocation.length > 0) {
      const latSum = logsWithLocation.reduce((sum, log) => sum + log.location!.latitude, 0);
      const lngSum = logsWithLocation.reduce((sum, log) => sum + log.location!.longitude, 0);
      center = {
        lat: latSum / logsWithLocation.length,
        lng: lngSum / logsWithLocation.length
      };
    }

    // Create map instance
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: logsWithLocation.length > 0 ? 10 : 3,
      styles: [
        // Custom map styles - you can generate these at https://mapstyle.withgoogle.com/
        // Dark mode friendly styles would be nice
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#746855" }]
        },
        // Add more styles as needed
      ]
    });

    // Add markers for each log with location
    const markers: google.maps.Marker[] = [];
    const infoWindows: google.maps.InfoWindow[] = [];

    logsWithLocation.forEach((log) => {
      if (!log.location) return;

      const marker = new google.maps.Marker({
        position: {
          lat: log.location.latitude,
          lng: log.location.longitude
        },
        map: mapInstance,
        title: `Shit #${typeof log.id === 'string' ? log.id.replace('chain-', '') : log.id}`,
        icon: {
          url: '/depoop-logo-small.png', // Use your custom poop logo
          scaledSize: new google.maps.Size(40, 40), // Adjust size as needed
          anchor: new google.maps.Point(20, 20) // Center the icon on the location
        },
        animation: google.maps.Animation.DROP
      });

      const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }).format(date);
      };

      const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
      };

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="color: #000;">
            <h3 style="margin: 0 0 8px; font-weight: bold;">Shit #${typeof log.id === 'string' ? log.id.replace('chain-', '') : log.id}</h3>
            <p style="margin: 0 0 4px;">${formatDate(log.timestamp)}</p>
            ${('duration' in log && log.duration) ? 
              `<p style="margin: 0 0 4px;">Duration: ${formatDuration(log.duration)}</p>` : ''}
            ${('isBlockchain' in log) ? 
              `<p style="margin: 0; color: #3b82f6;">✓ On-Chain</p>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindows.forEach(iw => iw.close());
        infoWindow.open(mapInstance, marker);
        setActiveMarker(typeof log.id === 'string' ? parseInt(log.id.replace('chain-', '')) : log.id);
      });

      markers.push(marker);
      infoWindows.push(infoWindow);
    });

    // Fit bounds to show all markers if there are any
    if (markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend(marker.getPosition()!));
      mapInstance.fitBounds(bounds);
      
      // Don't zoom in too far
      const listener = window.google.maps.event.addListener(mapInstance, 'idle', () => {
        if (mapInstance.getZoom()! > 16) mapInstance.setZoom(16);
        window.google.maps.event.removeListener(listener);
      });
    }

    return () => {
      // Clean up markers when component unmounts or when dependencies change
      markers.forEach(marker => marker.setMap(null));
    };
  }, [mapLoaded, logsWithLocation]); // Re-run when mapLoaded or logsWithLocation changes

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaMapMarkerAlt className="text-amber-600" />
          Your Shit Map
        </h2>
      </div>
      
      {!mapLoaded || isLoadingBlockchain ? (
        <div className="h-96 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-amber-600 text-2xl mb-2" />
            <p>{isLoadingBlockchain ? 'Loading blockchain data...' : 'Loading map...'}</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div ref={mapRef} className="h-96 w-full" />
          
          {logsWithLocation.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg text-center">
                <p className="mb-2">No locations logged yet!</p>
                <p className="text-sm text-zinc-500">Enable location when logging to see your shits on the map.</p>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-4 right-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg"
            >
              <p className="text-sm font-medium">
                {logsWithLocation.length} location{logsWithLocation.length !== 1 ? 's' : ''} logged
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
} 