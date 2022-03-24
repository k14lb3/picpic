import reactDom from 'react-dom';
import { useRecoilState } from 'recoil';
import { XIcon } from '@heroicons/react/solid';
import { modalState } from '@recoil/atoms';
import LogIn from '@components/Modal/LogIn';
import SignUp from '@components/Modal/SignUp';

export const MODAL = { LOGIN: 'login', SIGNUP: 'signup' };

const Modal = () => {
  const [modalAtom, setModalAtom] = useRecoilState(modalState);

  const content = () => {
    switch (modalAtom) {
      case MODAL.LOGIN:
        return <LogIn />;
      case MODAL.SIGNUP:
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

export default Modal;
