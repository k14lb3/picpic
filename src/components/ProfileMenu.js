import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { UserCircleIcon, CogIcon } from '@heroicons/react/outline';
import { useRecoilValue } from 'recoil';
import { auth } from '@firebase/config';
import { currentUserState } from '@recoil/atoms';

const ProfileMenu = ({ close }) => {
  const router = useRouter();
  const currentUserAtom = useRecoilValue(currentUserState);

  return (
    <>
      <div className="absolute top-[120%] left-[-250%] w-40 bg-white rounded-sm shadow-sm  z-20">
        <Link href={`/${currentUserAtom.username}`}>
          <a className="profile-menu-btn">
            <UserCircleIcon />
            <span>Profile</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className="profile-menu-btn">
            <CogIcon />
            <span>Settings</span>
          </a>
        </Link>
        <div className="w-full h-[1px] bg-downy-100" />
        <div
          className="profile-menu-btn"
          onClick={async () => {
            await signOut(auth);
            if (router.asPath !== '/') {
              await router.push('/');
            }
            router.reload();
          }}
        >
          <span>Log Out</span>
        </div>
      </div>
      <div
        className="fixed top-0 left-0 w-screen h-screen z-10"
        onClick={close}
      />
    </>
  );
};

export default ProfileMenu;
