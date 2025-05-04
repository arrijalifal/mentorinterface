'use client'

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react";
import useStore from "@/lib/store";

export default function Configure() {
    const { espUrl, setUrl } = useStore();
    const [espurl, setEspurl] = useState(espUrl);
    const router = useRouter();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setUrl(espurl);
        return router.push('/');
    }
    return <main className="flex justify-center items-center h-full">
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="text-center">
                <label htmlFor="url" className="text-xl">ESP URL:
                    <br />
                    <input
                        type="text"
                        id="url"
                        name="url"
                        className="mt-4 border border-gray-400 focus:outline-gray-500"
                        value={espurl}
                        onChange={(e) => setEspurl(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit" className="mt-3 text-xl border px-3 py-2 rounded-md">Save</button>
            </div>
        </form>
    </main>
}