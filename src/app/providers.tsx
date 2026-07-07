// app/providers.tsx
'use client'

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'
// import { type ThemeProviderProps } from 'next-themes/dist/types'
import * as React from 'react'

export function Providers({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}