'use client'

import { MintButton } from '@/components/MintButton';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

const chainInfo:Array<{name: string, id: number}> = [
   {
      name: "Zora Testnet",
      id: 999
   },
   {
      name: "Zora Mainnet",
      id: 7777777
   },
   {
      name: "Ethereum Mainnet",
      id: 1,
   }
]

export default function Home() {
   const intendedChain = chainInfo[0]
   const { isConnected, address } = useAccount()
   const { chain } = useNetwork()
   const { chains, isLoading: isLoadingNetworkSwitch, pendingChainId, switchNetwork } = useSwitchNetwork()
   const correctChain = chain?.id === intendedChain.id

   
   return (
      <main className="flex min-h-screen flex-col items-center pt-12 px-6 sm:pt-24 sm:px-0  bg-[fcfcfc]">
         <div className="text-3xl font-bold mb-8">MINT A FREE RANDOM ZORA NFT</div>
         {
            (!isConnected) 
            ?
            (
               <ConnectButton showBalance={false} accountStatus="avatar" />
            )
            :
               (correctChain && address != undefined) 
               ?
               (
                  <MintButton userAddress={address} chain={chain} />
               )
               :
               (
                  <button 
                     className="border-yellow-500 rounded-sm border-[1px] p-2 shadow-md bg-yellow-400 hover:bg-yellow-300 ease-in-out transition-all active:mt-[2px]" 
                     onClick={() => switchNetwork?.(intendedChain.id)}
                  >
                     <div className="text-opacity-75 text-black">
                        CONNECT TO {intendedChain.name.toUpperCase()}
                     </div>
                  </button>
               )
         }



         <div> 
            
         </div>

      </main>
   )
}
