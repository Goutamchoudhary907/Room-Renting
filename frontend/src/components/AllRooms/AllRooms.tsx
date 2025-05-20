import { useSearchParams } from "react-router-dom"
import { SearchFields } from "../Home/components/SearchFields"
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { PropertyDisplay } from "./components/PropertyDisplay";
import { useAuth } from "../../context/AuthContext";
import Notification from "../Notification";
import { RoomFilterBar } from "./components/RoomFilterBar";

import { Filters, Property } from '../Property/ListRoom/types';
export const AllRooms=() =>{
    const [searchParams, setSearchParams] = useSearchParams();
    const [properties, setProperties] = useState<Property[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null); // Error for fetching properties
   const [saveError, setSaveError] = useState<string | null>(null);   // Error for saving properties
   const [savingError, setSavingError] = useState<Record<string, string | null>>({}); // Error per property
//    const [saveSuccessMessage, setSaveSuccessMessage] = useState<Record<string, string | null>>({}); // Changed to Record
   const [savedPropertyIds,setSavedPropertyIds]=useState<string[]>([]);
    const {user,token,isLoading:authLoading} =useAuth();

    const [notificationMessage, setNotificationMessage] = useState<string | null>(null); // Single notification message
    const [loadingSavedProperties, setLoadingSavedProperties] = useState(true);

    const [filters, setFilters] = useState<Filters>({
        location: searchParams.get('location') || undefined,
        checkin: searchParams.get('checkin') ? new Date(searchParams.get('checkin')!) : null,
        checkout: searchParams.get('checkout') ? new Date(searchParams.get('checkout')!) : null ,
        rentalType: searchParams.get('rentalType') || undefined
      });
      
      const updateFilters = (newFilters: Partial<Filters>) => {
        setFilters(prev => {
          const updated = { ...prev, ...newFilters, _ts: Date.now() };
          
          // Update URL search params
          const params = new URLSearchParams();
          if (updated.location) params.set('location', updated.location);
          if (updated.checkin) params.set('checkin', updated.checkin.toISOString().split('T')[0]);
          if (updated.checkout) params.set('checkout', updated.checkout.toISOString().split('T')[0]);
          if(updated.rentalType) params.set('rentalType', updated.rentalType);
          setSearchParams(params);
      
          return updated;
        });
      };

    // const handleRoomSearch=(newLocation:string , newCheckin:Date | null , newCheckout:Date | null) =>{
    //     updateFilters({
    //         location: newLocation || undefined,
    //         checkin: newCheckin,
    //         checkout: newCheckout
    //       });
    //     const newSearchParams = new URLSearchParams();
    //     if (newLocation) newSearchParams.set('location', newLocation);
    //     if (newCheckin) newSearchParams.set('checkin', newCheckin ? newCheckin.toISOString().split('T')[0] : '');
    //     if (newCheckout) newSearchParams.set('checkout', newCheckout ? newCheckout.toISOString().split('T')[0] : '');
    
    //     setSearchParams(newSearchParams);  
    //     setFilters(prev => ({ ...prev, _ts: Date.now() })); 
    // }


    // const fetchProperties = async () =>{
    //     try {
    //         const params: Record<string, any> = {
    //             address: location || undefined,
    //             checkin: checkinDate ? checkinDate.toISOString().split('T')[0] : undefined,
    //             checkout: checkoutDate ? checkoutDate.toISOString().split('T')[0] : undefined,
    //         };
    
           
    //         if (filters && Object.keys(filters).length > 0) {
    //             Object.assign(params, filters);  // Add filters to params if they exist
    //         }
    
    //         const response=await axios.get(`${BACKEND_URL}/property/search` ,{
    //             params:params
    //         });
    //         setProperties(response.data);
    //         setFetchError(null);
    //     } catch (error:any) {
    //         setFetchError(error.message);
    //         setProperties([]);
    //     }
    // }
    const fetchProperties = async () => {
        try {
          const params = {
            address: filters.location,
            checkin: filters.checkin?.toISOString().split('T')[0],
            checkout: filters.checkout?.toISOString().split('T')[0],
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            amenities: filters.amenities?.join(','),
            propertyType: filters.propertyType,
            rentalType: filters.rentalType,
            bedrooms: filters.bedrooms
          };
      
          // Remove undefined params
          const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
          );
      
          const response = await axios.get(`${BACKEND_URL}/property/search`, {
            params: cleanParams
          });
          setProperties(response.data);
          setFetchError(null);
        } catch (error: any) {
          setFetchError(error.message);
          setProperties([]);
        }
      };
   const fetchSavedProperties=async () =>{
    if(user?.id && token){
        setLoadingSavedProperties(true);
        try {
          const response=await axios.get(`${BACKEND_URL}/user/${user.id}/saved-properties`, {
            headers:{
                Authorization:`Bearer ${token}`,
            }
          });
          setSavedPropertyIds(response.data.map((item:any) => item.propertyId))  
        } catch (error:any) {
            console.error("Error fetching saved properties:", error);
        }finally{
            setLoadingSavedProperties(false);
        }
    }else{
        setSavedPropertyIds([]);
        setLoadingSavedProperties(false);
    }
   };
   

   const handleCloseNotification = () => {
    setNotificationMessage(null);
};
    useEffect(() => {
        if (!authLoading) {
            fetchProperties();
        }
      }, [filters,authLoading]);

      const hasFetchedRef = useRef(false);

      useEffect(() => {
        const fetchData = async () => {
          if (!hasFetchedRef.current && user && token) {
            console.log("✅ Fetching saved properties...");
            hasFetchedRef.current = true;
            await fetchSavedProperties();
          }
        };
      
        if (!authLoading) {
          fetchData();
        }
      }, [authLoading, user, token]);
      
      
      
    const handleSaveProperty= useCallback (async (propertyId:string) =>{
        console.log('User in handleSaveProperty:', user);
        console.log('Token in handleSaveProperty:', token);
        if(!user || !user?.id || !token){
            console.log("User not logged in. Showing error.");
            setSaveError("You need to be logged in to save properties.");
            return;
        }
        setSaveError(null);
        setSavingError(prev => ({ ...prev, [propertyId]: null }));
        // setSaveSuccessMessage(prev => ({ ...prev, [propertyId]: null }));
    
        const isCurrentlySaved=savedPropertyIds.includes(propertyId);
        try {
            const response=await axios.post(`${BACKEND_URL}/user/${user.id}/save-property`,{
                propertyId
            },{
               headers:{
                Authorization:`Bearer ${token}` ,
               }, 
            });
            if(response.status ===200 || response.status ===201){
                if(isCurrentlySaved){
                    setSavedPropertyIds(prev => prev.filter(id => id !== propertyId));
                    // setSaveSuccessMessage(prev => ({ ...prev, [propertyId]: "Unsaved!" }));
                    setNotificationMessage("Property unsaved!");
                }else{
                    setSavedPropertyIds(prev => [...prev, propertyId]);
                    setNotificationMessage("Property saved!");
                    // setSaveSuccessMessage(prev => ({ ...prev, [propertyId]: "Saved!" }));
                }
            }else{
                console.error("Failed to save/unsave property:", response.status);
                setSavingError(prev => ({ ...prev, [propertyId]: "Failed to save property." }));
                setNotificationMessage("Failed to save property."); 
            }
        } catch (error) {
            console.error("Error saving/unsaving property:", error);
            setSavingError(prev => ({ ...prev, [propertyId]: "Failed to save property." }));
            setNotificationMessage("Failed to save property.");
        }
       },[user,token,savedPropertyIds]);

    //    if (authLoading || loadingSavedProperties) {
    //     return <div>Loading properties and saved status...</div>; 
    // }
    return(
        <div>
            <SearchFields 
            onSearch={(location, checkin, checkout) => 
                updateFilters({ location, checkin, checkout })
              }
              initialLocation={filters.location}
              initialCheckin={filters.checkin}
              initialCheckout={filters.checkout}
          />
          <div>
          <RoomFilterBar 
              onFilterChange={(filterData) => 
                updateFilters(filterData)
              }
              currentFilters={filters}
            />
          </div>

          <div>
          <div className="ml-10 pb-5 font-medium text-xl mt-6 sm:mt-10 md:font-bold md:text-3xl md:mt-10
            lg:font-bold lg:text-3xl lg:mt-10">
                <h2>Available Properties</h2>
            </div>

            {fetchError && <p className="text-red-500">Error loading properties: {fetchError}</p>}
            {saveError && <p className="text-red-500">{saveError}</p>} {/* General save error */}
            {/* {saveSuccessMessage && <p className="text-green-500">{saveSuccessMessage}</p>} Success message */}

        <PropertyDisplay 
        properties={properties}
        onSave={handleSaveProperty}
        savedPropertyIds={savedPropertyIds}
        savingError={savingError} 
        loadingSavedProperties={loadingSavedProperties}
        />

     
          </div>
          <Notification message={notificationMessage} onClose={handleCloseNotification} />
        </div>
    )
}

