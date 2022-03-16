import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  deleteUser,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { useRecoilState } from 'recoil';
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
import Modal from '@components/Modal';

const Home = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [loading, setLoading] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user?.emailVerified) {
          const currentUser = _.cloneDeep(user);
          setCurrentUser(currentUser);
        }
      }),
    []
  );

  useEffect(() => {
    const checkUnverifiedUsers = async () => {
      setLoading(true);

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
          if (currentUser) {
            await signOut(auth);
          }
          await signInWithEmailAndPassword(auth, email, password);
          await deleteUser(auth.currentUser);
          await deleteDoc(userUnverifiedDoc(uid));
        }
      });

      setLoading(false);
    };

    if (!currentUser) {
      checkUnverifiedUsers();
    }
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
        <div className="bg-downy-100 h-screen">
          <Header />
          <Modal />
        </div>
      )}
    </>
  );
};

export default Home;
