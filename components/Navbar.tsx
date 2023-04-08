import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { Toggle, ToggleItem } from "@tremor/react";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";
import { useAccount } from 'wagmi';



export default function Navbar() {
    const { address, isConnecting, isDisconnected } = useAccount();

    return (
        <nav className={`bg-gray-800 p-4 flex justify-between`}>
            <div className="flex items-center">
                <Link href="/">
                    <a className={`text-white font-bold text-xl`}>Linkee</a>
                </Link>
            </div>
            <div className="flex items-center">
            
        
                <ConnectButton showBalance={false} />
            </div>
        </nav>
    );
}