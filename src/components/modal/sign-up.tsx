import { FormEvent, useState, useRef } from 'react';
import Image from 'next/image';
import {
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { setDoc, serverTimestamp } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import { modal } from '@/utils/constants';
import { isValidEmail, isValidUsername } from '@/utils/helpers';
import { auth } from '@/firebase/config';
import { userUnverifiedDoc } from '@/firebase/refs';
import { modalState } from '@/recoil/atoms';
import { Button, InputText } from '@/components/ui';

export const SignUp = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const setModalAtom = useSetRecoilState(modalState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [signUpDisabled, setSignUpDisabled] = useState<boolean>(true);
  const [resendEmailDisabled, setResendEmailDisabled] = useState<boolean>(true);
  const [verificationSent, setVerificationSent] = useState<boolean>(false);

  const signUp = async (e: FormEvent) => {
    e.preventDefault();

    const email = emailRef.current!.value;
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;

    setError(null);

    if (signUpDisabled) {
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email address.');
      return;
    }

    if (!isValidUsername(username)) {
      setError(
        'Usernames can only use letters, numbers, underscores and periods.'
      );
      return;
    }

    if (username.length < 6) {
      setError('Username must be 6 or more in length.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be 8 or more in length.');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      const currentUser = auth.currentUser as User;

      await updateProfile(currentUser, {
        displayName: username,
      });

      await setDoc(userUnverifiedDoc(currentUser.uid), {
        email: email,
        username: username,
        password: password,
        timestamp: serverTimestamp(),
      });

      await sendEmailVerification(currentUser);

      setVerificationSent(true);
    } catch (e) {
      switch ((e as Error).message) {
        case 'Firebase: Error (auth/email-already-in-use).':
          setError('Email is already in use.');
          break;
      }
    }

    setLoading(false);

    setTimeout(() => setResendEmailDisabled(false), 60000);
  };

  const resendEmail = async () => {
    if (resendEmailDisabled) {
      return;
    }

    setLoading(true);

    const currentUser = auth.currentUser as User;

    try {
      await sendEmailVerification(currentUser);
    } catch (e) {}

    setLoading(false);

    setTimeout(() => setResendEmailDisabled(false), 60000);
  };

  const inputOnChange = () => {
    if (
      emailRef.current!.value.length === 0 ||
      usernameRef.current!.value.length === 0 ||
      passwordRef.current!.value.length === 0
    ) {
      return setSignUpDisabled(true);
    }
    setSignUpDisabled(false);
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
        {verificationSent ? (
          <>
            <h2 className="text-center text-lg font-bold mb-2">
              Hello {auth.currentUser!.displayName},
            </h2>
            <p className="mb-8 text-center">
              Thanks for signing up with Picpic! Before you get started we need
              to verify your email address. We&apos;ve sent an email to&nbsp;
              <span className="font-bold">{auth.currentUser!.email}</span>.
            </p>
            <Button
              className="block mx-auto"
              disabled={resendEmailDisabled}
              loading={loading}
              label="Resend email"
              onClick={resendEmail}
            />
          </>
        ) : (
          <>
            <form onSubmit={signUp} noValidate>
              <InputText
                ref={emailRef}
                className="mb-2"
                type="email"
                placeholder="Email"
                onChange={inputOnChange}
              />
              <InputText
                ref={usernameRef}
                className="mb-2"
                placeholder="Username"
                onChange={inputOnChange}
              />
              <InputText
                ref={passwordRef}
                type="password"
                placeholder="Password"
                hasShowPassword
                onChange={inputOnChange}
              />
              <Button
                className="w-full mt-4 mb-2"
                disabled={signUpDisabled}
                loading={loading}
                label="Sign Up"
              />
            </form>
            <div className="flex">
              <p>
                Already have an account?
                <span
                  className="text-downy ml-1 cursor-pointer hover:underline"
                  onClick={() => setModalAtom(modal.login)}
                >
                  Log In
                </span>
              </p>
            </div>
            {error && (
              <div className="mt-4 text-center">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
