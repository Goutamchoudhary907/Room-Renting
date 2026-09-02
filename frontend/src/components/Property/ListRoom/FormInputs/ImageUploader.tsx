import { ChangeEvent } from "react";

type ImageUploaderProps = {
  images: File[];
  imagePreviews: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

export const ImageUploader = ({
  images,
  imagePreviews,
  onChange,
  onClear,
  fileInputRef
}: ImageUploaderProps) => {
  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <label
          className="font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft"
          htmlFor="images"
        >
          Photos
        </label>
        <span className="font-sans text-xs text-taupe-light">{images.length}/10</span>
      </div>

      <div className="group relative cursor-pointer rounded-[18px] border-2 border-dashed border-[#d4cfc8] bg-cream p-6 text-center transition-all hover:border-amber hover:bg-amber/3">
        <input
          type="file"
          accept="image/jpeg, image/png"
          id="images"
          name="images"
          onChange={onChange}
          multiple
          ref={fileInputRef}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />

        {imagePreviews.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-28 w-28 rounded-xl object-cover"
                />
                {images?.[index] && (
                  <span className="absolute bottom-1 right-1 rounded bg-ink/70 px-1.5 py-0.5 font-sans text-[10px] font-medium text-white backdrop-blur">
                    {(images[index].size / 1024 / 1024).toFixed(1)}MB
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6">
            <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-amber/10 text-amber">
              <UploadIcon />
            </div>
            <div className="mb-1 font-sans text-sm font-semibold text-ink">
              Drop your photos here
            </div>
            <div className="font-sans text-xs text-taupe-light">
              or click to browse · JPEG, PNG up to 5MB each
            </div>
          </div>
        )}
      </div>

      {imagePreviews.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="mt-2.5 cursor-pointer self-start border-none bg-transparent p-0 font-sans text-[13px] font-semibold text-red-600 hover:text-red-700"
        >
          Clear all images
        </button>
      )}
    </div>
  );
};
