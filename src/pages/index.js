import { useState, useEffect } from 'react';
import {
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { signInWithEmailAndPassword, deleteUser, signOut } from 'firebase/auth';
import { useRecoilValue } from 'recoil';
import { auth } from '@firebase/config';
import {
  serverTimestampDoc,
  usersUnverifiedCol,
  userUnverifiedDoc,
} from '@firebase/refs';
import { currentUserState } from '@recoil/atoms';
import Splash from '@components/Splash';
import Header from '@components/Header';

const Home = () => {
  const currentUserAtom = useRecoilValue(currentUserState);
  const [splash, setSplash] = useState(false);

  useEffect(() => {
    const checkUnverifiedUsers = async () => {
      const usersUnverifiedDocs = (await getDocs(usersUnverifiedCol)).docs;
      const usersUnverified = usersUnverifiedDocs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      await setDoc(serverTimestampDoc, {
        timestamp: serverTimestamp(),
      });

      const { timestamp: currentTimestamp } = (
        await getDoc(serverTimestampDoc)
      ).data();

      usersUnverified.forEach(async (user) => {
        const { uid, email, password, timestamp: userTimestamp } = user;
        const duration = (currentTimestamp - userTimestamp) / 60 / 60;

        if (duration > 1) {
          if (currentUserAtom) {
            await signOut(auth);
          }
          await signInWithEmailAndPassword(auth, email, password);
          await deleteUser(auth.currentUser);
          await deleteDoc(userUnverifiedDoc(uid));
        }
      });
    };

    if (!currentUserAtom) {
      setSplash(true);

      checkUnverifiedUsers();

      setSplash(false);
    }
  }, []);

  return (
    <>
      {splash ? (
        <Splash />
      ) : (
        <>
          <Header />
        </>
      )}
    </>
  );
};

export default Home;
