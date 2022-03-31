import {
  FC,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  useRef,
} from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import {
  ref,
  getDownloadURL,
  uploadString,
  deleteObject,
} from 'firebase/storage';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { modal } from '@/utils/constants';
import { getServerTimestamp, resizeImage } from '@/utils/helpers';
import { User, modalState, currentUserState } from '@/recoil/atoms';
import { auth } from '@/firebase/config';
import { userDoc, userRef, stockRef } from '@/firebase/refs';
import { ChangeDisplayPicture } from '@/components/profile';
import { Loader, Button } from '@/components/ui';

interface Props {
  userState: { user: User; setUser: Dispatch<SetStateAction<User | null>> };
}

export const ProfileHeader: FC<Props> = ({ userState: { user, setUser } }) => {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [currentUserAtom, setCurrentUserAtom] =
    useRecoilState(currentUserState);
  const setModalAtom = useSetRecoilState(modalState);
  const [changeDisplayPicture, setChangeDisplayPicture] =
    useState<boolean>(false);
  const [displayPictureLoading, setDisplayPictureLoading] =
    useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [unfollowLoading, setUnfollowLoading] = useState<boolean>(false);

  const uploadImage = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setDisplayPictureLoading(true);

    setChangeDisplayPicture(false);

    const target = e.target;

    const imgUrl = await resizeImage((target.files as FileList)[0]);

    const currentUserUid = auth.currentUser!.uid;

    const userDpRef = ref(userRef(currentUserUid), '/dp');

    await uploadString(userDpRef, imgUrl, 'data_url');

    const dpUrl = await getDownloadURL(userDpRef);

    await updateDoc(userDoc(currentUserUid), { displayPicture: dpUrl });

    setCurrentUserAtom(
      (prevCurrentUserAtom) =>
        ({
          ...prevCurrentUserAtom,
          displayPicture: dpUrl,
        } as User)
    );

    inputFileRef.current!.value = '';

    setChangeDisplayPicture(false);

    setDisplayPictureLoading(false);
  };

  const removeImage = async (): Promise<void> => {
    setDisplayPictureLoading(true);

    setChangeDisplayPicture(false);

    const defaultDpUrl = await getDownloadURL(ref(stockRef, '/dp'));

    const currentUserUid = auth.currentUser!.uid;

    await updateDoc(userDoc(currentUserUid), { displayPicture: defaultDpUrl });

    const userDpRef = ref(userRef(currentUserUid), '/dp');

    setCurrentUserAtom(
      (prevCurrentUserAtom) =>
        ({
          ...prevCurrentUserAtom,
          displayPicture: defaultDpUrl,
        } as User)
    );

    await deleteObject(userDpRef);

    setDisplayPictureLoading(false);
  };

  const followUser = async (): Promise<void> => {
    if (!currentUserAtom) setModalAtom(modal.login);

    if (followLoading) return;

    setFollowLoading(true);

    const currentTimestamp = await getServerTimestamp();

    const currentUserUid = auth.currentUser!.uid;

    const _currentUser = {
      uid: currentUserUid,
      timestamp: currentTimestamp,
    };

    const _user = {
      uid: user!.uid,
      timestamp: currentTimestamp,
    };

    await updateDoc(userDoc(user!.uid as string), {
      followers: arrayUnion(_currentUser),
    });

    await updateDoc(userDoc(currentUserUid), {
      following: arrayUnion(_user),
    });

    setUser(
      (prevUser) =>
        ({
          ...prevUser,
          followers: [...prevUser!.followers, _currentUser],
        } as User)
    );

    setCurrentUserAtom(
      (prevCurrentUserAtom) =>
        ({
          ...prevCurrentUserAtom,
          following: [...prevCurrentUserAtom!.following, _user],
        } as User)
    );

    setFollowLoading(false);
  };

  const unfollowUser = async (): Promise<void> => {
    if (unfollowLoading) return;

    setUnfollowLoading(true);

    const { timestamp: followTimestamp } = currentUserAtom!.following.filter(
      (following) => following.uid === user!.uid
    )[0];

    const currentUserUid = auth.currentUser!.uid;

    const userUid = user!.uid as string;

    await updateDoc(userDoc(userUid), {
      followers: arrayRemove({
        uid: currentUserUid,
        timestamp: followTimestamp,
      }),
    });

    await updateDoc(userDoc(currentUserUid), {
      following: arrayRemove({
        uid: userUid,
        timestamp: followTimestamp,
      }),
    });

    setUser(
      (prevUser) =>
        ({
          ...prevUser,
          followers: prevUser!.followers.filter(
            (follower) => follower.uid !== currentUserUid
          ),
        } as User)
    );

    setCurrentUserAtom(
      (prevCurrentUserAtom) =>
        ({
          ...prevCurrentUserAtom,
          following: prevCurrentUserAtom!.following.filter(
            (following) => following.uid !== userUid
          ),
        } as User)
    );

    setUnfollowLoading(false);
  };

  const isCurrentUserFollowing = () =>
    currentUserAtom!.following.filter(({ uid }) => uid === user!.uid)[0];

  return (
    <>
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
              return inputFileRef.current!.click();
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
        <div className="flex mb-4">
          <p className="mr-4">
            <span className="font-bold">
              {user?.followers ? user.followers.length : '0'}{' '}
            </span>
            follower
            {user.followers.length !== 1 ? 's' : ''}
          </p>
          <p>
            <span className="font-bold">{user.following.length} </span>
            following
          </p>
        </div>
        {user.bio && <p className="text-center mb-4">{user.bio}</p>}
        {currentUserAtom?.username === user.username ? (
          <Button
            label="Edit profile"
            onClick={() => router.push('/settings/profile')}
          />
        ) : isCurrentUserFollowing() ? (
          <Button
            outlined
            loading={unfollowLoading}
            label="Unfollow"
            onClick={unfollowUser}
          />
        ) : (
          <Button loading={followLoading} label="Follow" onClick={followUser} />
        )}
      </div>
      <hr className="w-full max-w-[30rem] h-[2px] mx-auto bg-downy" />
      {changeDisplayPicture && (
        <ChangeDisplayPicture
          close={() => setChangeDisplayPicture(false)}
          addImage={() => inputFileRef.current!.click()}
          removeImage={removeImage}
        />
      )}
    </>
  );
};
