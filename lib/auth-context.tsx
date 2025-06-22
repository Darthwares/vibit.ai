'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { 
  auth, 
  getUserTeam, 
  updateUserMetadata,
  demoUser,
  isFirebaseEnabled,
  FirebaseUserWithTeam,
  signOut as firebaseSignOut
} from './firebase'
import { usePostHog } from 'posthog-js/react'

export interface AuthContextType {
  user: FirebaseUserWithTeam | null
  loading: boolean
  signIn: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: () => {},
  signOut: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUserWithTeam | null>(null)
  const [loading, setLoading] = useState(true)
  const posthog = usePostHog()

  useEffect(() => {
    console.log('AuthContext: Initializing, Firebase enabled:', isFirebaseEnabled)
    
    if (!isFirebaseEnabled || !auth) {
      console.log('AuthContext: Using demo user')
      setUser(demoUser)
      setLoading(false)
      return
    }

    console.log('AuthContext: Setting up Firebase auth listener')
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthContext: Auth state changed:', firebaseUser?.email || 'NO USER')
      
      if (firebaseUser) {
        try {
          // Simply use the Firebase user directly with optional team
          const userWithTeam = firebaseUser as FirebaseUserWithTeam
          
          // Try to get team but don't block on it
          getUserTeam(firebaseUser.uid)
            .then(team => {
              if (team) {
                userWithTeam.team = team
                setUser({ ...userWithTeam }) // Force re-render
              }
            })
            .catch(err => console.warn('Failed to get team:', err))
          
          console.log('AuthContext: Setting user:', userWithTeam.email)
          setUser(userWithTeam)
          
          // Update metadata and tracking
          updateUserMetadata(firebaseUser.uid).catch(console.warn)
          
          posthog?.identify(firebaseUser.uid, {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            is_fragments_user: true
          })
        } catch (error) {
          console.error('AuthContext: Error in auth handler:', error)
          setUser(null)
        }
      } else {
        console.log('AuthContext: No user, clearing state')
        setUser(null)
        posthog?.reset()
      }
      
      setLoading(false)
    })

    return () => {
      console.log('AuthContext: Cleaning up')
      unsubscribe()
    }
  }, []) // Remove posthog from deps to prevent re-running

  const signIn = () => {
    // This is handled by the auth dialog
  }

  const signOut = async () => {
    if (!auth || !isFirebaseEnabled) return
    
    try {
      console.log('AuthContext: Signing out')
      setLoading(true)
      await firebaseSignOut(auth)
      setUser(null)
      posthog?.capture('user_signed_out')
      posthog?.reset()
    } catch (error) {
      console.error('AuthContext: Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut
  }

  console.log('AuthContext: Rendering with user:', user?.email || 'NO USER', 'loading:', loading)

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}