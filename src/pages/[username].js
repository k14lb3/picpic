import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getDocs, updateDoc } from 'firebase/firestore';
import {
  ref,
  getDownloadURL,
  uploadString,
  deleteObject,
} from 'firebase/storage';
import { useRecoilState } from 'recoil';
import { resizeImage } from 'helpers';
import { currentUserState } from '@recoil/atoms';
import { auth } from '@firebase/config';
import {
  userDoc,
  usersCol,
  userFollowersCol,
  userFollowingCol,
  userRef,
  stockRef,
} from '@firebase/refs';
import Button from '@components/Button';
import Splash from '@components/Splash';
import Header from '@components/Header';
import Footer from '@components/Footer';
import ChangeDisplayPicture from '@components/ChangeDisplayPicture';
import Loader from '@components/Loader';

const Profile = () => {
  const inputFileRef = useRef(null);
  const router = useRouter();
  const [currentUserAtom, setCurrentUserAtom] =
    useRecoilState(currentUserState);
  const [user, setUser] = useState(null);
  const [changeDisplayPicture, setChangeDisplayPicture] = useState(false);
  const [displayPictureLoading, setDisplayPictureLoading] = useState(false);
  const [splash, setSplash] = useState(true);

  const uploadImage = async (e) => {
    setDisplayPictureLoading(true);

    setChangeDisplayPicture(false);

    const imgUrl = await resizeImage(e.target.files[0]);

    const uid = auth.currentUser.uid;

    const userDpRef = ref(userRef(uid), '/dp');

    await uploadString(userDpRef, imgUrl, 'data_url');

    const dpUrl = await getDownloadURL(userDpRef);

    await updateDoc(userDoc(uid), { displayPicture: dpUrl });

    setCurrentUserAtom((prevCurrentUserAtom) => ({
      ...prevCurrentUserAtom,
      displayPicture: dpUrl,
    }));

    e.target.value = null;

    setChangeDisplayPicture(false);

    setDisplayPictureLoading(false);
  };

  const removeImage = async () => {
    setDisplayPictureLoading(true);

    setChangeDisplayPicture(false);

    const defaultDpUrl = await getDownloadURL(ref(stockRef, '/dp'));

    const uid = auth.currentUser.uid;

    await updateDoc(userDoc(uid), { displayPicture: defaultDpUrl });

    const userDpRef = ref(userRef(uid), '/dp');

    setCurrentUserAtom((prevCurrentUserAtom) => ({
      ...prevCurrentUserAtom,
      displayPicture: defaultDpUrl,
    }));

    await deleteObject(userDpRef);

    setDisplayPictureLoading(false);
  };

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
        } else {
          setUser(null);
        }
      }

      setSplash(false);
    };

    if (router.isReady) {
      getUser();
    }
  }, [router]);

  useEffect(() => {
    const username = router.query.username;

    if (currentUserAtom?.username === username) {
      setUser(currentUserAtom);
    }
  }, [currentUserAtom]);

  return (
    <>
      {splash ? (
        <Splash />
      ) : (
        <>
          <Header />
          <main className="w-full pt-[5.25rem] px-5">
            {user ? (
              <>
                <Head>
                  <title>{user.username || 'Page Not Found'}</title>
                </Head>
                <div className="flex flex-col items-center w-fit max-w-md mx-auto mb-8">
                  <input
                    ref={inputFileRef}
                    onChange={uploadImage}
                    type="file"
                    accept="image/jpeg, image/png"
                    hidden
                  />
                  <div
                    className="relative h-full w-full max-h-36 max-w-[8rem] mx-auto mb-2 rounded-full overflow-hidden cursor-pointer"
                    onClick={() => {
                      if (displayPictureLoading) return;

                      if (
                        currentUserAtom.displayPicture ===
                        'https://firebasestorage.googleapis.com/v0/b/picpic-59a20.appspot.com/o/stock%2Fdp?alt=media&token=d441df5e-5010-4388-b840-4f1fcad1b4fe'
                      )
                        return inputFileRef.current.click();

                      return setChangeDisplayPicture(true);
                    }}
                  >
                    <Image
                      className={displayPictureLoading ? 'opacity-60' : ''}
                      src={user.displayPicture}
                      width="100%"
                      height="100%"
                      alt="Display picture"
                      layout="responsive"
                      objectFit="contain"
                      quality="100"
                    />
                    {displayPictureLoading && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <Loader size="md" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-center text-xl mb-2">{user.username}</h2>
                  <div className="flex mx-auto mb-4">
                    <p className="mr-4">
                      <span className="font-bold">
                        {user?.followers ? user.followers.length : '0'}{' '}
                      </span>
                      follower
                      {user?.followers
                        ? user.followers.length === 1
                          ? ''
                          : 's'
                        : ''}
                    </p>
                    <p>
                      <span className="font-bold">
                        {user?.following ? user.following.length : '0'}{' '}
                      </span>
                      following
                    </p>
                  </div>
                  <p className="text-center">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Tempora, doloremque.
                  </p>
                  {currentUserAtom?.username === user.username ? (
                    <Button className="mt-4" label="Edit profile" />
                  ) : (
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
          <Footer />
          {changeDisplayPicture && (
            <ChangeDisplayPicture
              close={() => setChangeDisplayPicture(false)}
              addImage={() => inputFileRef.current.click()}
              removeImage={removeImage}
            />
          )}
        </>
      )}
    </>
  );
};

export default Profile;
