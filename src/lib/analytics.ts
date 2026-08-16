import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

export async function incrementPageViews() {
  try {
    const docRef = doc(db, "analytics", "pageviews");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        count: increment(1)
      });
    } else {
      await setDoc(docRef, {
        count: 1
      });
    }
  } catch (error) {
    console.error("Failed to increment page views:", error);
  }
}
