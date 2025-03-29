import { ChangeEvent } from "react";
import ImageIcon from "../../../../assets/ImageIconListRoom.png";

type ImageUploaderProps = {
  images: File[];
  imagePreviews: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export const ImageUploader = ({
  images,
  imagePreviews,
  onChange,
  onClear,
  fileInputRef
}: ImageUploaderProps) => {
  return (
    <div className="flex flex-col mt-4">
      <label className="mt-2 font-semibold text-sm text-[#374151]" htmlFor="images">
        Upload Images ({images.length}/10)
      </label>

      <div className="mt-2 h-50 border-2 border-dashed border-[#dcdee4] flex flex-col items-center justify-center rounded-lg cursor-pointer relative">
        <input
          type="file"
          accept="image/jpeg, image/png"
          id="images"
          name="images"
          onChange={onChange}
          multiple
          ref={fileInputRef}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
        
        {imagePreviews.length > 0 ? (
          <div className="flex flex-wrap justify-center">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative m-2"> 
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-32 h-32 object-cover m-2 rounded-lg"
                />
                {images ?.[index] && (
               <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
               {(images[index].size / 1024 / 1024).toFixed(1)}MB
             </span>
                )}
            
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="pb-4">
              <img className="w-8 h-8" src={ImageIcon} alt="Image" />
            </div>
            <p className="text-gray-500 text-sm text-center">
              Drag & Drop your images here <br /> or
            </p>
            <button
              type="button"
              className="mt-2 px-4 py-2 text-white bg-[#2563EB] rounded-lg text-sm font-medium"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </button>
          </>
        )}
      </div>

      {imagePreviews.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="mt-2 text-sm text-red-500 underline self-start"
        >
          Clear All Images
        </button>
      )}
    </div>
  );
};