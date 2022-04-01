import { useState, useLayoutEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useRecoilValue } from 'recoil';
import { getUser } from '@/utils/helpers';
import { User, currentUserState } from '@/recoil/atoms';
import NotFound from '@/pages/404';
import Layout from '@/components/layout';
import { Splash } from '@/components/ui';
import { ProfileHeader } from '@/components/profile';

const Profile: NextPage = () => {
  const router = useRouter();
  const currentUserAtom = useRecoilValue(currentUserState);
  const [splash, setSplash] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useLayoutEffect(() => {
    const fetchUser = async () => {
      const username = router.query.username as string;

      const _user =
        currentUserAtom!.username === username
          ? currentUserAtom
          : await getUser(username);

      if (_user) {
        setUser(_user);
      }

      setSplash(false);
    };

    if (router.isReady) {
      fetchUser();
    }
  }, [router, currentUserAtom]);

  return splash ? (
    <Splash />
  ) : user ? (
    <>
      <Head>
        <title>{user.username}</title>
      </Head>
      <Layout>
        <ProfileHeader userState={{ user: user, setUser: setUser }} />
      </Layout>
    </>
  ) : (
    <NotFound />
  );
};

export default Profile;
