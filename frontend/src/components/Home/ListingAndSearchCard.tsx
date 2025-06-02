import { useNavigate } from "react-router-dom";

export const ListingAndSearchCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white grid grid-cols-1 gap-5 px-8 justify-items-center
      sm:grid-cols-1 sm:gap-5 sm:px-8 sm:justify-items-start
      md:grid-cols-2 md:gap-5 md:px-8 md:justify-items-center
      lg:grid-cols-2 lg:gap-5 lg:pl-8 lg:justify-items-start
      xl:grid-cols-2 xl:gap-8 xl:px-8 xl:justify-items-center
      2xl:grid-cols-2 2xl:gap-8 2xl:px-16 2xl:justify-center  
    ">
      <ActionCard
        bgColor="bg-[#2563EB]"
        title="List Your Room"
        description="Become a host and earn money by renting out your space"
        buttonText="Start Listing"
        buttonTextColor="text-[#2563EB]"
        onClick={() => {
          navigate("/property/create");
        }}
      />
      
      <ActionCard
        bgColor="bg-[#0891B2]"
        title="Find Your Room"
        description="Browse thousands of verified rooms and find your perfect match"
        buttonText="Start Searching"
        buttonTextColor="text-[#0891B2]"
        onClick={() => {
          navigate("/property/all-rooms");
        }}
      />
    </div>
  );
};

interface ActionCardProps {
  bgColor: string;
  title: string;
  description: string;
  buttonText: string;
  buttonTextColor: string;
  onClick: () => void;
}

const ActionCard = ({ bgColor, title, description, buttonText, buttonTextColor, onClick }: ActionCardProps) => {
  return (
    <div className={`${bgColor} text-white flex flex-col justify-center items-center text-center rounded-2xl
      w-80 h-50 p-4 
      sm:w-155 sm:h-50 sm:p-4 
      md:w-88 md:h-50 md:p-2 
      lg:w-115 lg:h-50 lg:p-4 
      xl:w-170 xl:h-50 xl:p-4 
      2xl:max-w-2xl 2xl:p-6
    `}>
      <div className="font-bold text-xl mb-2">
        {title}
      </div>
      <div className="mb-4">
        {description}
      </div>
      <div>
        <button className={`bg-white ${buttonTextColor} px-4 py-2 rounded-md font-medium cursor-pointer`} 
          onClick={onClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};