import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';
import { modal } from '@/utils/constants';

export interface User {
  uid?: string;
  username: string;
  bio: string;
  email: string;
  displayPicture: string;
  followers: { timestamp: Timestamp; uid: string }[];
  following: { timestamp: Timestamp; uid: string }[];
}

export interface UserUnverified {
  uid: string;
  email: string;
  password: string;
  timestamp: Timestamp;
}

export const currentUserState = atom({
  key: 'currentUserState',
  default: null as User | null,
});

export const navigationState = atom({
  key: 'navigationState',
  default: false as boolean,
});

export const modalState = atom({
  key: 'modalState',
  default: null as modal.login | modal.signUp | null,
});
