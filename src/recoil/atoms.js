import { atom } from 'recoil';

export const currentUserState = atom({
  key: 'currentUserState',
  default: null,
});

export const modalState = atom({
  key: 'modalState',
  default: null,
});
