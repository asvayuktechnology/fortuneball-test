import SpinnerLoader from "../Spinner";
type Props = {
  disableStyle?: boolean;
  text: string;
  type?: "button" | "reset" | "submit";
  outline?: boolean;
  className?: string;
  children?: React.ReactNode;
  wide?: boolean;
  disabled?: boolean;
  btnStyle?:
  | "btn-info"
  | "btn-success"
  | "btn-warning"
  | "btn-error"
  | "btn-normal";
  onClick?: React.MouseEventHandler | undefined;
  isLoading?: boolean
  active?: boolean
};
const Button = (props: Props) => {
  const {
    text,
    type = "button",
    className,
    children,
    outline,
    btnStyle,
    disabled,
    onClick,
    isLoading,
    active, disableStyle
  } = props;
  
  const defaultBg = "linear-gradient(180deg,#FEDB1E 0%,#E48A06 100%)";
  const bgColr = active ? defaultBg : active !== undefined ? "#fff " : defaultBg;
  const textColor = '#fff';
  const customStyle = disableStyle
    ? undefined
    : {
      background: bgColr,
      color: textColor,
      cursor: "pointer"
    };
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      onClick={onClick}
      disabled={isLoading ?? disabled}
      className={`cursor-pointer min-h-min rounded-full justify-center text-black font-semibold sm:px-6 px-4 sm:py-3 py-4 text-center ${className}  normal-case ${outline ? "btn-outline" : ""} ${btnStyle ? btnStyle : ""} `}
      style={customStyle} 
    >
      {children}
      {isLoading ? <SpinnerLoader /> : text}
    </button>
  );
};

export default Button;
