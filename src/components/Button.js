const VARIANT = {
  DEFAULT:
    'bg-downy border-downy text-white hover:bg-downy-600 hover:border-downy-600 disabled:bg-downy-400 disabled:border-downy-400',
  OUTLINED: 'border-downy text-downy hover:bg-downy-50',
};

const Button = ({ outlined, className, children, ...props }) => {
  return (
    <button
      className={`px-3 py-1 border-solid border rounded-sm font-medium tracking-wide ease-in duration-200 outline-none select-none ${
        outlined ? VARIANT.OUTLINED : VARIANT.DEFAULT
      }${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
