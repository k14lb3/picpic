const InputText = ({ className, ...props }) => {
  return (
    <input
      className={`w-full px-2 py-1 bg-downy-100 border-solid border border-downy rounded-sm outline-none${
        className ? ` ${className}` : ''
      }`}
      type="text"
      {...props}
    />
  );
};

export default InputText;
