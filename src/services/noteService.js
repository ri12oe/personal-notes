import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const notesCollection = collection(db, "notes");

export async function createNote({ title, content, type }, userId) {
  await addDoc(notesCollection, {
    title,
    content,
    type,
    favorite: false,
    deleted: false,
    createdAt: serverTimestamp(),
    userId,
  });
}

export function subscribeToNotes(userId, callback, onError) {
  const q = query(notesCollection, where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const notes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Newest first; pending server timestamps are null, so treat them as "now".
      const time = (n) => (n.createdAt ? n.createdAt.toMillis() : Date.now());
      notes.sort((a, b) => time(b) - time(a));
      callback(notes);
    },
    onError,
  );
}

export async function updateNote(noteId, updates) {
  await updateDoc(doc(notesCollection, noteId), updates);
}

export async function removeNote(noteId) {
  await updateNote(noteId, { deleted: true });
}

export async function restoreNote(noteId) {
  await updateNote(noteId, { deleted: false });
}

export async function permanentlyRemoveNote(noteId) {
  await deleteDoc(doc(notesCollection, noteId));
}
