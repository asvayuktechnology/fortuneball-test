"use client"; // Add this directive at the top

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { usePathname, useSearchParams } from 'next/navigation'; // Updated imports

type CookieOptions = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

const useCookie = <T,>(key: string, initialValue?: T) => {
  const [value, setValue] = useState<T | undefined>(() => {
    if (typeof window === 'undefined') return initialValue;
    
    const cookie = Cookies.get(key);
    if (cookie) { 
      try {
        return JSON.parse(cookie) as T;
      } catch {
        return cookie as unknown as T;
      }
    }
    return initialValue;
  });

  // Get current path and search params for dependency array
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setCookie = (
    newValue: T,
    options?: CookieOptions
  ) => {
    setValue(newValue);
    
    const stringValue = typeof newValue === 'string' 
      ? newValue 
      : JSON.stringify(newValue);
    
    Cookies.set(key, stringValue, {
      expires: options?.expires ?? 365,
      path: options?.path ?? '/',
      ...options,
    });
  };

  const deleteCookie = (options?: Omit<CookieOptions, 'expires'>) => {
    setValue(undefined);
    Cookies.remove(key, {
      path: options?.path ?? '/',
      ...options,
    });
  };

  // Handle route changes - simplified for App Router
  useEffect(() => {
    const cookie = Cookies.get(key);
    if (cookie) {
      try {
        setValue(JSON.parse(cookie) as T);
      } catch {
        setValue(cookie as unknown as T);
      }
    }
  }, [key, pathname, searchParams]); // Re-run when route changes

  return {
    value,
    setCookie,
    deleteCookie,
  };
};

export default useCookie;