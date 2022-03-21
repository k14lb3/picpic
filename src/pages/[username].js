import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getDocs } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { currentUserState } from '@recoil/atoms';
import { usersCol, userFollowersCol, userFollowingCol } from '@firebase/refs';
import Button from '@components/Button';
import Splash from '@components/Splash';
import Header from '@components/Header';

const Profile = () => {
  const router = useRouter();
  const [currentUserAtom, setCurrentUserAtom] =
    useRecoilState(currentUserState);
  const [user, setUser] = useState(null);
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const username = router.query.username;
      if (currentUserAtom?.username === username) {
        setUser(currentUserAtom);
      } else {
        const usersDocs = (await getDocs(usersCol)).docs;
        const users = usersDocs.map((doc) => ({ uid: doc.id, ...doc.data() }));
        const _user = users.filter((data) => data.username === username)[0];

        if (_user) {
          const userFollowersDocs = (await getDocs(userFollowersCol(_user.uid)))
            .docs;
          const userFollowers = userFollowersDocs.map((doc) => doc.id);
          const userFollowingDocs = (await getDocs(userFollowingCol(_user.uid)))
            .docs;
          const userfollowing = userFollowingDocs.map((doc) => doc.id);

          setUser({
            ..._user,
            followers: userFollowers,
            following: userfollowing,
          });
        }
      }

      setSplash(false);
    };

    if (router.isReady) {
      getUser();
    }
  }, [router]);

  return (
    <>
      {splash ? (
        <Splash />
      ) : (
        <>
          <Header />
          <main className="flex flex-col w-full h-auto pt-5 px-5">
            {user ? (
              <>
                <Head>
                  <title>{user.username || 'Page Not Found'}</title>
                </Head>
                <div className="flex flex-col items-center w-fit max-w-md mx-auto mb-8">
                  <div className="relative h-full w-full max-h-36 max-w-[8rem] mx-auto mb-2 rounded-full overflow-hidden cursor-pointer">
                    <Image
                      src={user.displayPicture}
                      width="100%"
                      height="100%"
                      alt="Display picture"
                      layout="responsive"
                      objectFit="contain"
                      quality="100"
                    />
                  </div>
                  <h2 className="text-center text-xl mb-2">{user.username}</h2>
                  <div className="flex mx-auto mb-4">
                    <p className="mr-4">
                      <span className="font-bold">
                        {user?.followers ? user.followers.length : '0'}{' '}
                      </span>
                      follower{user?.followers.length === 1 ? '' : 's'}
                    </p>
                    <p>
                      <span className="font-bold">
                        {user?.followers ? user.following.length : '0'}{' '}
                      </span>
                      following
                    </p>
                  </div>
                  <p className="text-center">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Tempora, doloremque.
                  </p>
                  {(!currentUserAtom ||
                    (currentUserAtom.username !== user.username)) && (
                      <Button className="mt-4" label="Follow" />
                    )}
                </div>
                <hr className="w-full max-w-[30rem] h-[2px] mx-auto bg-downy" />
              </>
            ) : (
              <>
                <h2 className="mb-4 text-2xl font-bold text-center">
                  Sorry, this page isn&apos;t available
                </h2>
                <p className="text-center">
                  The link you followed may be broken, or the page may have been
                  removed.
                </p>
              </>
            )}
          </main>
        </>
      )}
    </>
  );
};

export default Profile;
