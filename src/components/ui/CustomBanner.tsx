'use client';

import React, { useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image, { StaticImageData } from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { UPLOAD_URL } from "@/libs/api/const";

interface BannerCarouselProps {
  images: StaticImageData[] | string[]; 
  disableRounded?: boolean;
  notbanner?: boolean;
  smallbanner?:boolean;
}

const CustomBannerCarousel: React.FC<BannerCarouselProps> = ({smallbanner, notbanner, images, disableRounded = false }) => {
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current]);

  if (!images || images.length === 0) return null;



  
  return (
    <div
      className={`overflow-hidden w-full h-[210px] ${disableRounded ? '' : 'rounded-b-[30px]'}`}
      ref={emblaRef}
    >
      <div className="flex h-[210px]">
        {images.map((img, idx) => (
          <div key={idx} className={`min-w-full relative   h-[210px]`}>
            <Image
             src={img}
              alt={`slide-${idx}`}
              fill
              className={`object-cover  ${smallbanner ? "h-[210px]" : null}`}
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomBannerCarousel;
