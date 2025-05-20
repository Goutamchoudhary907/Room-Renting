import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaDirections,FaMapMarkerAlt } from 'react-icons/fa';
import useMap from '../../../hooks/useMap';
import { usePlaceAutocomplete } from '../../../hooks/usePlaceAutocomplete';

interface PropertyLocationMapProps {
  address: string;
}

const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 }; // Fallback center

const PropertyLocationMap = ({ address }: PropertyLocationMapProps) => {
  const { geocodeAddress, loading, error } = useMap();
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [originInput, setOriginInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { suggestions,clearSuggestions} = usePlaceAutocomplete(originInput);

  useEffect(() => {
    const fetchCoords = async () => {
      const coords = await geocodeAddress(address);
      if (coords) setDestinationCoords(coords);
    };
    if (address) fetchCoords();
  }, [address, geocodeAddress]);

const openGoogleMaps = () => {
    const origin = encodeURIComponent(originInput.trim());
    const dest = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`, '_blank');
  };

  const handleSuggestionClick = (description: string) => {
    setOriginInput(description);
    clearSuggestions();
  };

  if (loading) return (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <p>Loading map...</p>
    </div>
  );

  if (error) return (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-red-500">Map unavailable: {error}</p>
    </div>
  );

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200 relative">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}
        onLoad={() => setMapLoaded(true)}
        onError={() => console.error('Google Maps failed to load')}
      >
        {mapLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={destinationCoords || DEFAULT_CENTER}
            zoom={destinationCoords ? 15 : 10}
            options={{
              streetViewControl: true,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {destinationCoords && <Marker position={destinationCoords} />}
          </GoogleMap>
        )}
      </LoadScript>

      {!showInput && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <button
            onClick={() =>{
            setOriginInput('')
            setShowInput(true)
          }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all"
          >
            <FaDirections />
            <span>Get directions to this property</span>
          </button>
        </div>
      )}

{showInput && (
        <div className="absolute bottom-4 left-0 right-0 bg-white p-4 mx-4 rounded-lg shadow-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FaMapMarkerAlt className="text-blue-500" />
            <h3 className="font-semibold">Get Directions</h3>
          </div>

          <div className="flex gap-2 mb-2 relative">
            <input
              type="text"
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
              placeholder="Your current location or address"
              className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={openGoogleMaps}
              disabled={!originInput.trim()}
              className={`px-5 py-3 rounded-lg flex items-center gap-2 ${
                originInput.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaDirections />
              <span>Go</span>
            </button>

            {/* Suggestion Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-14 left-0 right-16 z-10 bg-white border rounded-lg shadow-lg max-h-40 overflow-auto">
                {suggestions.map((prediction) => (
                  <div
                    key={prediction.place_id}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(prediction.description)}
                  >
                    {prediction.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Directions will open in Google Maps</span>
            <button
              onClick={() => {
                setShowInput(false);
                setOriginInput('');
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center">
          <span className="text-gray-600">Loading map...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center">
          <span className="text-red-500">Map unavailable: {error}</span>
        </div>
      )}
    </div>
  );
};


export default PropertyLocationMap;