import { useSearchParams } from "react-router-dom";
import { SearchFields } from "../../components/Home/SearchFields";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { ChevronLeftIcon, ChevronRightIcon } from "../../components/Home/icons";

type SortOption = "recommended" | "price-asc" | "price-desc" | "newest";

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
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
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

  const {
    data:paginatedResponse,
    isLoading: isPropertiesLoading,
    error: fetchError,
  } = useQuery({
   queryKey: ["properties", filters, user?.id, currentPage, itemsPerPage],
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
        page:currentPage,
        limit:itemsPerPage,
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

  const properties = paginatedResponse?.data || [];
const pagination = paginatedResponse?.pagination;

// Update totalPages when pagination changes
useEffect(() => {
  if (pagination?.totalPages) {
    setTotalPages(pagination.totalPages);
  }
}, [pagination]);

useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Sort applies to the currently-loaded page only (the search API has no
  // sort param), so this is a real but page-scoped enhancement, not a fake one.
  const sortedProperties = useMemo(() => {
    if (sortBy === "recommended") return properties;
    const priceOf = (p: any) => p.pricePerNight ?? p.pricePerMonth ?? Number.POSITIVE_INFINITY;
    const copy = [...properties];
    if (sortBy === "price-asc") copy.sort((a, b) => priceOf(a) - priceOf(b));
    if (sortBy === "price-desc") copy.sort((a, b) => priceOf(b) - priceOf(a));
    if (sortBy === "newest") copy.sort((a, b) => Number(b.id) - Number(a.id));
    return copy;
  }, [properties, sortBy]);


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

  const getPageNumbers = () => {
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const resultCount = pagination?.totalItems ?? properties.length;

  if (isPropertiesLoading || authLoading || isSavedPropertiesLoading) {
    return <AllRoomsSkeleton />;
  }
  return (
    <div className="min-h-screen bg-cream">
      {/* Page header + search */}
      <div className="border-b border-cream-border bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-0.5 w-5 bg-amber" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-amber">Browse</span>
            </div>
            <h1 className="m-0 font-serif text-[clamp(28px,4vw,40px)] font-semibold tracking-tight text-ink">
              All Rooms
            </h1>
          </div>
          <SearchFields
            onSearch={(location, checkin, checkout) =>
              updateFilters({ location, checkin, checkout })
            }
            initialLocation={filters.location}
            initialCheckin={filters.checkin}
            initialCheckout={filters.checkout}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <RoomFilterBar
            onFilterChange={(filterData) => updateFilters(filterData)}
            currentFilters={filters}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="m-0 font-sans text-sm text-taupe">
                <span className="font-semibold text-ink">{resultCount}</span>{" "}
                {resultCount === 1 ? "room" : "rooms"} found
              </p>
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-taupe-light">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="cursor-pointer rounded-[10px] border-[1.5px] border-cream-border bg-white px-3 py-2 font-sans text-[13px] text-ink focus:outline-none"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {fetchError && (
              <p className="mb-4 font-sans text-sm text-red-500">
                Error loading properties: {fetchError.message}
              </p>
            )}
            {saveError && <p className="mb-4 font-sans text-sm text-red-500">{saveError}</p>}

            {sortedProperties.length === 0 ? (
              <div className="rounded-[20px] border border-cream-border bg-white px-6 py-16 text-center">
                <p className="m-0 font-serif text-xl font-semibold text-ink">No rooms match your filters</p>
                <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-taupe">
                  Try adjusting your filters or search a different location.
                </p>
              </div>
            ) : (
              <PropertyDisplay
                properties={sortedProperties}
                onSave={handleSaveProperty}
                savedPropertyIds={savedPropertyIds}
                savingError={savingError}
                loadingSavedProperties={isSavedPropertiesLoading}
              />
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-cream-border bg-white transition-colors hover:border-amber disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeftIcon className="text-taupe" />
                </button>
                {getPageNumbers().map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`flex h-10 w-10 items-center justify-center rounded-[10px] border-[1.5px] font-sans text-sm font-semibold transition-colors ${
                      num === currentPage
                        ? "border-ink bg-ink text-gold"
                        : "border-cream-border bg-white text-taupe hover:border-amber"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-cream-border bg-white transition-colors hover:border-amber disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRightIcon className="text-taupe" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Notification
        message={notificationMessage}
        onClose={handleCloseNotification}
      />
    </div>
  );
};
