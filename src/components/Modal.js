import React from 'react';
import reactDom from 'react-dom';
import { useRecoilState } from 'recoil';
import { modalState } from 'recoil/atoms';
import Image from 'next/image';
import Link from 'next/link';
import Button from 'components/Button';
import InputText from 'components/InputText';
import { XIcon } from '@heroicons/react/solid';

export const MODAL = { LOGIN: 'login', SIGNUP: 'signup' };

const Modal = ({ className }) => {
  const [modal, setModal] = useRecoilState(modalState);

  const LOGIN = (
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
        <InputText className="mb-4" placeholder="Username or email" />
        <InputText placeholder="Password" />
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

  const SIGNUP = (
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
        <InputText className="mb-4" placeholder="Email" />
        <InputText className="mb-4" placeholder="Username" />
        <InputText placeholder="Password" />
        <Button className="w-full mt-4 mb-2">Sign Up</Button>
        <div className="flex">
          <p>
            Already have an account?
            <span
              className="text-downy ml-1 cursor-pointer hover:underline"
              onClick={() => setModal(MODAL.LOGIN)}
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </>
  );

  const content = () => {
    switch (modal) {
      case MODAL.LOGIN:
        return LOGIN;
      case MODAL.SIGNUP:
        return SIGNUP;
      default:
        <></>;
    }
  };

  return modal && typeof window === 'object' ? (
    reactDom.createPortal(
      <div className="flex items-center justify-center fixed top-0 left-0 w-full h-full">
        <div
          className="absolute w-full h-full bg-black bg-opacity-20"
          onClick={() => setModal(null)}
        />
        <div
          className={`relative w-full h-full p-8 bg-white shadow-sm z-10 sm:max-w-sm sm:h-auto${
            className ? ` ${className}` : ''
          }`}
        >
          <div
            className="absolute top-2 right-2 close-btn"
            onClick={() => setModal(null)}
          >
            <XIcon />
          </div>
          {content()}
        </div>
      </div>,
      document.body
    )
  ) : (
    <></>
  );
};

export default Modal;
