'use client'

import React from 'react';
import { useState } from 'react';

const ConnectionStatus = () => {
    const [connect, setConnect] = useState(true);
    return (
        <nav className={`text-center ${(connect) ? 'bg-green-300' : 'bg-red-300'} cursor-pointer`}>
            <p>{(connect) ? '' : 'Not '}Connected</p>
        </nav>
    )
}

export default ConnectionStatus