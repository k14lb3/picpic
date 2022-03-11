const VARIANT = {
  DEFAULT:
    'bg-downy border-downy text-white hover:bg-downy-600 hover:border-downy-600',
  OUTLINED: 'border-downy text-downy hover:bg-downy-50',
};

const Button = ({ outlined, className, children, ...props }) => {
  return (
    <button
      className={`px-3 py-1.5 border-solid border rounded-sm text-sm font-medium tracking-wide ease-in duration-200 ${
        outlined ? VARIANT.OUTLINED : VARIANT.DEFAULT
      }${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
