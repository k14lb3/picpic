import Loader from '@components/Loader';

const VARIANT = {
  DEFAULT:
    'bg-downy-600 border-downy-600 text-white hover:bg-downy-650 hover:border-downy-550 disabled:bg-downy-400 disabled:border-downy-400 ',
  OUTLINED: 'border-downy text-downy',
};

const Button = ({
  label,
  outlined,
  loading,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`relative px-3 py-1 border-solid border rounded-sm font-medium tracking-wide ease-in duration-200 outline-none select-none ${
        outlined ? VARIANT.OUTLINED : VARIANT.DEFAULT
      }${className ? ` ${className}` : ''}`}
      {...props}
    >
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <Loader />
        </div>
      )}
      <span className={`whitespace-nowrap${loading ? ' invisible' : ''}`}>{label}</span>
    </button>
  );
};

Button.defaultProps = {
  label: 'Button',
};

export default Button;
