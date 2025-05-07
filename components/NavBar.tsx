'use client'

import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';

const ConnectionStatus = () => {
    const router = useRouter();
    const [connect, setConnect] = useState(true);
    return (
        <nav className='border border-b-black py-2 flex justify-between'>
            <button className='border border-black rounded px-2 py-1' onClick={() => router.push('/')}>&lt;&lt; Back to Menu</button>
            <div className='flex items-center gap-2'>
                <p>{(connect) ? '' : 'Not '}Connected</p>
                <div className={`rounded-full w-5 h-5 ${(connect) ? 'bg-green-500' : 'bg-red-500'} cursor-pointer`} />
            </div>
        </nav>
    )
}

export default ConnectionStatus