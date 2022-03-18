import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '@recoil/atoms';
import { HomeIcon, ChatIcon, BellIcon } from '@heroicons/react/outline';
import ProfileMenu from './ProfileMenu';

const Navigation = () => {
  const currentUserAtom = useRecoilValue(currentUserState);
  const [profileMenu, setProfileMenu] = useState(false);
  const router = useRouter();

  return (
    <nav className="flex items-center">
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
        <button>
          <ChatIcon />
        </button>
      </div>
      <div className="nav-btn">
        <button>
          <BellIcon />
        </button>
      </div>
      <div className={`relative flex w-11 h-11 p-2 rounded-full`}>
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
            src={currentUserAtom.displayPicture}
            alt="Display picture"
            layout="fill"
            objectFit="contain"
          />
        </div>
        {profileMenu && (
          <>
            <ProfileMenu close={() => setProfileMenu(false)} />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
