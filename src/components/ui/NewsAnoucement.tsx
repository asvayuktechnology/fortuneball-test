// import React from 'react'
// import Image from 'next/image'
// export default function NewsAnoucement({ announcement }: { announcement: string }) {
//     return (
//         <div className="px-4 md:mt-4 -mt-7 md:mb-0 mb-4">
//             <div className="flex items-center gap-4 bg-[rgb(41_41_47)] rounded-xl shadow px-3 py-2 ticker-wrapper">
//                 <div className="flex-shrink-0">
//                     <Image width={40} height={40} src="/images/megaphone.svg" alt="News" />
//                 </div>
//                 <div className="w-full overflow-hidden">
//                     <ul className="ticker w-full flex gap-8">
                        
//                             <li className='inline-block mr-14'>
//                                 <a href="#" className="sm:text-sm text-[12px] text-white font-semibold hover:underline">
//                                     {announcement}
//                                 </a>
//                             </li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     )
// }

"use client";
import React from "react";
import Image from "next/image";

export default function NewsAnoucement({
  announcement,
}: {
  announcement: string;
}) {
  return (
    <div className="px-3 mt-2 mb-3 md:mt-4 md:mb-0">
      <div className="flex items-center gap-3 bg-[rgb(41_41_47)] rounded-xl shadow px-3 py-2 overflow-hidden">
        {/* Icon */}
        <div className="flex-shrink-0">
          <Image
            width={32}
            height={32}
            src="/images/megaphone.svg"
            alt="News"
          />
        </div>

        {/* Scrolling text */}
        <div className="overflow-hidden w-full">
          <ul
            className="flex animate-ticker whitespace-nowrap w-max"
            style={{ animationDuration: "20s" }}
          >
            <li className="inline-block mr-10">
              <a
                href="#"
                className="text-white font-semibold text-[12px] sm:text-sm hover:underline"
              >
                {announcement}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-ticker {
          animation: ticker linear infinite;
        }

        @media (max-width: 640px) {
          .animate-ticker {
            animation-duration: 25s; /* slower on mobile */
          }
        }
      `}</style>
    </div>
  );
}

