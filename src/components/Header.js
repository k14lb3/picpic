import Link from 'next/link';
import Image from 'next/image';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentUserState, modalState } from '@recoil/atoms';
import SearchBar from '@components/SearchBar';
import Button from '@components/Button';
import Navigation from '@components/Navigation';
import { MODAL } from '@components/Modal';

const Header = () => {
  const currentUserAtom = useRecoilValue(currentUserState);
  const setModal = useSetRecoilState(modalState);

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
