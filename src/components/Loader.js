const SIZE = {
  SM: 'after:w-4 after:h-4 after:border-2',
  MD: 'after:w-6 after:h-6 after:border-4',
  LG: 'after:w-12 after:h-12 after:border-8',
};

const Loader = ({ size, color, bgColor, className, ...props }) => {
  return (
    <div
      className={`flex justify-center after:content-[''] ${
        size === 'sm'
          ? SIZE.SM
          : size === 'md'
          ? SIZE.MD
          : size === 'lg'
          ? SIZE.LG
          : ''
      } after:border-solid after:border-${
        bgColor ? bgColor : 'downy-100'
      } after:border-t-${
        color ? color : 'downy'
      } after:rounded-full animate-spin${className ? ` ${className}` : ''}`}
      {...props}
    ></div>
  );
};

Loader.defaultProps = {
  size: 'sm',
};

export default Loader;
