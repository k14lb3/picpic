import { FC, useState, useEffect } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref, getDownloadURL } from 'firebase/storage';
import { getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth } from '@/firebase/config';
import { userUnverifiedDoc, userDoc, stockRef } from '@/firebase/refs';
import { useSetRecoilState } from 'recoil';
import { User, currentUserState } from '@/recoil/atoms';
import { Splash } from '@/components/ui';

const Root: FC = ({ children }) => {
  const setCurrentUserAtom = useSetRecoilState(currentUserState);
  const [splash, setSplash] = useState<boolean>(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (user?.emailVerified) {
          if (user.photoURL) {
            setCurrentUserAtom(
              (await getDoc(userDoc(user.uid))).data() as User
            );
          } else {
            const defaultDpUrl = await getDownloadURL(ref(stockRef, '/dp'));

            const _user = {
              email: user.email,
              username: user.displayName,
              displayPicture: defaultDpUrl,
              bio: '',
              followers: [],
              following: [],
            } as User;

            await deleteDoc(userUnverifiedDoc(user.uid));

            await setDoc(userDoc(user.uid), _user);

            await updateProfile(auth.currentUser!, {
              photoURL: defaultDpUrl,
            });

            setCurrentUserAtom(_user);
          }
        }

        setSplash(false);
      }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return splash ? <Splash /> : <>{children}</>;
};

export default Root;
