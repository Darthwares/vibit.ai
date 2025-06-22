import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth'
import { 
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Check if Firebase is enabled
export const isFirebaseEnabled = process.env.NEXT_PUBLIC_ENABLE_FIREBASE === 'true'


// Initialize Firebase app only if enabled
export const app = isFirebaseEnabled 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null

// Export Firebase services
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null

// Set persistence to local
if (auth && typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(console.error)
}

// Initialize Analytics (only in browser and if supported)
export const analytics = app && typeof window !== 'undefined' 
  ? isSupported().then(yes => yes ? getAnalytics(app) : null).catch(() => null)
  : null

// Auth providers
export const googleProvider = app ? new GoogleAuthProvider() : null

// Team interface matching existing structure
export interface Team {
  id: string
  name: string
  tier: string
  email: string
}

// Extended Firebase User with team info
export type FirebaseUserWithTeam = User & {
  team?: Team
}

// Get user's default team
export async function getUserTeam(userId: string): Promise<Team | null> {
  if (!db || !isFirebaseEnabled) return null
  
  try {
    // First check users_teams collection for default team
    const userTeamsQuery = query(
      collection(db, 'users_teams'),
      where('user_id', '==', userId),
      where('is_default', '==', true)
    )
    
    const userTeamsSnapshot = await getDocs(userTeamsQuery)
    
    if (userTeamsSnapshot.empty) {
      // If no default team exists, create one
      const defaultTeam: Team = {
        id: `team_${userId}`,
        name: 'Default Team',
        tier: 'free',
        email: auth?.currentUser?.email || ''
      }
      
      // Create team document
      await setDoc(doc(db, 'teams', defaultTeam.id), {
        ...defaultTeam,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      })
      
      // Create user_teams relationship
      await setDoc(doc(db, 'users_teams', `${userId}_${defaultTeam.id}`), {
        user_id: userId,
        team_id: defaultTeam.id,
        is_default: true,
        created_at: serverTimestamp()
      })
      
      return defaultTeam
    }
    
    // Get the team ID from the relationship
    const userTeamData = userTeamsSnapshot.docs[0].data()
    const teamId = userTeamData.team_id
    
    // Fetch the actual team data
    const teamDoc = await getDoc(doc(db, 'teams', teamId))
    
    if (!teamDoc.exists()) {
      console.error('Team document not found for ID:', teamId)
      return null
    }
    
    return teamDoc.data() as Team
  } catch (error) {
    console.error('Error fetching user team:', error)
    return null
  }
}

// Update user metadata to mark as fragments user
export async function updateUserMetadata(userId: string) {
  if (!db || !isFirebaseEnabled) return
  
  try {
    await setDoc(doc(db, 'users', userId), {
      is_fragments_user: true,
      updated_at: serverTimestamp()
    }, { merge: true })
  } catch (error) {
    console.error('Error updating user metadata:', error)
  }
}

// Demo user for when Firebase is disabled
export const demoUser: FirebaseUserWithTeam = {
  uid: 'demo',
  email: 'demo@e2b.dev',
  displayName: 'Demo User',
  photoURL: null,
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString()
  },
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'demo-token',
  getIdTokenResult: async () => ({
    token: 'demo-token',
    authTime: new Date().toISOString(),
    issuedAtTime: new Date().toISOString(),
    expirationTime: new Date().toISOString(),
    signInProvider: 'custom',
    signInSecondFactor: null,
    claims: {}
  }),
  reload: async () => {},
  toJSON: () => ({}),
  phoneNumber: null,
  providerId: 'firebase',
  team: {
    id: 'demo-team',
    name: 'Demo Team',
    tier: 'free',
    email: 'demo@e2b.dev'
  }
}

// Export auth functions
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  firebaseSignOut as signOut,
  onAuthStateChanged,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  setPersistence,
  browserLocalPersistence,
  type ConfirmationResult
}