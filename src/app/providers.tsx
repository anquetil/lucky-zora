'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
   getDefaultWallets,
   RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
   zora,
   zoraTestnet
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import React from 'react';

const { chains, publicClient } = configureChains(
   [zora, zoraTestnet],
   [
      publicProvider()
   ]
);

const { connectors } = getDefaultWallets({
   appName: 'Lucky-Zora',
   projectId: 'a261687f8b5661577a94e94c6d97e168',
   chains
});

const wagmiConfig = createConfig({
   autoConnect: true,
   connectors,
   publicClient
})

const client = new ApolloClient({
   uri: 'https://api.goldsky.com/api/public/project_clhk16b61ay9t49vm6ntn4mkz/subgraphs/zora-create-zora-mainnet/stable/gn',
   cache: new InMemoryCache(),
})

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'


export function Providers({ children }: { children: React.ReactNode }) {
   const [mounted, setMounted] = React.useState(false);
   React.useEffect(() => setMounted(true), []);
   return (
      <ApolloProvider client={client}>
         <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
               {mounted && children}
            </RainbowKitProvider>
         </WagmiConfig>
      </ApolloProvider>
   );
}