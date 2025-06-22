'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import posthog from 'posthog-js'
import { PostHogProvider as PostHogProviderJS } from 'posthog-js/react'
import { AuthProvider } from '@/lib/auth-context'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_POSTHOG) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only',
    session_recording: {
      recordCrossOriginIframes: true,
    }
  })
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return process.env.NEXT_PUBLIC_ENABLE_POSTHOG ? (
    <PostHogProviderJS client={posthog}>
      <AuthProvider>{children}</AuthProvider>
    </PostHogProviderJS>
  ) : (
    <AuthProvider>{children}</AuthProvider>
  )
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
