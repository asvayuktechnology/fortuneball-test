'use client';

import { useEffect, useState } from 'react';

interface TileCarouselProps {
  images: string[];
  alt?: string;
  shadow?: string;
}

const TileCarousel: React.FC<TileCarouselProps> = ({shadow,images, alt = 'MetaWinner' }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className={`w-full h-full overflow-hidden  ${shadow ? shadow : null} relative`}>
      <div
        className="flex transition-transform duration-700 ease-in-out w-full h-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={alt}
            className="w-full h-full object-contain flex-shrink-0 "
          />
        ))}
      </div>
    </div>
  );
};

export default TileCarousel;
