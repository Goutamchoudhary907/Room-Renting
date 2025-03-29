import ApartmentIcon from "../../../assets/ApartmentIcon.png"
import HouseIcon from "../../../assets/HouseIcon.png"
import StudioIcon from "../../../assets/StudioIcon.png"
import VillaIcon from "../../../assets/VillaIcon.png"
import CabinIcon from "../../../assets/CabinIcon.png"

import WifiIcon from "../../../assets/WifiIcon.png"
import ACIcon from "../../../assets/ACIcon.png"
import LaundryIcon from "../../../assets/LaundryIcon.png"
import ParkingICon from "../../../assets/ParkingIcon.png"
import PoolIcon from "../../../assets/PoolIcon.png"
import SecurityIcon from "../../../assets/SecurityIcon.png"
import ElevatorIcon from "../../../assets/ElevatorIcon.png"
import DiningIcon from "../../../assets/DiningIcon.png"
import TVIcon from "../../../assets/TVIcon.png"
import PetFriendly from "../../../assets/PetFriendlyIcon.png"
import WaterIcon from "../../../assets/WaterIcon.png"
import GymIcon from "../../../assets/GymIcon.png"


export const bathroomOptions=[
    {value:1, label:"1"},
    {value:1.5, label:"1.5"},
    {value:2, label:"2"},
    {value:2.5, label:"2.5"},
    {value:3, label:"3"},
    {value:3.5, label:"3.5"},
    {value:4, label:"4"},
    {value:4.5, label:"4.5"},         
  ];

export const bedroomOptions=[
    {value:1 , label:"1"},
    {value:2 , label:"2"},
    {value:3 , label:"3"},
    {value:4 , label:"4"},
    {value:5 , label:"5"},      
  ]

export const kitchenOptions=[
    {value:"Full Kitchen" , label:"Full Kitchen"},
    {value:"Kitchenette" , label:"Kitchenette"},
    {value:"Shared Kitchen" , label:"Shared Kitchen"},
    {value:"No Kitchen" , label:"No Kitchen"},
  ]

export const LivingRoomOptions=[
    {value:"Separate Living Room" , label:"Separate Living Room"},
    {value:"Combined Living/Dining" , label:"Combined Living/Dining"},
    {value:"No Living Room" , label:"No Living Room "},
    {value:"Open Concept" , label:"Open Concept"},
  ]
export const propertyOptions=[
    { value: 'apartment', label: 'Apartment', imageSrc: ApartmentIcon },
    { value: 'house', label: 'House',   imageSrc: HouseIcon },
    { value: 'studio', label: 'Studio', imageSrc: StudioIcon },
    { value: 'villa', label: 'Villa',   imageSrc:  VillaIcon},
    { value: 'cabin', label: 'Cabin',   imageSrc:  CabinIcon},
    { value: 'other', label: 'Other',   imageSrc: ApartmentIcon },
    
  ]

export const amenityOptions=[
    {value:'wifi', label:"WiFi", imageSrc:WifiIcon},
    {value:"airConditioning", label:"Air Conditioning", imageSrc:ACIcon},
    {value:"laundry", label:"Laundry", imageSrc:LaundryIcon},
    {value:"parking", label:"Parking", imageSrc:ParkingICon},
    {value:"pool", label:"Pool", imageSrc:PoolIcon},
    {value:"security", label:"Security", imageSrc:SecurityIcon}, 
    {value:"elevator", label:"Elevator", imageSrc:ElevatorIcon},
    {value:"dining", label:"Dining", imageSrc:DiningIcon},
    {value:"tv", label:"TV", imageSrc:TVIcon},
    {value:"petFriendly", label:"Pet Friendly", imageSrc:PetFriendly},
    {value:"water", label:"Water", imageSrc:WaterIcon},
    {value:"gym", label:"Gym", imageSrc:GymIcon},
  ]