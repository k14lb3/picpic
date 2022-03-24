import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getDocs } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import { auth } from '@firebase/config';
import { usersCol, usersUnverifiedCol } from '@firebase/refs';
import { modalState } from '@recoil/atoms';
import Button from '@components/Button';
import InputText from '@components/InputText';
import { MODAL } from '@components/Modal';
import { isValidEmail } from 'helpers';

const LogIn = () => {
  const router = useRouter();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const emailResetRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logInDisabled, setLogInDisabled] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [sendPasswordResetDisabled, setSendPasswordResetDisabled] =
    useState(true);
  const setModal = useSetRecoilState(modalState);

  const getEmailFromUsername = async (username) => {
    const usersDocs = (await getDocs(usersCol)).docs;
    const users = usersDocs.map((doc) => doc.data());
    const email = users.filter((data) => data.username === username)[0]?.email;

    if (email === undefined) {
      const usersUnverifiedDocs = (await getDocs(usersUnverifiedCol)).docs;
      const _users = usersUnverifiedDocs.map((doc) => doc.data());
      const _email = _users.filter((data) => data.username === username)[0]
        ?.email;

      if (_email) return _email;

      throw new Error('Firebase: Error (auth/user-not-found).');
    }

    return email;
  };

  const logIn = async (e) => {
    e.preventDefault();

    if (logInDisabled) {
      return;
    }

    const username = emailRef.current.value;
    const password = passwordRef.current.value;

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
      switch (e.message) {
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

  const sendPasswordReset = async (e) => {
    e.preventDefault();

    if (sendPasswordResetDisabled) {
      return;
    }

    const email = emailResetRef.current.value;

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
      switch (e.message) {
        case 'Firebase: Error (auth/user-not-found).':
          setError('Account not found.');
          break;
      }
    }

    setLoading(false);
  };

  const inputOnChange = () => {
    if (
      emailRef.current.value.length === 0 ||
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
                  if (emailResetRef.current.value.length === 0) {
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
                  onClick={() => setModal(MODAL.SIGNUP)}
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

export default LogIn;
