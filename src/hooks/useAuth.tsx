// // context/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import Cookies from 'js-cookie';

// interface AuthContextProps {
//     isLoggedIn: boolean;
//     setIsLoggedIn: (value: boolean) => void;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     useEffect(() => {
//         const token = Cookies.get('authToken');
//         setIsLoggedIn(!!token);
//     }, []);

//     return (
//         <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };

"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';

interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ⏳ 20 minutes idle timeout
    const IDLE_TIMEOUT = 20 * 60 * 1000; // 20 min  
    const idleTimer = useRef<NodeJS.Timeout | null>(null);

    // RESET Idle Timer (logged-in users only)
    const resetIdleTimer = () => {
        if (!Cookies.get('authToken')) return;

        if (idleTimer.current) clearTimeout(idleTimer.current);

        idleTimer.current = setTimeout(() => {
            Cookies.remove("authToken");
            setIsLoggedIn(false);
            window.location.href = "/login";
        }, IDLE_TIMEOUT);
    };

    useEffect(() => {
        if (!isLoggedIn) {
            if (idleTimer.current) clearTimeout(idleTimer.current);
            return;
        }

        const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

        events.forEach((event) => window.addEventListener(event, resetIdleTimer));
        resetIdleTimer();

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, resetIdleTimer)
            );
            if (idleTimer.current) clearTimeout(idleTimer.current);
        };
    }, [isLoggedIn]);

    // Check cookie at initial load
    useEffect(() => {
        const token = Cookies.get('authToken');
        setIsLoggedIn(!!token);
        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
