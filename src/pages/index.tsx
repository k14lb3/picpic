import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '@/recoil/atoms';
import Layout from '@/components/layout';
import { Splash } from '@/components/ui';
import { deleteUnverifiedUsers } from '@/utils/helpers';

const Home: NextPage = () => {
  const currentUserAtom = useRecoilValue(currentUserState);
  const [splash, setSplash] = useState<boolean>(true);

  useEffect(() => {
    const checkUnverifiedUsers = async () => {
      if (!currentUserAtom) {
        await deleteUnverifiedUsers();
      }

      setSplash(false);

    };

    checkUnverifiedUsers();
  }, []);

  return splash ? <Splash /> : <Layout></Layout>;
};

export default Home;
