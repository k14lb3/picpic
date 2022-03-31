import { NextPage } from 'next';
import Authenticated from '@/components/authenticated';
import Header from '@/components/header';
import Footer from '@/components/footer';

const Profile: NextPage = () => {
  return (
    <Authenticated>
      <Header />
      <main className="w-full pt-[5.25rem] px-5">
        <div className="grid grid-cols-2 max-w-4xl px-5 m-auto border-solid border border-downy">
          <div className="flex flex-col">
            <li>Profile</li>
            <li>Security</li>
          </div>
          <div>nice</div>
        </div>
      </main>
      <Footer />
    </Authenticated>
  );
};

export default Profile;
