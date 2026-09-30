import { auth, db, isFirebaseConfigured } from './firebase/config';
import { DEMO_USERS } from './demoData';
import { UserProfile, UserRole } from '@/types';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CURRENT_USER_KEY = 'civicai_current_user_profile';

class AuthService {
  private currentProfile: UserProfile = DEMO_USERS.CITIZEN;
  private authListeners: Set<(user: UserProfile | null) => void> = new Set();

  constructor() {
    // Restore cached user session if any
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) {
        this.currentProfile = JSON.parse(saved);
      }
    } catch {
      this.currentProfile = DEMO_USERS.CITIZEN;
    }

    if (isFirebaseConfigured && auth && db) {
      onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const profile = await this.fetchUserProfileFromFirestore(fbUser.uid);
          if (profile) {
            this.setSession(profile);
          } else {
            // New user without doc yet
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Citizen',
              role: 'CITIZEN',
              createdAt: new Date().toISOString(),
            };
            await this.saveUserProfileToFirestore(newProfile);
            this.setSession(newProfile);
          }
        }
      });
    }
  }

  private setSession(profile: UserProfile | null) {
    if (profile) {
      this.currentProfile = profile;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    this.authListeners.forEach((cb) => cb(profile));
  }

  public subscribe(callback: (user: UserProfile | null) => void): () => void {
    this.authListeners.add(callback);
    callback(this.currentProfile);
    return () => this.authListeners.delete(callback);
  }

  public getCurrentUser(): UserProfile {
    return this.currentProfile;
  }

  public async switchDemoRole(role: UserRole): Promise<UserProfile> {
    const demoProfile = DEMO_USERS[role] || DEMO_USERS.CITIZEN;
    this.setSession(demoProfile);
    return demoProfile;
  }

  public async loginWithEmail(email: string, pass: string): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const profile = await this.fetchUserProfileFromFirestore(cred.user.uid);
      if (profile) {
        this.setSession(profile);
        return profile;
      }
    }

    // Demo fallback matching
    const matchingKey = Object.keys(DEMO_USERS).find(
      (k) => DEMO_USERS[k].email.toLowerCase() === email.toLowerCase()
    );
    const profile = matchingKey ? DEMO_USERS[matchingKey] : {
      ...DEMO_USERS.CITIZEN,
      email,
      displayName: email.split('@')[0],
    };
    this.setSession(profile);
    return profile;
  }

  public async loginWithGoogle(): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const profile = await this.fetchUserProfileFromFirestore(cred.user.uid);
      if (profile) {
        this.setSession(profile);
        return profile;
      }
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || 'Citizen',
        role: 'CITIZEN',
        createdAt: new Date().toISOString(),
      };
      await this.saveUserProfileToFirestore(newProfile);
      this.setSession(newProfile);
      return newProfile;
    }

    // Demo fallback
    const profile = DEMO_USERS.CITIZEN;
    this.setSession(profile);
    return profile;
  }

  public async register(email: string, pass: string, displayName: string, role: UserRole = 'CITIZEN'): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName,
        role,
        createdAt: new Date().toISOString(),
      };
      await this.saveUserProfileToFirestore(newProfile);
      this.setSession(newProfile);
      return newProfile;
    }

    const newProfile: UserProfile = {
      uid: `user-${Date.now()}`,
      email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
    };
    this.setSession(newProfile);
    return newProfile;
  }

  public async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    this.setSession(null);
  }

  private async fetchUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
    if (!db) return null;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (e) {
      console.error('Error fetching user document from Firestore:', e);
    }
    return null;
  }

  private async saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
    if (!db) return;
    try {
      await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
    } catch (e) {
      console.error('Error saving user document to Firestore:', e);
    }
  }
}

export const authService = new AuthService();
