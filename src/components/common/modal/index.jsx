import React from "react";

const Modal = ({
  isModalOpen,
  label,
  title,
  onClick,
  closeModal,
  className,
  firstBtnTitle,
  secondBtnTitle,
}) => {
  const buttonClass = "flex justify-center";
  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#333333] p-6 rounded-lg shadow-lg max-w-sm w-full mx-5 text-white">
            <h2 className="text-2xl font-semibold text-center">
              {label || null}
            </h2>
            <p className="text-lg font-medium text-[#D8D8D8] font-semibold text-center mt-2 mb-4">
              {title || null}
            </p>
            <div className={`${buttonClass} ${className}`}>
              <button
                onClick={onClick}
                className="py-2 w-full bg-secondary text-white text-lg font-semibold rounded-md hover:bg-opacity-90"
              >
                {firstBtnTitle ? firstBtnTitle : "Yes"}
              </button>
              <button
                onClick={closeModal}
                className="py-2 w-full px-6 bg-transparent border border-borderColor  font-semibold text-lg text-white font-semibold rounded-md hover:bg-gray-800"
              >
                {secondBtnTitle ? secondBtnTitle : "No"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
