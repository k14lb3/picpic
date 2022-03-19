import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getDoc, setDoc } from 'firebase/firestore';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { auth } from '@firebase/config';
import { userDoc } from '@firebase/refs';
import { currentUserState, modalState } from '@recoil/atoms';
import SearchBar from '@components/SearchBar';
import Button from '@components/Button';
import Navigation from '@components/Navigation';
import { MODAL } from '@components/Modal';

const Header = () => {
  const [currentUserAtom, setCurrentUserAtom] = useRecoilState(currentUserState);
  const setModal = useSetRecoilState(modalState);

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

            setCurrentUserAtom(userData);
          } else {
            const userData = (await getDoc(userDoc(user.uid))).data();

            setCurrentUserAtom(userData);
          }
        }
      }),
    []
  );

  return (
    <header className="sticky w-full h-16 bg-white shadow-sm x-50">
      <div className="flex justify-between items-center max-w-4xl h-full m-auto px-5">
        <Link href="/">
          <a className="hidden relative w-full max-w-[57px] h-full max-h-[30px] md:block">
            <Image
              priority
              src="/logo-word.png"
              alt="logo"
              layout="fill"
              objectFit="contain"
            />
          </a>
        </Link>
        <Link href="/">
          <a className="flex-shrink-0 relative w-8 h-8 md:hidden">
            <Image
              src="/logo.png"
              alt="logo"
              layout="fill"
              objectFit="contain"
            />
          </a>
        </Link>
        <SearchBar />
        {currentUserAtom ? (
          <Navigation />
        ) : (
          <div>
            <Button
              className="mr-3"
              label="Log In"
              onClick={() => setModal(MODAL.LOGIN)}
            />
            <Button
              outlined
              label="Sign Up"
              onClick={() => setModal(MODAL.SIGNUP)}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
