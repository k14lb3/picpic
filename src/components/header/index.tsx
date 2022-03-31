import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { modal } from '@/utils/constants';
import { modalState, currentUserState } from '@/recoil/atoms';
import { Button } from '@/components/ui';
import { SearchBar } from './search-bar';
import { Navigation } from './navigation';

const Header: FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  const currentUserAtom = useRecoilValue(currentUserState);
  const setModalAtom = useSetRecoilState(modalState);

  return (
    <header className="fixed w-full h-16 bg-white border-solid border-b border-downy-100 z-40">
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
          <a className="flex-shrink-0 relative w-8 h-8 mr-5 sm:mr-0 md:hidden">
            <Image
              src="/logo.png"
              alt="logo"
              layout="fill"
              objectFit="contain"
            />
          </a>
        </Link>
        <SearchBar className="mx-auto sm:mx-0" />
        {currentUserAtom ? (
          <Navigation />
        ) : (
          <div
            className={
              windowWidth < 640
                ? 'flex fixed bottom-28 left-1/2 transform -translate-x-1/2 bg-white py-4 px-10 rounded-full shadow-sm shadow-gray-300'
                : ''
            }
          >
            <Button
              className="mr-3"
              label="Log In"
              onClick={() => setModalAtom(modal.login)}
            />
            <Button
              outlined
              label="Sign Up"
              onClick={() => setModalAtom(modal.signUp)}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
