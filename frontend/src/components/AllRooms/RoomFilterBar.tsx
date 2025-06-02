import { useEffect, useState } from "react";
import { amenityOptions, bedroomOptions, propertyOptions } from "../Property/ListRoom/constants";
import Select, { components } from 'react-select';
import { FiFilter, FiX } from 'react-icons/fi';
import { Filters } from '../Property/ListRoom/types';

interface RoomFilterBarProps {
  onFilterChange: (filterData: Filters) => void;
  currentFilters?: Filters;
}

const CheckboxOption = (props: any) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => {}}
        className="mr-2 accent-blue-600"
      />
      <label>{props.label}</label>
    </components.Option>
  );
};

const ValueDisplay = ({ selectProps }: any) => {
  const count = selectProps.value.length;
  return <div className="px-2 text-gray-700">{count} selected</div>;
};

export const RoomFilterBar: React.FC<RoomFilterBarProps> = ({
  onFilterChange,
  currentFilters = {}
}) => {
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(currentFilters.amenities || []);
  const [propertyType, setPropertyType] = useState(currentFilters.propertyType || '');
  const [rentalType, setRentalType] = useState(currentFilters.rentalType || '');
  const [bedrooms, setBedrooms] = useState(currentFilters.bedrooms || '');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setMinPrice(currentFilters.minPrice || '');
    setMaxPrice(currentFilters.maxPrice || '');
    setSelectedAmenities(currentFilters.amenities || []);
    setPropertyType(currentFilters.propertyType || '');
    setRentalType(currentFilters.rentalType || '');
    setBedrooms(currentFilters.bedrooms || '');
  }, [currentFilters]);

  const handleApplyFilters = () => {
    const filters: Filters = {
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      propertyType: propertyType || undefined,
      rentalType: rentalType || undefined,
      bedrooms: bedrooms || undefined,
    };
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedAmenities([]);
    setPropertyType('');
    setRentalType('');
    setBedrooms('');
    
    onFilterChange({
      minPrice: undefined,
      maxPrice: undefined,
      amenities: undefined,
      propertyType: undefined,
      rentalType: undefined,
      bedrooms: undefined,
    });

    setIsMobileFiltersOpen(false);
  };

  const amenitiesOption = amenityOptions.map(option => ({
    value: option.value,
    label: option.label
  }));

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '2.5rem',
      cursor: 'pointer',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 0.5rem',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#6B7280',
    }),
    menu: (provided: any) => ({
      ...provided,
      maxHeight: '200px',
      overflowY: 'auto',
    }),
  };

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="hidden lg:block">
        <div className="w-full border-t border-gray-200" />
        <div className="flex flex-wrap items-center gap-4 px-6 py-4">
      
          <div className="flex items-center gap-2">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">Min Price</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="₹ Min"
                className="h-9 w-32 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">Max Price</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="₹ Max"
                className="h-9 w-32 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

        
          <div className="grid gap-1">
            <label className="text-sm font-medium text-gray-700">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="h-9 w-40 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any</option>
              {propertyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

         
          <div className="grid gap-1">
            <label className="text-sm font-medium text-gray-700">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="h-9 w-28 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any</option>
              {bedroomOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

       
          <div className="grid gap-1">
            <label className="text-sm font-medium text-gray-700">Rental Type</label>
            <select
              value={rentalType}
              onChange={(e) => setRentalType(e.target.value)}
              className="h-9 w-44 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="short-term">Short Term</option>
              <option value="long-term">Long Term</option>
              <option value="both">Both</option>
            </select>
          </div>

         
          <div className="grid gap-1">
            <label className="text-sm font-medium text-gray-700">Amenities</label>
            <Select
              isMulti
              options={amenitiesOption}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              value={amenitiesOption.filter(opt => selectedAmenities.includes(opt.value))}
              onChange={(selected) => setSelectedAmenities(selected.map(item => item.value))}
              placeholder="Select Amenities"
              className="w-56 text-sm"
              styles={customStyles}
              components={{
                Option: CheckboxOption,
                MultiValue: () => null,
                ValueContainer: ValueDisplay,
              }}
            />
          </div>

          
          <div className="self-end flex gap-2">
            <button
              onClick={handleClearFilters}
              className="h-9 px-6 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="h-9 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
        <div className="w-full border-t border-gray-200" />
      </div>

     
      <div className="lg:hidden p-4">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg"
        >
          <span className="text-gray-700">Filters</span>
          <div className="flex items-center gap-2">
            {selectedAmenities.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {selectedAmenities.length} selected
              </span>
            )}
            <FiFilter className="text-gray-600 h-5 w-5" />
          </div>
        </button>
      </div>

      
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Filters</h2>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          <div className="space-y-6">
            
            <div className="space-y-2">
              <h3 className="font-medium">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min Price"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max Price"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

             <div className="space-y-2">
              <h3 className="font-medium">Property Type</h3>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                {propertyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            
            <div className="space-y-2">
              <h3 className="font-medium">Bedrooms</h3>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                {bedroomOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            
            <div className="space-y-2">
              <h3 className="font-medium">Rental Type</h3>
              <select
                value={rentalType}
                onChange={(e) => setRentalType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="short-term">Short Term</option>
                <option value="long-term">Long Term</option>
                <option value="both">Both</option>
              </select>
            </div>

        
            <div className="space-y-2">
              <h3 className="font-medium">Amenities</h3>
              <Select
                isMulti
                options={amenitiesOption}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                value={amenitiesOption.filter(opt => selectedAmenities.includes(opt.value))}
                onChange={(selected) => setSelectedAmenities(selected.map(item => item.value))}
                placeholder="Select Amenities"
                className="w-full text-sm"
                styles={customStyles}
                components={{
                  Option: CheckboxOption,
                  MultiValue: () => null,
                  ValueContainer: ValueDisplay,
                }}
              />
            </div>
          </div>

         
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex gap-2">
            <button
              onClick={handleClearFilters}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};