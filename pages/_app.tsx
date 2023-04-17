import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { arbitrum, goerli, mainnet, optimism, polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { connectors } from "../utils/wallet";
import Navbar from '../components/Navbar';
import { PolybaseProvider, AuthProvider } from '@polybase/react';
import { Polybase } from '@polybase/client';
import { signMessage } from '@wagmi/core';
const Shardeum: Chain = {
   id: 8081,
   name: "Shardeum",
   network: "shardeum",
   nativeCurrency: {
       decimals: 18,
       name: "shardeum",
       symbol: "SHM",
  },
  rpcUrls: {
       default: {
           http: ["https://liberty20.shardeum.org/"],
      },
      public: {
        http: ["https://liberty20.shardeum.org/"],
   },
  },
   blockExplorers: {
       default: {
           name: "Shardeum Explorer",
           url: "https://explorer-liberty20.shardeum.org/",
      },
  },
  testnet: true,  
};

const { chains, provider, webSocketProvider } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    polygonMumbai,
    Shardeum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);


export const polybase = new Polybase({
  defaultNamespace: "pk/0x2a00ddaa99eb18c324f743545e861ddf6e53d3308ff794b0e4fa72fef87d58088ad70dd5112f5016e38ad63037c029fa886c26a739d532cccb041a67e38fe8ca/LinktreeDemo",
  signer: async (data: string) => {
      return {
        h: 'eth-personal-sign',
        sig: await signMessage({ message: data }),
      };
    },
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors: connectors(chains),
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PolybaseProvider polybase={polybase}>

    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} initialChain={Shardeum}>
        <Navbar />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
    </PolybaseProvider>
  );
}

export default MyApp;
