import { useState, useEffect } from 'react';
import { GoogleMap, Marker ,useJsApiLoader } from '@react-google-maps/api';
import { FaDirections,FaMapMarkerAlt } from 'react-icons/fa';
import useMap from '../../../hooks/useMap';
import { usePlaceAutocomplete } from '../../../hooks/usePlaceAutocomplete';
import { useInView } from 'react-intersection-observer';

interface PropertyLocationMapProps {
  address: string;
}

const PropertyLocationMap = ({ address }: PropertyLocationMapProps) => {
  const { ref, inView } = useInView({
     triggerOnce: true,
      threshold: 0.1 ,
       rootMargin: '200px'
    });

  const { geocodeAddress } = useMap();
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [originInput, setOriginInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { suggestions,clearSuggestions} = usePlaceAutocomplete(originInput);
  const [lastSelectedSuggestion, setLastSelectedSuggestion] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  useEffect(() => {
    console.log("Map inView:", inView);

    if (!inView || !isLoaded) return;
  
    const fetchCoords = async () => {
      const coords = await geocodeAddress(address);
      console.log("Fetched Coords:", coords)
      if (coords) setDestinationCoords(coords);
    };
    if (address) fetchCoords();
  }, [address, geocodeAddress,inView,isLoaded]);

  const handleSuggestionClick = (description: string) => {
    setOriginInput(description);
    setLastSelectedSuggestion(description);
    clearSuggestions();
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setOriginInput(newValue);
    
    // Only clear last selected if the user actually changed the text
    if (lastSelectedSuggestion !== newValue) {
      setLastSelectedSuggestion(null);
    }
  };

  const shouldShowSuggestions = originInput.trim() && originInput !== lastSelectedSuggestion;

const openGoogleMaps = () => {
    const origin = encodeURIComponent(originInput.trim());
    const dest = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`, '_blank');
  };
  if (loadError) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-red-500">Map unavailable</p>
      </div>
    );
  }

 return (
    <div
      ref={ref}
      className="h-96 w-full rounded-lg border border-gray-200 relative bg-gray-100"
    >
      {(!isLoaded || !destinationCoords) ? (
        <div className="h-full flex items-center justify-center">
          <p>Loading map...</p>
        </div>
      ) : (
        <>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={destinationCoords}
            zoom={15}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              gestureHandling: "greedy",
            }}
          >
            <Marker position={destinationCoords} />
          </GoogleMap>

          {!showInput ? (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <button
                onClick={() => {
                  setOriginInput('');
                  setLastSelectedSuggestion(null);
                  setShowInput(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all"
              >
                <FaDirections />
                <span>Get directions to this property</span>
              </button>
            </div>
          ) : (
            <div className="absolute bottom-4 left-0 right-0 bg-white p-4 mx-4 rounded-lg shadow-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <FaMapMarkerAlt className="text-blue-500" />
                <h3 className="font-semibold">Get Directions</h3>
              </div>

              <div className="flex gap-2 mb-2 relative">
                <input
                  type="text"
                  value={originInput}
                onChange={handleInputChange}
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

                {shouldShowSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-16 mt-1 z-10 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((prediction) => (
                  <div
                    key={prediction.place_id}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(prediction.description)}
                  >
                    <div className="font-medium text-gray-800">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-sm text-gray-500">
                      {prediction.structured_formatting.secondary_text}
                    </div>
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
        </>
      )}
    </div>
  );
};
export default PropertyLocationMap;