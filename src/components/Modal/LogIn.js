import { modalState } from 'recoil/atoms';
import { useSetRecoilState } from 'recoil';
import Image from 'next/image';
import Link from 'next/link';
import Button from 'components/Button';
import InputText from 'components/InputText';
import { MODAL } from 'components/Modal';

const LogIn = () => {
  const setModal = useSetRecoilState(modalState);

  return (
    <>
      <div className="relative w-auto h-20 mb-8 m-auto">
        <Image
          priority
          src="/logo-word.png"
          alt="logo"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="px-4">
        <InputText className="mb-2" placeholder="Username or email" />
        <InputText type="password" placeholder="Password" />
        <Link href="/">
          <a className="text-sm text-downy outline-none hover:underline">
            Forgot your password?
          </a>
        </Link>
        <Button className="w-full mt-4 mb-2">Log In</Button>
        <div className="flex">
          <p>
            Dont have an account?
            <span
              className="text-downy ml-1 cursor-pointer hover:underline"
              onClick={() => setModal(MODAL.SIGNUP)}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LogIn;
