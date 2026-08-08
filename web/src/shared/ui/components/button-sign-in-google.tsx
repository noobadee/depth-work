// GoogleSignInButton.tsx
import type { ButtonHTMLAttributes } from "react";

interface GoogleSignInButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function GoogleSignInButton({
  label = "Sign in with Google",
  className = "",
  disabled,
  ...props
}: GoogleSignInButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        group relative box-border h-10 w-full max-w-[400px]
        cursor-pointer overflow-hidden rounded-[4px] border
        border-[#747775] bg-white px-3 text-center align-middle
        outline-none transition-[background-color,border-color,box-shadow] duration-[218ms]
        select-none
        disabled:cursor-default disabled:border-[#1f1f1f1f] disabled:bg-[#ffffff61]
        enabled:hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.30),0_1px_3px_1px_rgba(60,64,67,0.15)]
        ${className}
      `}
      {...props}
    >
      {/* state overlay for hover/active/focus */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[218ms]
          group-enabled:group-hover:bg-[#303030] group-enabled:group-hover:opacity-[0.08]
          group-enabled:group-active:bg-[#303030] group-enabled:group-active:opacity-[0.12]
          group-enabled:group-focus:bg-[#303030] group-enabled:group-focus:opacity-[0.12]
        "
      />

      <div className="relative flex h-full w-full flex-row flex-nowrap items-center justify-center gap-[10px]">
        <div className="h-5 w-5 min-w-[20px] group-disabled:opacity-[0.38]">
          <svg
            className="block"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
        </div>

        <span
          className="
            overflow-hidden text-ellipsis whitespace-nowrap align-top
            font-['Roboto',_arial,_sans-serif] text-sm font-medium tracking-[0.25px]
            text-[#1f1f1f]
            group-disabled:opacity-[0.38]
          "
        >
          {label}
        </span>
      </div>
    </button>
  );
}
