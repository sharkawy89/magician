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
          <div className="flex h-112.5 w-full items-center justify-center rounded-[5px] bg-soft text-[14px] text-paragraph">
            No image available
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="flex cursor-pointer justify-between">
          {images.map((img, index) => (
            <div
              className="flex w-[24%] items-center justify-center"
              key={`${img}-${index}`}
            >
              <img
                src={img}
                alt={`${product.title} ${index + 1}`}
                className="max-h-37.5 w-auto object-cover"
                onClick={() => setSelectedImage(img)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImages;
