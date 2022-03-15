import { db } from './config';
import { collection, doc } from 'firebase/firestore';

export const usersCol = collection(db, 'users');
export const userDoc = (id) => doc(usersCol, id);
export const usersUnverifiedCol = collection(db, 'users_unverified');
export const userUnverifiedDoc = (id) => doc(usersUnverifiedCol, id);
