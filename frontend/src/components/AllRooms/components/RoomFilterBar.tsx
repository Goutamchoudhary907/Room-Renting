import { useEffect, useState } from "react";
import { amenityOptions, bedroomOptions, propertyOptions } from "../../Property/ListRoom/constants";
import Select, { components } from 'react-select';

import { Filters } from '../../Property/ListRoom/types';

interface RoomFilterBarProps {
  onFilterChange: (filterData: Filters) => void;
  currentFilters?: Filters;
}

// Custom Option Component to show checkboxes
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


export const RoomFilterBar: React.FC<RoomFilterBarProps>=({
  onFilterChange ,
  currentFilters = {} 
}) =>{

  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(currentFilters.amenities || []);
  const [propertyType, setPropertyType] = useState(currentFilters.propertyType || '');
  const [rentalType, setRentalType] = useState(currentFilters.rentalType || '');
  const [bedrooms, setBedrooms] = useState(currentFilters.bedrooms || '');

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

    const amenitiesOption=amenityOptions.map(option => ({
        value:option.value,
        label:option.label
    }))
  
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
         <div className="">
       <div className="w-full border-t-3 border-gray-100 my-6 mx-auto" />  
        <div className="flex ml-8 gap-5">
            
            <div className="grid">
                <label htmlFor="minprice">Min Price</label>
                <input type="number" id="minPrice" value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="₹ Min"
                className=" outline-2 h-8 w-20 outline-gray-400 placeholder:pl-2"
                />
            </div>

            <div className="grid">
            <label htmlFor="maxPrice">Max Price:</label>
            <input type="number" id="maxPrice" value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
             placeholder="₹ Max"
            className=" outline-2 h-8 w-20 outline-gray-400 placeholder:pl-2"
            />
           </div>

             {/* Property Type Dropdown */}
            <div className="grid">
                <label htmlFor="propertyType">Property Type:</label>
                <select name="propertyType" id="propertyType"
                value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
                className=" outline-2 h-8 w-20 outline-gray-400 placeholder:pl-2"
                >
                  <option value="">Any</option>
                {propertyOptions.map((option) =>(
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
                </select>
            </div>
            {/* Bedrooms Dropdown */}
            <div className="grid">
            <label htmlFor="bedrooms">Bedrooms:</label>
            <select id="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}
            className=" outline-2 h-8 w-20 outline-gray-400 placeholder:pl-2"
              >
            {bedroomOptions.map((option)=>(
                <option value={option.value} key={option.value}>
                    {option.label}
                </option>
            ))}    
            </select>
            </div>

             {/* Rental Type Dropdown */}
             <div className="grid">
             <label htmlFor="rentalType">Rental Type:</label>
                <select id="rentalType" value={rentalType} onChange={(e) => setRentalType(e.target.value)}
                className=" outline-2 h-8 w-20 outline-gray-400 placeholder:pl-2"
                    >
                    <option value="">Any</option>
                    <option value="short-term">Short Term</option>
                    <option value="long-term">Long Term</option>
                    <option value="both">Both Short & Long Term</option>
                </select>
             </div>

              {/* Amenities Multi-Select Dropdown */}
 
              <div className="grid">
          <label className="mb-1">Amenities:</label>
          <div
          onMouseDown={(e) => {
            e.stopPropagation(); // allow dropdown arrow to toggle
          }}
        ></div>
          <Select
            isMulti
            options={amenitiesOption}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            value={amenitiesOption.filter(opt => selectedAmenities.includes(opt.value))}
            onChange={(selected) => setSelectedAmenities(selected.map(item => item.value))}
            placeholder="Select Amenities"
            className="w-64 text-sm"
            styles={customStyles}
            components={{
              Option: CheckboxOption,
              MultiValue: () => null,
              ValueContainer: ValueDisplay,
            }}
          />
        </div>
      
             <div>
             <button
             className="bg-blue-500 text-white w-40 h-10 mt-6 cursor-pointer"
             onClick={handleApplyFilters}>Apply Filters</button>
             </div>

        </div>
        <div className="w-full border-t-3 border-gray-100 my-6 mx-auto" />  
        </div>
    )
}