import { atom } from 'recoil';

export const navigationState = atom({
  key: 'navigationState',
  default: false,
});

export const currentUserState = atom({
  key: 'currentUserState',
  default: null,
});

export const modalState = atom({
  key: 'modalState',
  default: null,
});
