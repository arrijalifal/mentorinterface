'use client'

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react";
import useStore from "@/lib/store";

export default function Configure() {
    const { websocketURL, setWebsocketURL } = useStore();
    const [wsURL, setWsURL] = useState(websocketURL);
    const router = useRouter();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setWebsocketURL(wsURL);
        alert(`websocket berubah menjadi ${wsURL}`)
        setTimeout(() => router.push('/'), 100) ;
    }
    return <main className="flex justify-center items-center h-full">
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="text-center">
                <label htmlFor="url" className="text-xl">WEBSOCKET URL:
                    <br />
                    <input
                        type="text"
                        id="url"
                        name="url"
                        className="mt-4 border border-gray-400 focus:outline-gray-500"
                        value={wsURL}
                        onChange={(e) => setWsURL(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit" className="mt-3 text-xl border px-3 py-2 rounded-md">Save</button>
            </div>
        </form>
    </main>
}