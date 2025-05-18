'use client'

import useStore, { useWebSocket } from '@/lib/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useState } from 'react';

const ConnectionStatus = () => {
    const router = useRouter();
    const { isConnected, setIsConnected } = useWebSocket();
    const { ws, setWS } = useWebSocket();

    function connectWebSocket() {
        const wsc = new WebSocket('ws://localhost:5000');
        wsc.onopen = () => {
            setWS(wsc);
        }
        wsc.onerror = (error) => {
            console.log("Websocket error: ", error);
            if (setIsConnected) setIsConnected(false);
        }

        wsc.onclose = (event) => {
            if (setIsConnected) setIsConnected(false);
            console.warn("Websocket closed: ", event);
            console.log("Trying to reconnect...");
            setTimeout(() => {
                connectWebSocket();
            }, 2000);
        }

        wsc.onmessage = (message) => {
            const msg = JSON.parse(message.data);
            if (msg.type === 'status') {
                console.log(msg);
                if (msg.connected) {
                    if (setIsConnected) setIsConnected(true);
                }
                else if (setIsConnected) setIsConnected(false);
            }
        }
    }
    
    useEffect(() => {
        connectWebSocket();
        return () => ws?.close();
    }, []);

    return (
        <nav className='border border-b-black py-2 flex justify-between'>
            <button className='border border-black rounded px-2 py-1' onClick={() => router.push('/')}>&lt;&lt; Back to Menu</button>
            <div className='flex items-center gap-2'>
                <p>{(isConnected) ? '' : 'Not '}Connected</p>
                <div className={`rounded-full w-5 h-5 ${(isConnected) ? 'bg-green-500' : 'bg-red-500'} cursor-pointer`} />
            </div>
        </nav>
    )
}

export default ConnectionStatus