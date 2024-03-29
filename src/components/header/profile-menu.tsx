import { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { useRecoilValue } from 'recoil';
import { UserCircleIcon, CogIcon } from '@heroicons/react/outline';
import { auth } from '@/firebase/config';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { currentUserState } from '@/recoil/atoms';

interface Props {
  close: () => void;
}

export const ProfileMenu: FC<Props> = ({ close }) => {
  const { width: windowWidth } = useWindowDimensions();
  const router = useRouter();
  const currentUserAtom = useRecoilValue(currentUserState);

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen" onClick={close} />
      <div className="absolute top-[-157%] left-[130%] sm:top-[150%] sm:left-[-258%] w-40 bg-white rounded-sm shadow-sm shadow-gray-300">
        <Link href={`/${currentUserAtom!.username}`}>
          <a className="group relative profile-menu-btn rounded-t-sm">
            <UserCircleIcon />
            <span>Profile</span>
            {windowWidth > 639 && (
              <div className="absolute -top-1 left-[82%] w-2 h-2 rotate-45 bg-white ease-in duration-200 group-hover:bg-downy-50" />
            )}
          </a>
        </Link>
        <Link href="/settings/profile">
          <a className="profile-menu-btn">
            <CogIcon />
            <span>Settings</span>
          </a>
        </Link>
        <div
          className="group relative profile-menu-btn rounded-b-sm border-solid border-t border-downy-100"
          onClick={async () => {
            await signOut(auth);
            if (router.asPath !== '/') {
              await router.push('/');
            }
            router.reload();
          }}
        >
          <span>Log Out</span>
          {windowWidth < 640 && (
            <div className="group-hover:bg-downy-50 absolute top-1/2 -left-1 w-2 h-2 transform -translate-y-1/2 rotate-45 bg-white ease-in duration-200" />
          )}
        </div>
      </div>
    </>
  );
};
