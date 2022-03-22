import { collection, doc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { db, storage } from './config';

export const serverCol = collection(db, 'server');
export const serverTimestampDoc = doc(serverCol, 'timestamp');
export const usersCol = collection(db, 'users');
export const userDoc = (id) => doc(usersCol, id);
export const userFollowersCol = (id) => collection(userDoc(id), 'followers');
export const userFollowingCol = (id) => collection(userDoc(id), 'following');
export const usersUnverifiedCol = collection(db, 'users_unverified');
export const userUnverifiedDoc = (id) => doc(usersUnverifiedCol, id);
export const usersRef = ref(storage, 'users')
export const userRef = (id) => ref(usersRef, `/${id}`)
export const defaultDpRef = ref(storage, 'stock-imgs/dp.png')
