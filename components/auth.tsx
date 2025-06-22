'use client'

import { useState } from 'react'
import { usePostHog } from 'posthog-js/react'
import { toast } from '@/components/ui/use-toast'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { validateEmail } from '@/app/actions/validate-email'
import { Phone } from 'lucide-react'
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  updateProfile,
  googleProvider,
  isFirebaseEnabled,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult
} from '@/lib/firebase'

export interface AuthProps {
  onClose?: () => void
}

export function Auth({ onClose }: AuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState<'google' | null>(null)
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'reset'>('signin')
  
  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Phone auth states
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
  
  const posthog = usePostHog()

  if (!isFirebaseEnabled || !auth) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">Authentication is not enabled.</p>
      </div>
    )
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      posthog?.capture('user_signed_in', {
        method: 'email',
        user_id: userCredential.user.uid
      })
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      })
      
      // Give Firebase time to update auth state before closing
      setTimeout(() => {
        onClose?.()
      }, 100)
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      // Validate email if ZeroBounce is configured
      if (process.env.NEXT_PUBLIC_ZEROBOUNCE_API_KEY) {
        const validation = await validateEmail(email)
        if (!validation.isValid) {
          toast({
            title: 'Invalid email',
            description: validation.error || 'Please use a valid email address.',
            variant: 'destructive',
          })
          setIsLoading(false)
          return
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name if needed
      if (userCredential.user && !userCredential.user.displayName) {
        await updateProfile(userCredential.user, {
          displayName: email.split('@')[0]
        })
      }
      
      posthog?.capture('user_signed_up', {
        method: 'email',
        user_id: userCredential.user.uid
      })
      
      toast({
        title: 'Account created!',
        description: 'Welcome to Fragments.',
      })
      
      // Give Firebase time to update auth state before closing
      setTimeout(() => {
        onClose?.()
      }, 100)
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for instructions to reset your password.',
      })
      
      setActiveTab('signin')
    } catch (error: any) {
      toast({
        title: 'Password reset failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setIsLoading(true)

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/verify`,
        handleCodeInApp: true,
      }
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      
      // Save email for later verification
      window.localStorage.setItem('emailForSignIn', email)
      
      toast({
        title: 'Magic link sent!',
        description: 'Check your email for the sign-in link.',
      })
    } catch (error: any) {
      toast({
        title: 'Magic link failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const setupRecaptcha = () => {
    if (!auth || recaptchaVerifier) return
    
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      }
    })
    setRecaptchaVerifier(verifier)
    return verifier
  }

  const handlePhoneSignIn = async () => {
    setIsLoading(true)

    try {
      const verifier = recaptchaVerifier || setupRecaptcha()
      if (!verifier) {
        throw new Error('Failed to initialize reCAPTCHA')
      }

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier)
      setConfirmationResult(confirmation)
      
      toast({
        title: 'Verification code sent!',
        description: 'Please enter the code sent to your phone.',
      })
    } catch (error: any) {
      toast({
        title: 'Phone sign in failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      })
      
      // Reset reCAPTCHA on error
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
        setRecaptchaVerifier(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!confirmationResult) return
    
    setIsLoading(true)

    try {
      const userCredential = await confirmationResult.confirm(verificationCode)
      
      posthog?.capture('user_signed_in', {
        method: 'phone',
        user_id: userCredential.user.uid
      })
      
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with your phone.',
      })
      
      // Give Firebase time to update auth state before closing
      setTimeout(() => {
        onClose?.()
      }, 100)
    } catch (error: any) {
      toast({
        title: 'Verification failed',
        description: error.message || 'Please check the code and try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: 'google') => {
    setIsSocialLoading(provider)

    try {
      if (!googleProvider) {
        throw new Error('Google provider not initialized')
      }
      const authProvider = googleProvider
      const userCredential = await signInWithPopup(auth, authProvider)
      
      posthog?.capture('user_signed_in', {
        method: provider,
        user_id: userCredential.user.uid
      })
      
      toast({
        title: 'Welcome!',
        description: `You have successfully signed in with ${provider}.`,
      })
      
      // Give Firebase time to update auth state before closing
      setTimeout(() => {
        onClose?.()
      }, 100)
    } catch (error: any) {
      // Handle popup closed by user
      if (error.code === 'auth/popup-closed-by-user') {
        // Silent fail - user cancelled
      } else {
        toast({
          title: `${provider} sign in failed`,
          description: error.message || 'Please try again.',
          variant: 'destructive',
        })
      }
    } finally {
      setIsSocialLoading(null)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="reset">Reset</TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="space-y-4">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialSignIn('google')}
            disabled={isLoading || isSocialLoading !== null}
          >
            {isSocialLoading === 'google' ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Sign in with Google
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={handleMagicLink}
            disabled={isLoading || !email}
          >
            <Icons.mail className="mr-2 h-4 w-4" />
            Send Magic Link
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign in with phone
              </span>
            </div>
          </div>

          {!confirmationResult ? (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePhoneSignIn}
                disabled={isLoading || !phoneNumber}
              >
                <Phone className="mr-2 h-4 w-4" />
                Send Verification Code
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isLoading}
              />
              <Button
                className="w-full"
                onClick={handleVerifyCode}
                disabled={isLoading || !verificationCode}
              >
                Verify Code
              </Button>
            </div>
          )}

          <div id="recaptcha-container"></div>
        </TabsContent>

        <TabsContent value="signup" className="space-y-4">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="reset" className="space-y-4">
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}