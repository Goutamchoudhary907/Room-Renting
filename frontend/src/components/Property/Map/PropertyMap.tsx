import { useState } from 'react';
import { Circle, GoogleMap, Marker ,useJsApiLoader } from '@react-google-maps/api';
import { FaDirections,FaMapMarkerAlt } from 'react-icons/fa';
import useMap from '../../../hooks/useMap';
import { usePlaceAutocomplete } from '../../../hooks/usePlaceAutocomplete';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';

interface PropertyLocationMapProps {
  address: string;
  exactLocation?:boolean;
  landmark?:string;
  city?:string;
  latitude?: number;
  longitude?: number;
}

const PropertyLocationMap = ({   address, 
  exactLocation = false,
  landmark,
  city }: PropertyLocationMapProps) => {
  const { ref, inView } = useInView({
     triggerOnce: true,
      threshold: 0.1 ,
       rootMargin: '200px'
    });

  const { geocodeAddress } = useMap();
  const [originInput, setOriginInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { suggestions,clearSuggestions} = usePlaceAutocomplete(originInput);
  const [lastSelectedSuggestion, setLastSelectedSuggestion] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

const { 
  data: destinationCoords, 
  isLoading: isGeocoding,
  error: geocodeError 
} = useQuery({
  queryKey: ['propertyCoords', address],
  queryFn: async () => {
    if (!address) return null;
    return await geocodeAddress(address);
  },
  enabled: inView && isLoaded && !!address,
  staleTime: Infinity // Coordinates don't change often
});


  const handleSuggestionClick = (description: string) => {
    setOriginInput(description);
    setLastSelectedSuggestion(description);
    clearSuggestions();
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setOriginInput(newValue);
    
    if (lastSelectedSuggestion !== newValue) {
      setLastSelectedSuggestion(null);
    }
  };

  const shouldShowSuggestions = originInput.trim() && originInput !== lastSelectedSuggestion;

const openGoogleMaps = () => {
    const origin = encodeURIComponent(originInput.trim());
    const dest = exactLocation 
    ? encodeURIComponent(address) 
    : encodeURIComponent(landmark ? `Near ${landmark}, ${city}` : city || '');
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`, '_blank');
  };
  
 if (loadError || geocodeError) {
  return (
    <div className="h-64 bg-cream-border-soft rounded-2xl flex items-center justify-center">
      <p className="font-sans text-sm text-red-500">Map unavailable</p>
    </div>
  );
}

 return (
    <div
      ref={ref}
      className="h-96 w-full rounded-2xl border border-cream-border relative bg-cream-border-soft overflow-hidden"
    >
      {(!isLoaded || isGeocoding  || !destinationCoords) ? (
        <div className="h-full flex items-center justify-center">
          <p className="font-sans text-sm text-taupe">Loading map...</p>
        </div>
      ) : (
        <>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={destinationCoords}
            zoom={exactLocation ? 15:12}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              gestureHandling: "greedy",
            }}
          >
             {exactLocation ? (
              <Marker position={destinationCoords} />
            ) : (
              <Circle
                center={destinationCoords}
                radius={600} // ~0.5 mile radius
                options={{
                  fillColor: "#b5703c",
                  fillOpacity: 0.2,
                  strokeColor: "#b5703c",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>

       {!exactLocation ? (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
              <div className="bg-white p-4 rounded-2xl border border-cream-border shadow-[0_8px_24px_rgba(28,25,23,0.12)] text-center max-w-md">
                <p className="font-sans text-sm font-semibold text-ink m-0">
                  {landmark ? `Near ${landmark}` : city ? `In ${city}` : 'Approximate location'}
                </p>
                <p className="font-sans text-[13px] text-taupe mt-1 m-0">
                  Exact address and directions available after booking
                </p>
              </div>
            </div>
          ) : (
            <>
              {!showInput && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button
                    onClick={() => setShowInput(true)}
                    className="bg-ink hover:bg-amber text-cream px-6 py-3 rounded-full shadow-[0_8px_24px_rgba(28,25,23,0.2)] flex items-center gap-2 font-sans text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <FaDirections />
                    <span>Get directions</span>
                  </button>
                </div>
              )}

              {showInput && (
                <div className="absolute bottom-4 left-0 right-0 bg-white p-4 mx-4 rounded-2xl shadow-[0_12px_32px_rgba(28,25,23,0.16)] border border-cream-border">
                  <div className="flex items-center gap-2 mb-3">
                    <FaMapMarkerAlt className="text-amber" />
                    <h3 className="font-serif text-lg font-semibold text-ink m-0">Get Directions</h3>
                  </div>
                  <div className="flex gap-2 mb-2 relative">
                    <input
                      type="text"
                      value={originInput}
                      onChange={handleInputChange}
                      placeholder="Your current location or address"
                      className="border border-cream-border p-3 rounded-xl flex-1 font-sans text-sm text-ink placeholder-taupe-light focus:outline-none focus:border-amber"
                    />
                    <button
                      onClick={openGoogleMaps}
                      disabled={!originInput.trim()}
                      className={`px-5 py-3 rounded-xl flex items-center gap-2 font-sans text-sm font-semibold transition-colors ${
                        originInput.trim()
                          ? 'bg-ink text-cream hover:bg-amber cursor-pointer'
                          : 'bg-cream-border text-taupe-light cursor-not-allowed'
                      }`}
                    >
                      <FaDirections />
                      <span>Go</span>
                    </button>
                    {shouldShowSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-16 mt-1 z-10 bg-white border border-cream-border rounded-xl shadow-[0_12px_32px_rgba(28,25,23,0.12)] max-h-60 overflow-y-auto">
                        {suggestions.map((prediction) => (
                          <div
                            key={prediction.place_id}
                            className="px-4 py-3 hover:bg-cream cursor-pointer border-b border-cream-border-soft last:border-b-0"
                            onClick={() => handleSuggestionClick(prediction.description)}
                          >
                            <div className="font-sans text-sm font-medium text-ink">
                              {prediction.structured_formatting.main_text}
                            </div>
                            <div className="font-sans text-[13px] text-taupe-light">
                              {prediction.structured_formatting.secondary_text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center font-sans text-[13px] text-taupe-light">
                    <span>Directions will open in Google Maps</span>
                    <button
                      onClick={() => {
                        setShowInput(false);
                        setOriginInput('');
                      }}
                      className="text-amber hover:text-amber-dark cursor-pointer bg-transparent border-none font-sans text-[13px] font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
export default PropertyLocationMap;