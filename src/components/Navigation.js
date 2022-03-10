import Link from 'next/link';
import { HomeIcon, ChatIcon, BellIcon } from '@heroicons/react/outline';

const Navigation = () => {
  return (
    <nav className="flex items-center">
      <div className="nav-btn">
        <Link href="/">
          <a>
            <HomeIcon />
          </a>
        </Link>
      </div>
      <div className="nav-btn">
        <button>
          <ChatIcon />
        </button>
      </div>
      <div className="nav-btn">
        <button>
          <BellIcon />
        </button>
      </div>
      <div className="group relative flex w-11 h-11 p-2 rounded-full overflow-hidden cursor-pointer ease-in duration-200 hover:scale-90">
        <div className="absolute w-9 h-9 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-solid border-2 border-downy opacity-0 ease-in duration-200 group-hover:opacity-100" />
        <img
          className="w-7 h-7 rounded-full ease-in duration-200"
          src="/doge.jpg"
          alt=""
        />
      </div>
    </nav>
  );
};

export default Navigation;
