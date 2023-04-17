import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
   
    return (
        <nav className={`bg-gray-800 p-4 flex justify-between`}>
            <div className="flex items-center">
                <Link href="/">
                    <a className={`text-white font-bold text-xl`}>Linkee</a>
                </Link>
            </div>
            <div className="flex items-center">
         
            </div>
            <ConnectButton showBalance={false}/>
        </nav>
    );
}