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

    const email = emailRef.current.value;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    setError(null);

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
            className="mb-2"
            type="email"
            placeholder="Email"
          />
          <InputText
            ref={usernameRef}
            className="mb-2"
            placeholder="Username"
          />
          <InputText
            ref={passwordRef}
            type="password"
            placeholder="Password"
            hasShowPassword
          />
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
