import { useRef } from 'react';

const ChangeDisplayPicture = ({ close, addImage, removeImage }) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen" onClick={close} />
      <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-fit h-fit bg-white rounded-sm shadow-sm shadow-gray-300">
        <h2 className="text-lg font-bold py-6 px-8">Change Display Picture</h2>
        <div
          className="change-display-picture-btn text-downy-500"
          onClick={addImage}
        >
          Upload image
        </div>
        <div
          className="change-display-picture-btn text-red-500"
          onClick={removeImage}
        >
          Remove Current Image
        </div>
        <div className="change-display-picture-btn" onClick={close}>
          Cancel
        </div>
      </div>
    </>
  );
};

export default ChangeDisplayPicture;
