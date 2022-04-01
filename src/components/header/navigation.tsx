import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useRecoilState, useRecoilValue } from 'recoil';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { currentUserState, navigationState } from '@/recoil/atoms';
import {
  ChevronUpIcon,
  HomeIcon,
  ChatIcon,
  BellIcon,
} from '@heroicons/react/outline';
import { ProfileMenu } from './profile-menu';

export const Navigation: FC = () => {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const currentUserAtom = useRecoilValue(currentUserState);
  const [navigationAtom, setNavigationAtom] = useRecoilState(navigationState);
  const [profileMenu, setProfileMenu] = useState<boolean>(false);

  useEffect(() => {
    if (!navigationAtom) {
      setProfileMenu(false);
    }
  }, [windowWidth, navigationAtom]);

  const nav = (
    <nav className="flex flex-col sm:flex-row">
      {windowWidth < 640 && (
        <div className="nav-btn" onClick={() => setNavigationAtom(true)}>
          <ChevronUpIcon />
        </div>
      )}
      <div
        className={`nav-btn${
          router.pathname === '/' && !profileMenu ? ' pointer-events-none' : ''
        }`}
      >
        <Link href="/">
          <a>
            <HomeIcon
              className={
                router.pathname === '/' && !profileMenu ? 'text-downy' : ''
              }
            />
          </a>
        </Link>
      </div>
      <div className="nav-btn">
        <ChatIcon />
      </div>
      <div className="nav-btn">
        <BellIcon />
      </div>
      <div className="relative flex w-11 h-11 p-2 rounded-full">
        <div
          className={`absolute w-9 h-9 top-1/2 left-1/2 opacity-0 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-solid border-2 border-downy ease-in duration-200${
            profileMenu ? ' scale-90 opacity-100' : ''
          }`}
        />
        <div
          className={`relative w-full h-full rounded-full overflow-hidden cursor-pointer ease-in duration-200${
            profileMenu ? ' scale-90' : ''
          }`}
          onClick={() => setProfileMenu(true)}
        >
          <Image
            src={currentUserAtom!.displayPicture}
            alt="Display picture"
            layout="fill"
            objectFit="contain"
          />
        </div>
        {windowWidth > 639 && profileMenu && (
          <ProfileMenu close={() => setProfileMenu(false)} />
        )}
      </div>
    </nav>
  );

  return (
    <>
      {windowWidth < 640 ? (
        <>
          {navigationAtom && (
            <div
              className="fixed top-0 left-0 w-screen h-screen"
              onClick={() => setNavigationAtom(false)}
            />
          )}
          <div className="fixed bottom-28 left-5 w-12 h-12">
            <div
              className={`flex justify-center fixed bottom-28 left-5 w-12 ${
                navigationAtom ? 'h-48 pb-11 items-center' : 'h-12 pt-0.5 '
              } bg-white rounded-full shadow-sm overflow-hidden shadow-gray-300 ease-in duration-200`}
            >
              {nav}
            </div>
            {profileMenu && <ProfileMenu close={() => setProfileMenu(false)} />}
          </div>
        </>
      ) : (
        <>{nav}</>
      )}
    </>
  );
};
