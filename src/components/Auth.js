import { useState, useEffect } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getDownloadURL } from 'firebase/storage';
import { getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { auth } from '@firebase/config';
import {
  userUnverifiedDoc,
  userDoc,
  userFollowersCol,
  userFollowingCol,
  defaultDpRef,
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
          const _user = (await getDoc(userDoc(user.uid))).data();
          const userFollowersDocs = (await getDocs(userFollowersCol(user.uid)))
            .docs;
          const userFollowers = userFollowersDocs.map((doc) => doc.id);

          const userFollowingDocs = (await getDocs(userFollowingCol(user.uid)))
            .docs;
          const userfollowing = userFollowingDocs.map((doc) => doc.id);

          setCurrentUserAtom({
            ..._user,
            followers: userFollowers,
            following: userfollowing,
          });
        } else {
          const defaultDpUrl = await getDownloadURL(defaultDpRef);

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
