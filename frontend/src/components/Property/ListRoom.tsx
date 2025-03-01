import { ChangeEvent } from "react";
import HomeIcon from "../../assets/Home_icon.png";
import ImageIcon from "../../assets/ImageIconListRoom.png";
export const ListRoom = () => {
  return (
    <div className="flex justify-center items-center bg-[#E6E6E6]">
      <div className=" h-200 w-280 pt-20 p-15">
        <h2 className="text-[#111827] font-bold text-2xl">List Your Room</h2>
        <p className="text-[17px] text-[#4B5563] mt-1">
          Fill in the details to create your listing
        </p>

        <div className=" bg-white h-200 flex flex-col items-start pl-6 pt-4 mt-6 rounded-2xl">
          <div className="flex items-center">
            <img
              className="mr-1 w-6 h-6 mt-2 "
              src={HomeIcon}
              alt="Home Icon"
            />
            <h3 className="font-semibold pt-2 text-xl">Room Details</h3>
          </div>
          <div className="mt-4">
            <InputField
              label="Room Title"
              placeholder="Enter an attractive title for your room"
              type="text"
              id="title"
              className="mt-2 h-12 rounded-2xl p-3 text-long "
            />
          </div>

          <div className="mt-4">
            <InputField
              label="Description"
              placeholder="Describe your room in detail"
              type="textarea"
              id="title"
              className="mt-2 rounded-2xl p-3 text-long"
            />
          </div>

          <div className="flex flex-col mt-4">
            <label
              className="mt-2 font-semibold text-sm text-[#374151]"
              htmlFor="images"
            >
              Upload Images
            </label>

            <div className="mt-2 w-237 h-50 border-2 border-dashed border-[#dcdee4] flex flex-col items-center justify-center rounded-lg cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                id="images"
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="pb-4">
                <img className=" w-8 h-8 " src={ImageIcon} alt="Image" />
              </div>
              <p className=" text-gray-500 text-sm text-center">
                Drag & Drop your images here <br /> or
              </p>
              <button
                type="button"
                className="mt-2 px-4 py-2 text-white bg-[#2563EB] rounded-lg text-sm font-medium"
              >
                Browse Files
              </button>
            </div>

            <div className="flex mt-4 gap-4">
              <div className="w-1/2">
                <label htmlFor="bedroom" className="block font-semibold text-sm text-[#374151] mb-1"
                > Number Of Bedrooms</label>
                <select id="bedroom" className="w-full border border-[#ccced3] rounded p-2">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>

             
              <div className="w-1/2">
                <label htmlFor="bathroom" className=" block font-semibold text-sm text-[#374151] mb-1">
                    Number Of Bathrooms</label>
                <select id="bathroom" className="w-full border border-[#ccced3] rounded p-2">
                  <option value="1">1</option>
                  <option value="1.5">1.5</option>
                  <option value="2">2</option>
                  <option value="2.5">2.5</option>
                  <option value="3">3.5</option>
                  <option value="4+">4+</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputFieldType {
  label: string;
  type: string;
  placeholder: string;
  id: string;
  // onChange:(e:ChangeEvent<HTMLInputElement>)=> void;
  className?: string;
}

function InputField({
  label,
  type,
  placeholder,
  id,
  className,
}: InputFieldType) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="font-semibold text-sm text-[#374151] ">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          className={`w-237 border border-[#ccced3] placeholder-black placeholder-opacity-100 h-24  ${className}`}
        />
      ) : (
        <input
          type={type}
          //   onChange={onChange}
          id={id}
          placeholder={placeholder}
          className={`w-237 border-1 border-[#ccced3] placeholder-black placeholder-opacity-100 ${className}`}
        />
      )}
    </div>
  );
}

interface SelectInputType {
    label: string;
    id: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }

function SelectInput({label,id,options,onChange, value}:SelectInputType){
    return(
        <div>
            <label htmlFor={id} className="block font-semibold text-sm text-[#374151] mb-1">
                {label}
            </label>
            <select id={id} className="w-full border border-[#ccced3] rounded p-2" 
            value={value} onChange={onChange}>
                {options.map((options) =>(
                    <option value={options.value} key={options.value}>
                        {options.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
