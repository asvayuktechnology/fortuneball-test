"use client";
import { Asap, Geist, Geist_Mono, Inter, Nunito_Sans } from "next/font/google";
import 'react-phone-input-2/lib/style.css';
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import seabackground from '../../public/images/seabackground.jpg';
import Head from 'next/head';
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Providers } from "./providers";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { RECAPTCHA_SITE_KEY } from "@/libs/api/const";
// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
const nunito = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});
const asap = Asap({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-asap',
});

// RootLayout component
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const [bgStyle, setBgStyle] = useState({});

  // const [showModal, setShowModal] = useState(false);

//  useEffect(() => {
//     // Check if modal was already shown
//     const hasShown = localStorage.getItem("promoModalShown");

//     if (!hasShown) {
//       // Show modal only first time
//       setShowModal(true);
//       localStorage.setItem("promoModalShown", "true");
//     }
//   }, []);

  return (
    <html lang="en" className="" suppressHydrationWarning>
      <head>
        <title>
          FortuneBall - Powered By FortuneNft
        </title>

        <meta
          name="description"
          content="Play FortuneBall on FortuneNFT using MTHT tokens. Enjoy exciting blockchain gaming, compete for rewards, and experience the future of Web3 entertainment."
        />
        <meta
          name="keywords"
          content="FortuneBall"
        />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="FortuneBall - Powered By FortuneNft"
        />
        <meta
          property="og:description"
          content="Play FortuneBall on FortuneNFT using MTHT tokens. Enjoy exciting blockchain gaming, compete for rewards, and experience the future of Web3 entertainment."
        />
        <meta property="og:url" content="https://playdex.live" />
        <meta property="og:site_name" content="Play FortuneBall" />
        <meta property="og:image" content="/images/fball.png" />
        <meta
          property="og:image:secure_url"
          content="/images/fball.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="FortuneBall - Powered By FortuneNft."
        />
        <meta
          name="twitter:description"
          content="Play FortuneBall on FortuneNFT using MTHT tokens. Enjoy exciting blockchain gaming, compete for rewards, and experience the future of Web3 entertainment."
        />
        <meta name="twitter:image" content="/images/fball.png" />
        <meta name="twitter:url" content="https://playdex.live" />

        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>

      <body
        className={`dark ${inter.variable} ${inter.variable} min-h-screen antialiased pb-15 max-w-[1000px] w-full mx-auto bg-[#170b40] pb-28 `}
      >
        <Providers attribute="class"  enableSystem={false}>
          <Suspense fallback={null}>
               <GoogleReCaptchaProvider
            reCaptchaKey={RECAPTCHA_SITE_KEY}
            scriptProps={{
              async: true,
              defer: true,
              appendTo: "head",
            }}
          >
            <QueryClientProvider client={queryClient}>
              <div className="relative">{children}</div>
              <Toaster position="top-right" />
            </QueryClientProvider> 
             </GoogleReCaptchaProvider>
          </Suspense>
          {/* Modal */}
          {/* {showModal && (
            <div
              className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
              onClick={() => setShowModal(false)}
            >
              <div
                className="relative max-w-sm w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-white bg-black/40 hover:bg-black/60 rounded-full p-1"
                  onClick={() => setShowModal(false)}
                >
                  <X size={20} />
                </button>
                <Image
                  src="/images/bonanza1test.png"
                  alt="Promo Banner"
                  width={600}
                  height={600}
                  className="rounded-xl w-full h-auto shadow-lg"
                />
              </div>
            </div>
          )} */}
        </Providers>
      </body>
    </html>
  );
}
