import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export const signup = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const logout = () =>
  signOut(auth);

const FRIENDLY_AUTH_ERRORS = {
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/popup-closed-by-user": "Google sign-in was closed before completing.",
  "auth/network-request-failed": "Network error. Please check your connection and try again.",
};

/** Converts a Firebase Auth error into a short, user-friendly message. */
export function getAuthErrorMessage(error) {
  const code = error?.code || "";
  return FRIENDLY_AUTH_ERRORS[code] || "Something went wrong. Please try again.";
}