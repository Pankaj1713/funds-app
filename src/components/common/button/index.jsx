const Button = ({ title, className = "", onClick, disabled, variant }) => {
  const buttonClass =
    variant === "secondary"
      ? "w-full py-2 px-4 border border-secondary text-[#CC5600] text-lg font-semibold rounded-lg hover:bg-opacity-90 mb-2"
      : "w-full py-2 px-4 bg-secondary text-white text-lg font-semibold rounded-lg hover:bg-opacity-90";

  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${buttonClass} ${className}`}
      >
        {title}
      </button>
    </div>
  );
};

export default Button;
