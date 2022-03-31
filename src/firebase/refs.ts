import { collection, doc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { db, storage } from './config';

export const serverCol = collection(db, 'server');
export const serverTimestampDoc = doc(serverCol, 'timestamp');
export const usersCol = collection(db, 'users');
export const userDoc = (id: string) => doc(usersCol, id);
export const usersUnverifiedCol = collection(db, 'users_unverified');
export const userUnverifiedDoc = (id: string) => doc(usersUnverifiedCol, id);
export const usersRef = ref(storage, 'users/');
export const userRef = (id: string) => ref(usersRef, `${id}/`);
export const stockRef = ref(storage, 'stock/');
