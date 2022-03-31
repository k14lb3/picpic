import { FC, FormEvent, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useSetRecoilState } from 'recoil';
import { modal } from '@/utils/constants';
import { isValidEmail, getEmailFromUsername } from '@/utils/helpers';
import { auth } from '@/firebase/config';
import { modalState } from '@/recoil/atoms';
import { Button, InputText } from '@/components/ui';

export const LogIn : FC = () => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailResetRef = useRef<HTMLInputElement>(null);
  const setModalAtom = useSetRecoilState(modalState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [logInDisabled, setLogInDisabled] = useState<boolean>(true);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [sendPasswordResetDisabled, setSendPasswordResetDisabled] =
    useState<boolean>(true);

  const logIn = async (e: FormEvent) => {
    e.preventDefault();

    if (logInDisabled) {
      return;
    }

    const username = emailRef.current!.value;
    const password = passwordRef.current!.value;

    setError(null);

    setLoading(true);

    try {
      if (isValidEmail(username)) {
        await signInWithEmailAndPassword(auth, username, password);
      } else {
        const email = await getEmailFromUsername(username);
        await signInWithEmailAndPassword(auth, email, password);
      }

      router.reload();
    } catch (e) {
      switch ((e as Error).message) {
        case 'Firebase: Error (auth/user-not-found).':
          setError(
            "The username you entered doesn't belong to an account. Please check your username and try again."
          );
          break;
        case 'Firebase: Error (auth/wrong-password).':
          setError(
            'Sorry, your password was incorrect. Please double-check your password.'
          );
      }

      setLoading(false);
    }
  };

  const sendPasswordReset = async (e: FormEvent) => {
    e.preventDefault();

    if (sendPasswordResetDisabled) {
      return;
    }

    const email = emailResetRef.current!.value;

    setError(null);

    setLoading(true);

    try {
      if (isValidEmail(email)) {
        await sendPasswordResetEmail(auth, email);
      } else {
        const emailFromUsername = await getEmailFromUsername(email);
        await sendPasswordResetEmail(auth, emailFromUsername);
      }

      setSendPasswordResetDisabled(true);

      setTimeout(() => setSendPasswordResetDisabled(false), 60000);
    } catch (e) {
      switch ((e as Error).message) {
        case 'Firebase: Error (auth/user-not-found).':
          setError('Account not found.');
          break;
      }
    }

    setLoading(false);
  };

  const inputOnChange = () => {
    if (
      emailRef.current!.value.length === 0 ||
      passwordRef.current!.value.length === 0
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
        {forgotPassword ? (
          <>
            <h2 className="text-center text-lg font-bold mb-2">
              Trouble Logging In?
            </h2>
            <p className="text-center mb-2">
              Enter your email or username and we&apos;ll send you a link to
              reset your password
            </p>
            <form onSubmit={sendPasswordReset}>
              <InputText
                ref={emailResetRef}
                className="mb-4"
                placeholder="Username or email"
                onChange={() => {
                  if (emailResetRef.current!.value.length === 0) {
                    return setSendPasswordResetDisabled(true);
                  }
                  setSendPasswordResetDisabled(false);
                }}
              />
              <Button
                className="w-full mb-4"
                disabled={sendPasswordResetDisabled}
                loading={loading}
                label="Send Password Reset"
              />
            </form>
            <p
              className="font-bold cursor-pointer hover:underline"
              onClick={() => setForgotPassword(false)}
            >
              Back to Log In
            </p>
          </>
        ) : (
          <>
            <form onSubmit={logIn} noValidate>
              <InputText
                ref={emailRef}
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
              <p
                className="inline text-sm text-downy outline-none hover:underline cursor-pointer"
                onClick={() => setForgotPassword(true)}
              >
                Forgot your password?
              </p>
              <Button
                className="w-full mt-4 mb-2"
                disabled={logInDisabled}
                loading={loading}
                label="Log In"
              />
            </form>
            <div className="flex">
              <p>
                Dont have an account?
                <span
                  className="text-downy ml-1 cursor-pointer hover:underline"
                  onClick={() => setModalAtom(modal.signUp)}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </>
        )}
        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>
    </>
  );
};
