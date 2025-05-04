import { ReactNode } from "react";
import Link from "next/link";
import { Url } from "url";

export default function ButtonLink({ children, href}: { children: ReactNode, href: string}) {
    return <Link href={href} className={`px-2 py-1 w-full border border-black text-center`}>{children}</Link>
}