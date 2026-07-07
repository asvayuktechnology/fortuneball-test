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
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({notbanner, images, disableRounded = false }) => {
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className={`overflow-hidden w-full h-full ${disableRounded ? '' : 'rounded-b-[30px]'}`}
      ref={emblaRef}
    >
      <div className="flex h-full">
        {images.map((img, idx) => (
          <div key={idx} className={`min-w-full relative  ${notbanner ? "w-full h-full" : "h-[209px] sm:h-[550px]"}`}>
            {
              !notbanner ? 
              <>
              {img ? <Image
              src={`${UPLOAD_URL}/${img}`} 
              alt={`slide-${idx}`}
              fill
              className={`object-cover`}
              priority={idx === 0}
            /> : ""}
              </>
              :
              <>
              {img ? <Image
              src={`${UPLOAD_URL}/${img}`} 
              alt={`slide-${idx}`}
              fill
              className={`object-cover ${notbanner ? "sm:block hidden" : ""}`}
              priority={idx === 0}
            /> : ""}

              <Image
              src={`/minibanner.webp`} 
              alt={`slide-${idx}`}
              fill
              className={`object-cover ${notbanner ? "block sm:hidden object-left" : ""}`}
              priority={idx === 0}
            /> 
              </>
            }
            
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
