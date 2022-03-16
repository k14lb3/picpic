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
  updateProfile,
} from 'firebase/auth';
import { useRecoilState } from 'recoil';
import _ from 'lodash';
import { auth } from '@firebase/config';
import {
  serverTimestampDoc,
  userDoc,
  usersUnverifiedCol,
  userUnverifiedDoc,
} from '@firebase/refs';
import { currentUserState } from '@recoil/atoms';
import Splash from '@components/Splash';
import Header from '@components/Header';
import Modal from '@components/Modal';

const Home = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (user?.emailVerified) {
          if (!user.photoURL) {
            const displayPicture =
              'https://firebasestorage.googleapis.com/v0/b/picpic-59a20.appspot.com/o/stock-imgs%2Fdp.png?alt=media&token=64fa4f1b-189c-4c48-a881-a7a65981d0fb';

            const userData = {
              email: user.email,
              username: user.displayName,
              displayPicture: displayPicture,
            };

            await deleteDoc(userUnverifiedDoc(user.uid));

            await setDoc(userDoc(user.uid), userData);

            await updateProfile(auth.currentUser, {
              photoURL: displayPicture,
            });

            setCurrentUser(userData);
          } else {
            const userData = (await getDoc(userDoc(user.uid))).data();

            setCurrentUser(userData);
          }
        }
      }),
    []
  );

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
          if (currentUser) {
            await signOut(auth);
          }
          await signInWithEmailAndPassword(auth, email, password);
          await deleteUser(auth.currentUser);
          await deleteDoc(userUnverifiedDoc(uid));
        }
      });
    };

    if (!currentUser) {
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
        <div className="bg-downy-100 h-screen">
          <Header />
          <Modal />
        </div>
      )}
    </>
  );
};

export default Home;
