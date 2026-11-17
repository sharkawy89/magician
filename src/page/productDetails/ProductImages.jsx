import React, { useEffect, useState } from "react";

function ProductImages({ product }) {
  const images = (
    Array.isArray(product?.images) ? product.images : []
  ).filter(Boolean);

  const fallbackImage = product?.thumbnail || "";

  const [selectedImage, setSelectedImage] = useState(null);

  const activeImage = selectedImage || images[0] || fallbackImage;

  useEffect(() => {
    setSelectedImage(null);
  }, [product?.id]);

  return (
    <div className="w-[40%]">
      <div className="mb-5 flex items-center justify-center">
        {activeImage ? (
          <img
            src={activeImage}
            alt={product.title}
            className="max-h-112.5 w-auto"
          />
        ) : (
          <div className="flex h-112.5 w-full items-center justify-center rounded-[5px] bg-surface-subtle text-[14px] text-ink-secondary">
            No image available
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="flex cursor-pointer justify-between">
          {images.map((img, index) => (
            <button
              type="button"
              className={`flex w-[24%] cursor-pointer items-center justify-center rounded-lg border-2 bg-surface p-1 transition-colors duration-150 ${
                activeImage === img
                  ? "border-ink"
                  : "border-transparent hover:border-border-strong"
              }`}
              key={`${img}-${index}`}
              aria-label={`View image ${index + 1} of ${
                images.length
              } for ${product.title}`}
              aria-pressed={activeImage === img}
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                alt=""
                className="max-h-37.5 w-auto object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImages;
