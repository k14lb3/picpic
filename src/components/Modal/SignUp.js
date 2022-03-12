import { useSetRecoilState } from 'recoil';
import { modalState } from 'recoil/atoms';
import Image from 'next/image';
import Button from 'components/Button';
import InputText from 'components/InputText';
import { MODAL } from 'components/Modal';

const SignUp = () => {
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
};

export default SignUp;
