import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const DAILY_LIMIT = 5;

const today = () => new Date().toISOString().split("T")[0];

export async function getUsage(uid) {
  if (!uid) return null;

  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  // User document doesn't exist
  if (!snap.exists()) {
    const data = {
      dailyUsage: 0,
      lastReset: today(),
    };

    await setDoc(ref, data, { merge: true });
    return data;
  }

  const rawData = snap.data();

  const data = {
    dailyUsage: rawData.dailyUsage ?? 0,
    lastReset: rawData.lastReset ?? today(),
  };

  // Add missing fields if required
  if (
    rawData.dailyUsage === undefined ||
    rawData.lastReset === undefined
  ) {
    await updateDoc(ref, data);
  }

  // Reset usage every new day
  if (data.lastReset !== today()) {
    const resetData = {
      dailyUsage: 0,
      lastReset: today(),
    };

    await updateDoc(ref, resetData);
    return resetData;
  }

  return data;
}

export async function canGenerate(uid) {
  const usage = await getUsage(uid);

  if (!usage) return false;

  return usage.dailyUsage < DAILY_LIMIT;
}

export async function incrementUsage(uid) {
  const usage = await getUsage(uid);

  if (!usage) return;

  await updateDoc(doc(db, "users", uid), {
    dailyUsage: usage.dailyUsage + 1,
  });
}

export async function getRemainingUsage(uid) {
  const usage = await getUsage(uid);

  if (!usage) return 0;

  return DAILY_LIMIT - usage.dailyUsage;
}

export { DAILY_LIMIT };