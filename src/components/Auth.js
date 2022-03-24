import { useState, useEffect } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref, getDownloadURL } from 'firebase/storage';
import { getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { auth } from '@firebase/config';
import {
  userUnverifiedDoc,
  userDoc,
  stockRef,
} from '@firebase/refs';
import { useSetRecoilState } from 'recoil';
import { currentUserState } from '@recoil/atoms';
import Splash from '@components/Splash';
import Modal from '@components/Modal';

const Auth = ({ children }) => {
  const setCurrentUserAtom = useSetRecoilState(currentUserState);
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.emailVerified) {
        if (user.photoURL) {
          setCurrentUserAtom((await getDoc(userDoc(user.uid))).data());
        } else {
          const defaultDpUrl = await getDownloadURL(ref(stockRef, '/dp'));

          const _user = {
            email: user.email,
            username: user.displayName,
            displayPicture: defaultDpUrl,
          };

          await deleteDoc(userUnverifiedDoc(user.uid));

          await setDoc(userDoc(user.uid), _user);

          await updateProfile(auth.currentUser, {
            photoURL: defaultDpUrl,
          });

          setCurrentUserAtom(_user);
        }
      }

      setSplash(false);

      return unsubscribe;
    });
  }, []);

  return (
    <>
      {splash ? (
        <Splash />
      ) : (
        <>
          {children}
          <Modal />
        </>
      )}
    </>
  );
};

export default Auth;
