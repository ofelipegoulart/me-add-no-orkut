import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

const authButtonClassName =
  "border border-[#767676] bg-[#ececec] px-1.5 py-px font-sans text-xs text-black cursor-pointer tracking-normal hover:bg-[#e5e5e5] hover:border-[#4f4f4f] active:bg-[#f5f5f5] active:border-[#8d8d8d] disabled:opacity-50 disabled:cursor-not-allowed";

type AuthButtonBaseProps = {
  className?: string;
};

type AuthSubmitButtonProps =
  | (AuthButtonBaseProps &
      ButtonHTMLAttributes<HTMLButtonElement> & {
        as?: "button";
        children: ReactNode;
      })
  | (AuthButtonBaseProps &
      InputHTMLAttributes<HTMLInputElement> & {
        as: "input";
      });

export function AuthSubmitButton(props: AuthSubmitButtonProps) {
  if (props.as === "input") {
    const { className = "", ...inputProps } = props;

    return (
      <input
        {...inputProps}
        type="submit"
        className={`${authButtonClassName} ${className}`.trim()}
      />
    );
  }

  const { className = "", children, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type="submit"
      className={`${authButtonClassName} ${className}`.trim()}
    >
      {children}
    </button>
  );
}