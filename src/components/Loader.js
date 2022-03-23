const SIZE = {
  SM: 'w-4 h-4 border-2',
  MD: 'w-6 h-6 border-4',
  LG: 'w-12 h-12 border-8',
};

const Loader = ({ size, color, bgColor, className, ...props }) => {
  return (
    <div
      className={`flex justify-center ${
        size === 'sm'
          ? SIZE.SM
          : size === 'md'
          ? SIZE.MD
          : size === 'lg'
          ? SIZE.LG
          : ''
      } border-solid border-${bgColor} border-t-${color} rounded-full animate-spin${
        className ? ` ${className}` : ''
      }`}
      {...props}
    />
  );
};

Loader.defaultProps = {
  size: 'sm',
  color: 'downy',
  bgColor: 'downy-100',
};

export default Loader;
