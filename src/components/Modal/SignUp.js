import { useRef, useState } from 'react';
import Image from 'next/image';
import { useSetRecoilState } from 'recoil';
import { modalState } from 'recoil/atoms';
import Button from 'components/Button';
import InputText from 'components/InputText';
import { MODAL } from 'components/Modal';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript

const isValidEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const isValidUsername = (username) => /^[a-zA-Z0-9\_\.]+$/.test(username);

const SignUp = () => {
  const [error, setError] = useState(null);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const setModal = useSetRecoilState(modalState);

  const signUp = async (e) => {
    e.preventDefault();

    setError(null);

    if (!isValidEmail(emailRef.current.value)) {
      setError('Invalid email address.');
      return;
    }

    if (!isValidUsername(usernameRef.current.value)) {
      setError(
        'Usernames can only use letters, numbers, underscores and periods.'
      );
      return;
    }

    // try {
    //   const userCred = createUserWithEmailAndPassword(email, password);
    //   await userCred.user.sendEmailVerification({
    //     url: window.location.href,
    //   });
    // } catch (e) {}
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
        <form onSubmit={signUp} noValidate>
          <InputText
            ref={emailRef}
            className="mb-4"
            type="email"
            placeholder="Email"
          />
          <InputText
            ref={usernameRef}
            className="mb-4"
            placeholder="Username"
          />
          <InputText ref={passwordRef} type="password" placeholder="Password" />
          <Button className="w-full mt-4 mb-2">Sign Up</Button>
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
      </div>
    </>
  );
};

export default SignUp;
