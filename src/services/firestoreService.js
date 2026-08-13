import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export async function saveAIHistory(type, title, prompt, response) {
  try {
    if (!auth.currentUser) return;

    await addDoc(
      collection(db, "users", auth.currentUser.uid, "aiHistory"),
      {
        type,
        title,
        prompt,
        response,
        createdAt: serverTimestamp(),
      }
    );
  } catch (error) {
    console.error("Firestore Save Error:", error);
  }
}