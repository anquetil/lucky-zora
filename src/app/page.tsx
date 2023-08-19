'use client'

import { MintButton } from '@/components/MintButton';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { Address, useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
var sample = require('lodash/sample');
import type { contractInfo } from '@/utils/linkFormatters';
import useZoraQuery from '@/hooks/useZoraQuery';

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
   const intendedChain = chainInfo[1] // this sets the require chain
   const [mintingContract, setMintingContract] = useState<contractInfo>({address: '0x0', standard: 'ERC721', token: -1})
   
   const { formattedContractArray } = useZoraQuery(mintingContract.address != '0x0')

   if(formattedContractArray.length > 0 && mintingContract.address == '0x0'){ // setstate
      let chosenContract = sample(formattedContractArray) as contractInfo
      setMintingContract(chosenContract)
   }

   const { isConnected, address } = useAccount()
   const { chain } = useNetwork()
   const { switchNetwork } = useSwitchNetwork()
   const correctChain = chain?.id === intendedChain.id

   
   return (
      <main className="flex min-h-screen flex-col items-center pt-12 mx-6 sm:mx-28 sm:pt-24 sm:px-0  bg-[fcfcfc]">
         <div className="text-3xl font-bold mb-12 text-center">MINT A FREE RANDOM ZORA NFT</div>
         {
            (!isConnected) 
            ?
            (<ConnectButton showBalance={false} accountStatus="avatar" />)
            :
            (correctChain && address != undefined) 
            ?
            (<MintButton userAddress={address} chain={chain} mintingContract={mintingContract} />)
            :
            (
               <button 
                  className="border-yellow-500 rounded-sm border-[1px] p-2 shadow-md bg-yellow-400 hover:bg-yellow-300 ease-in-out transition-all active:mt-[2px] active:mb-[-2px]" 
                  onClick={() => switchNetwork?.(intendedChain.id)}
               >
                  <div className="text-opacity-75 text-black">
                     CONNECT TO {intendedChain.name.toUpperCase()}
                  </div>
               </button>
            )
         }

         <div className="mt-48 text-center font-extralight text-md text-gray-400">by <a className="underline" href="https://twitter.com/anquetil" target="_blank">martin</a></div>
      </main>
   )
}
