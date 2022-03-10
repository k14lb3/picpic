import Link from 'next/link';

const NavigationButton = ({ icon, href = undefined, ...props }) => {
  return (
    <div className="w-11 h-11 p-2 mr-2 rounded-full ease-in duration-200 cursor-pointer hover:scale-90 hover:bg-downy-100 hover:text-downy-500">
      {href ? (
        <Link href={href}>
          <a {...props}>{icon}</a>
        </Link>
      ) : (
        <button className="w-full" {...props}>
          {icon}
        </button>
      )}
    </div>
  );
};

export default NavigationButton;
