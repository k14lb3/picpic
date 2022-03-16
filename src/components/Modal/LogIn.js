import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDocs } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import { auth } from '@firebase/config';
import { usersCol } from '@firebase/refs';
import { modalState } from '@recoil/atoms';
import Button from '@components/Button';
import InputText from '@components/InputText';
import { MODAL } from '@components/Modal';
import { isValidEmail } from '@components/Modal/SignUp';

const LogIn = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logInDisabled, setLogInDisabled] = useState(true);
  const setModal = useSetRecoilState(modalState);

  const logIn = async (e) => {
    e.preventDefault();

    if (logInDisabled) {
      return;
    }
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    setError(null);

    setLoading(true);

    try {
      if (isValidEmail(username)) {
        await signInWithEmailAndPassword(auth, username, password);
      } else {
        const usersDocs = (await getDocs(usersCol)).docs;
        const users = usersDocs.map((doc) => doc.data());
        const email = users.filter((data) => data.username === username)[0]
          ?.email;

        if (email === undefined) {
          throw new Error('Firebase: Error (auth/user-not-found).');
        }

        await signInWithEmailAndPassword(auth, email, password);
      }

      setModal(null);
    } catch (e) {
      console.log(e.message);
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
    }

    setLoading(false);
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
