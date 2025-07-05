import { useSearchParams } from "react-router-dom";
import { SearchFields } from "../../components/Home/SearchFields";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { PropertyDisplay } from "../../components/AllRooms/PropertyDisplay";
import { useAuth } from "../../context/AuthContext";
import Notification from "../../components/Notification";
import { RoomFilterBar } from "../../components/AllRooms/RoomFilterBar";
import { Filters } from "../../components/Property/ListRoom/types";
import { useMediaQuery } from "react-responsive";
import { AllRoomsSkeleton } from "../skeletons/property/AllRoomsSkeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savingError, setSavingError] = useState<Record<string, string | null>>(
    {}
  );
  const { user, token, isLoading: authLoading } = useAuth();

  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 10 : 20;
  const queryClient = useQueryClient();

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const [filters, setFilters] = useState<Filters>({
    location: searchParams.get("location") || undefined,
    checkin: searchParams.get("checkin")
      ? new Date(searchParams.get("checkin")!)
      : null,
    checkout: searchParams.get("checkout")
      ? new Date(searchParams.get("checkout")!)
      : null,
    rentalType: searchParams.get("rentalType") || undefined,
  });

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters, _ts: Date.now() };

      // Update URL search params
      const params = new URLSearchParams();
      if (updated.location) params.set("location", updated.location);
      if (updated.checkin)
        params.set("checkin", updated.checkin.toISOString().split("T")[0]);
      if (updated.checkout)
        params.set("checkout", updated.checkout.toISOString().split("T")[0]);
      if (updated.rentalType) params.set("rentalType", updated.rentalType);
      setSearchParams(params);

      return updated;
    });
  };

  useEffect(() => {
    const newFilters: Filters = {
      location: searchParams.get("location") || undefined,
      checkin: searchParams.get("checkin")
        ? new Date(searchParams.get("checkin")!)
        : null,
      checkout: searchParams.get("checkout")
        ? new Date(searchParams.get("checkout")!)
        : null,
      rentalType: searchParams.get("rentalType") || undefined,
    };
    setFilters(newFilters);
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const {
    data: properties = [],
    isLoading: isPropertiesLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["properties", filters, user?.id],
    queryFn: async () => {
      const params = {
        address: filters.location,
        checkin: filters.checkin?.toISOString().split("T")[0],
        checkout: filters.checkout?.toISOString().split("T")[0],
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        amenities: filters.amenities?.join(","),
        propertyType: filters.propertyType,
        rentalType: filters.rentalType,
        bedrooms: filters.bedrooms,
        excludeHostId: user?.id?.toString(),
        bookingStatus: "AVAILABLE",
      };

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined)
      );

      const response = await axios.get(`${BACKEND_URL}/property/search`, {
        params: cleanParams,
      });
      return response.data;
    },
    enabled: !authLoading, // Fetch when auth is loaded
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: savedPropertyIds = [], isLoading: isSavedPropertiesLoading } =
    useQuery({
      queryKey: ["savedProperties", user?.id],
      queryFn: async () => {
        if (!user?.id || !token) return [];
        const response = await axios.get(
          `${BACKEND_URL}/user/${user.id}/saved-properties`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data.map((item: any) => item.propertyId);
      },
      enabled: !authLoading && !!user?.id && !!token, // Fetch when auth is loaded and user exists
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });

  const handleCloseNotification = () => {
    setNotificationMessage(null);
  };

  const { mutate } = useMutation({
  mutationFn: async (propertyId: string) => {
    if (!user || !user?.id || !token) {
      throw new Error("You need to be logged in to save properties.");
    }

    const response = await axios.post(
      `${BACKEND_URL}/user/${user.id}/save-property`,
      { propertyId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  },

  onMutate: async (propertyId: string) => {
    await queryClient.cancelQueries({
      queryKey: ["savedProperties", user?.id],
    });

    const previousIds =
      queryClient.getQueryData<string[]>(["savedProperties", user?.id]) || [];

    const isCurrentlySaved = previousIds.includes(propertyId);
    const newIds = isCurrentlySaved
      ? previousIds.filter((id) => id !== propertyId)
      : [...previousIds, propertyId];

    queryClient.setQueryData(["savedProperties", user?.id], newIds);

    setSavingError((prev) => ({ ...prev, [propertyId]: null }));
    setSaveError(null);
    return { previousIds, isCurrentlySaved };
  },

  onError: (error: any, propertyId, context) => {
    queryClient.setQueryData(
      ["savedProperties", user?.id],
      context?.previousIds || []
    );
    setSavingError((prev) => ({ ...prev, [propertyId]: error.message }));
    setSaveError(error.message);
    setNotificationMessage("Failed to save property.");
  },

onSuccess: (_data, _propertyId, context) => {
  const wasSaved = context?.isCurrentlySaved;
  setNotificationMessage(wasSaved ? "Property unsaved!" : "Property saved!");
},

});


  const handleSaveProperty =  useCallback(
    async (propertyId: string) => {
      try {
        await mutate(propertyId);
      } catch (error) {
        // Error is already handled in onError
        throw error;
      }
    },
    [mutate]
  );

  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const paginatedProperties = properties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  if (isPropertiesLoading || authLoading || isSavedPropertiesLoading) {
    return <AllRoomsSkeleton />;
  }
  return (
    <div>
      <div className="">
        <SearchFields
          onSearch={(location, checkin, checkout) =>
            updateFilters({ location, checkin, checkout })
          }
          initialLocation={filters.location}
          initialCheckin={filters.checkin}
          initialCheckout={filters.checkout}
        />
      </div>
      <div>
        <RoomFilterBar
          onFilterChange={(filterData) => updateFilters(filterData)}
          currentFilters={filters}
        />
      </div>

      <div>
        <div
          className="ml-10 pb-5 font-medium text-xl mt-6 sm:mt-10 md:font-bold md:text-3xl md:mt-10
            lg:font-bold lg:text-3xl lg:mt-10"
        >
          <h2>Available Properties</h2>
        </div>
        {fetchError && (
          <p className="text-red-500">
            Error loading properties: {fetchError.message}
          </p>
        )}{" "}
        {saveError && <p className="text-red-500">{saveError}</p>}
        <PropertyDisplay
          properties={paginatedProperties}
          onSave={handleSaveProperty}
          savedPropertyIds={savedPropertyIds}
          savingError={savingError}
          loadingSavedProperties={isSavedPropertiesLoading}
        />
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4 mb-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Notification
        message={notificationMessage}
        onClose={handleCloseNotification}
      />
    </div>
  );
};
