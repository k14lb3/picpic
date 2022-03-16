import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSetRecoilState } from 'recoil';
import { modalState } from '@recoil/atoms';
import Button from '@components/Button';
import InputText from '@components/InputText';
import { MODAL } from '@components/Modal';

const LogIn = () => {
  const setModal = useSetRecoilState(modalState);
  const [logInDisabled, setLogInDisabled] = useState(true);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const logIn = (e) => {
    e.preventDefault();
  };

  const inputOnChange = () => {
    if (
      usernameRef.current.value.length === 0 ||
      passwordRef.current.value.length === 0
    ) {
      return setLogInDisabled(true);
    }
    setLogInDisabled(false);
  };

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
        <form onSubmit={logIn} noValidate>
          <InputText
            ref={usernameRef}
            className="mb-2"
            placeholder="Username or email"
            onChange={inputOnChange}
          />
          <InputText
            ref={passwordRef}
            type="password"
            placeholder="Password"
            onChange={inputOnChange}
          />
          <Link href="/">
            <a className="text-sm text-downy outline-none hover:underline">
              Forgot your password?
            </a>
          </Link>
          <Button
            disabled={logInDisabled}
            className="w-full mt-4 mb-2"
            label="Log In"
          />
        </form>
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
