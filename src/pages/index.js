import { useEffect } from 'react';
import Head from 'next/head';
import { onAuthStateChanged } from 'firebase/auth';
import { useSetRecoilState } from 'recoil';
import _ from 'lodash';
import { currentUserState } from 'recoil/atoms';
import { auth } from '../firebase/config';
import Header from 'components/Header';
import Modal from 'components/Modal';

const Home = () => {
  const setCurrentUser = useSetRecoilState(currentUserState);

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

  return (
    <div className="bg-downy-100 h-screen">
      <Head>
        <title>Picpic</title>
        <meta
          name="Picpic"
          content="Image sharing and social media platform."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Modal />
    </div>
  );
};

export default Home;
