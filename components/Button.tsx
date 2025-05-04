import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    active?: boolean
}

export default function Button({ children, active, ...rest }: ButtonProps) {
    return (
        <button
            className={`px-2 py-1 w-full border border-black text-center ${(active) ? 'bg-black text-white' : 'text-black'}`}
            {...rest}
        >
            {children}
        </button>
    );
}
