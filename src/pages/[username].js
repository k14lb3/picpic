import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import {
  ref,
  getDownloadURL,
  uploadString,
  deleteObject,
} from 'firebase/storage';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { resizeImage } from 'helpers';
import { currentUserState, modalState } from '@recoil/atoms';
import { auth } from '@firebase/config';
import {
  serverTimestampDoc,
  userDoc,
  usersCol,
  userRef,
  stockRef,
} from '@firebase/refs';
import Layout from '@components/Layout';
import Button from '@components/Button';
import Splash from '@components/Splash';
import ChangeDisplayPicture from '@components/ChangeDisplayPicture';
import Loader from '@components/Loader';
import NotFound from '@pages/404';
import { MODAL } from '@components/Modal';

const Profile = () => {
  const inputFileRef = useRef(null);
  const router = useRouter();
  const [currentUserAtom, setCurrentUserAtom] =
    useRecoilState(currentUserState);
  const setModalAtom = useSetRecoilState(modalState);
  const [user, setUser] = useState(null);
  const [changeDisplayPicture, setChangeDisplayPicture] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [unfollowLoading, setUnfollowLoading] = useState(false);
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

  const followUser = async () => {
    if (!currentUserAtom) setModalAtom(MODAL.LOGIN);

    if (followLoading) return;

    setFollowLoading(true);

    await setDoc(serverTimestampDoc, {
      timestamp: serverTimestamp(),
    });

    const { timestamp: currentTimestamp } = (
      await getDoc(serverTimestampDoc)
    ).data();

    const _currentUser = {
      uid: auth.currentUser.uid,
      timestamp: currentTimestamp,
    };

    const _user = {
      uid: user.uid,
      timestamp: currentTimestamp,
    };

    await updateDoc(userDoc(user.uid), {
      followers: arrayUnion(_currentUser),
    });

    await updateDoc(userDoc(auth.currentUser.uid), {
      following: arrayUnion(_user),
    });

    setUser((prevUser) => ({
      ...prevUser,
      followers: [...prevUser.followers, _currentUser],
    }));

    setCurrentUserAtom((prevCurrentUserAtom) => ({
      ...prevCurrentUserAtom,
      following: [...prevCurrentUserAtom.following, _user],
    }));

    setFollowLoading(false);
  };

  const unfollowUser = async () => {};

  const isFollowing = () =>
    currentUserAtom.following.filter(({ uid }) => uid === user.uid)[0];

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
          setUser(_user);
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
          {user ? (
            <>
              <Head>
                <title>{user.username || 'Page Not Found'}</title>
              </Head>
              <Layout>
                <div className="flex flex-col items-center w-fit max-w-md mx-auto mb-8">
                  <input
                    ref={inputFileRef}
                    onChange={uploadImage}
                    type="file"
                    accept="image/jpeg, image/png"
                    hidden
                  />
                  <div
                    className={`relative h-full w-full max-h-36 max-w-[8rem] mx-auto mb-2 rounded-full overflow-hidden${
                      currentUserAtom ? ' cursor-pointer' : ''
                    }`}
                    onClick={() => {
                      if (!currentUserAtom) return;

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
                      {user.followers.length !== 1 ? 's' : ''}
                    </p>
                    <p>
                      <span className="font-bold">
                        {user.following.length}{' '}
                      </span>
                      following
                    </p>
                  </div>
                  {user?.bio && <p className="text-center mb-4">{user.bio}</p>}
                  {currentUserAtom?.username === user.username ? (
                    <Button
                      label="Edit profile"
                      onClick={() => router.push('/settings/profile')}
                    />
                  ) : isFollowing() ? (
                    <Button
                      outlined
                      loading={unfollowLoading}
                      label="Unfollow"
                      onClick={unfollowUser}
                    />
                  ) : (
                    <Button
                      loading={followLoading}
                      label="Follow"
                      onClick={followUser}
                    />
                  )}
                </div>
                <hr className="w-full max-w-[30rem] h-[2px] mx-auto bg-downy" />
                {changeDisplayPicture && (
                  <ChangeDisplayPicture
                    close={() => setChangeDisplayPicture(false)}
                    addImage={() => inputFileRef.current.click()}
                    removeImage={removeImage}
                  />
                )}
              </Layout>
            </>
          ) : (
            <NotFound />
          )}
        </>
      )}
    </>
  );
};

export default Profile;
