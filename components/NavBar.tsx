'use client'

import useStore, { useWebSocket } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { useState } from 'react';

function servoToAngle(index: number, val: number) {
    if (index === 0) {
        val = 4096 - val + 580;
    } else if (index === 1) {
        val = 4096 - val + 1024;
    } else if (index === 4) {
        val = 4096 - val;
    }
    return (val * 360 / 4096) - 180;
}
  

const ConnectionStatus = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { isConnected, setIsConnected } = useWebSocket();
    const { ws, setWS, setFeedbackJoint } = useWebSocket();
    const { websocketURL } = useStore();

    function connectWebSocket() {
        const wsc = new WebSocket(websocketURL);
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
        let lastUpdate = 0;
        wsc.onmessage = (message) => {
            const msg = JSON.parse(message.data);
            if (msg.type === 'status') {
                console.log(msg);
                if (msg.connected) {
                    if (setIsConnected) setIsConnected(true);
                }
                else if (setIsConnected) setIsConnected(false);
            }
            else if (msg.type === 'serial_data') {
                const now = Date.now();
                if (now - lastUpdate > 500) {
                    const data: Array<number> = msg.data?.split(' ').map((e: string) => Number(e.trim())).map((e:number, index:number) => servoToAngle(index, e));
                    if (setFeedbackJoint) setFeedbackJoint(data);
                    lastUpdate = now;
                    // console.log(msg.data?.split(' ').map((e: string) => Number(e.trim())).map((e: number, index: number) => servoToAngle(index, e)));
                }
            }
        }
    }

    useEffect(() => {
        if (ws) {
            ws.close();
            setWS(null); // ini penting supaya useEffect di bawah jalan lagi
        }
    }, [websocketURL]);
    
    useEffect(() => {
        if (!ws && websocketURL) {
            connectWebSocket();
            console.log(websocketURL);
            return;
        }
        return () => ws?.close();
    }, [websocketURL, ws]);

    return (
        <nav className='border border-b-black py-2 flex justify-between'>
            <button className={`border border-black rounded px-2 py-1 ${(pathname === '/')? 'invisible' : 'visible'}`} onClick={() => router.push('/')}>&lt;&lt; Back to Menu</button>
            <div className='flex items-center gap-2'>
                <p>Connected</p>
                <div className={`rounded-full w-5 h-5 bg-green-500 cursor-pointer`} />
                {/* <p>{(isConnected) ? '' : 'Not '}Connected</p>
                <div className={`rounded-full w-5 h-5 ${(isConnected) ? 'bg-green-500' : 'bg-red-500'} cursor-pointer`} /> */}
            </div>
        </nav>
    )
}

export default ConnectionStatus