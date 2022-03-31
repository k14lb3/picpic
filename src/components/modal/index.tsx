import { FC } from 'react';
import reactDom from 'react-dom';
import { useRecoilState } from 'recoil';
import { XIcon } from '@heroicons/react/solid';
import { modal } from '@/utils/constants';
import { modalState } from '@/recoil/atoms';
import { LogIn } from './login';
import { SignUp } from './sign-up';

export const Modal: FC = () => {
  const [modalAtom, setModalAtom] = useRecoilState(modalState);

  const content = () => {
    switch (modalAtom) {
      case modal.login:
        return <LogIn />;
      case modal.signUp:
        return <SignUp />;
      default:
        <></>;
    }
  };

  return modalAtom && typeof window === 'object' ? (
    reactDom.createPortal(
      <div className="flex items-center justify-center fixed top-0 left-0 w-full h-full z-50">
        <div
          className="absolute w-full h-full bg-black bg-opacity-10"
          onClick={() => setModalAtom(null)}
        />
        <div className="relative w-full h-full p-8 bg-white shadow-sm z-10 sm:max-w-sm sm:h-auto">
          <div
            className="absolute top-2 right-2 close-btn"
            onClick={() => setModalAtom(null)}
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
