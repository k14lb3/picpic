import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { signInWithEmailAndPassword, deleteUser, signOut } from 'firebase/auth';
import { useRecoilValue } from 'recoil';
import _ from 'lodash';
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
  const [loading, setLoading] = useState(true);

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
      setLoading(true);

      checkUnverifiedUsers();
    }

    setLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Picpic</title>
        <meta
          name="Picpic"
          content="Image sharing and social media platform."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? (
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
