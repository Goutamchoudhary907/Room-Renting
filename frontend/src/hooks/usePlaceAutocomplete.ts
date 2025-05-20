import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useDebounce } from "./useDebounce";

interface Prediction{
    description:string;
    place_id:string;
}

export const usePlaceAutocomplete= (input:string) =>{
    const debouncedInput = useDebounce(input, 200);
    const [suggestions,setSuggestions] =useState<Prediction[]>([]);
    const [loading,setLoading] =useState(false);
    const [error,setError] = useState<string | null>(null);

    useEffect(() =>{
        if (!debouncedInput.trim()) {
            setSuggestions([]);
            return;
          }
        const fetchSuggestions=async() =>{
            setLoading(true);

            try {
                const res = await axios.get(`${BACKEND_URL}/map/autocomplete?input=${encodeURIComponent(debouncedInput.trim())}`);
                setSuggestions(res.data);
                setError(null);
            } catch (error) {
                console.error('Autocomplete error:', error);
                setError('Failed to fetch suggestions');
            }finally {
                setLoading(false);
              }
        }
        fetchSuggestions();
    }, [debouncedInput])
    const clearSuggestions = () => setSuggestions([]);

    return {suggestions,loading,error,clearSuggestions};
}