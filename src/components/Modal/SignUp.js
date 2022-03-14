import { useRef, useState } from 'react';
import Image from 'next/image';
import { auth } from 'firebase.js';
import { useSetRecoilState } from 'recoil';
import { modalState } from 'recoil/atoms';
import Button from 'components/Button';
import InputText from 'components/InputText';
import { MODAL } from 'components/Modal';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';

// https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript

const isValidEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const isValidUsername = (username) => /^[a-zA-Z0-9\_\.]+$/.test(username);

const SignUp = () => {
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signUpDisabled, setSignUpDisabled] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);
  const setModal = useSetRecoilState(modalState);

  const signUp = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

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

    if (password.length < 6) {
      setError('Password must be 6 or more in length.');
      return;
    }

    try {
      setLoading(true);
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL:
          'https://firebasestorage.googleapis.com/v0/b/picpic-59a20.appspot.com/o/stock-imgs%2Fdp.png?alt=media&token=64fa4f1b-189c-4c48-a881-a7a65981d0fb',
      });

      await sendEmailVerification(userCred.user);

      setVerificationSent(true);
    } catch (e) {
      if (e.message === 'Firebase: Error (auth/email-already-in-use).') {
        setError('Email already in use.');
      }
    }
    setLoading(false);
  };

  const inputOnChange = () => {
    if (
      emailRef.current.value.length === 0 ||
      usernameRef.current.value.length === 0 ||
      passwordRef.current.value.length === 0
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
            <h2 className="font-bold text-xl text-left mb-4">
              Hello {auth.currentUser.displayName},
            </h2>
            <p className="mb-8 text-center">
              Thanks for signing up with Picpic! We just need to verify if it's
              really yours. We've sent an email to{' '}
              <span className="font-bold">{auth.currentUser.email}</span>.
            </p>
            <Button
              className="block mx-auto"
              loading={loading}
              label="Resend email"
              onClick={async () => {
                setLoading(true);

                try {
                  await sendEmailVerification(auth.currentUser);
                } catch (e) {}

                setLoading(false);
              }}
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
                  onClick={() => setModal(MODAL.LOGIN)}
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

export default SignUp;
