import Image from 'next/image';

const Splash = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-downy-100 z-50">
      <div className="relative w-20 h-20">
        <Image
          priority
          src="/logo-word.png"
          alt="logo"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </div>
  );
};

export default Splash;
