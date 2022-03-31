import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '@/recoil/atoms';
import NotFound from '@/pages/404';

const Authenticated: FC = ({ children }) => {
  const currentUserAtom = useRecoilValue(currentUserState);

  return <>{currentUserAtom ? <>{children}</> : <NotFound />}</>;
};

export default Authenticated;
