'use client'

import { decodeFunctionData, parseEther } from 'viem/utils';
import { erc721DropABI } from "@zoralabs/zora-721-contracts";
import { Address } from 'viem';
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite, useContractRead, Chain } from 'wagmi';
import { getContracts } from '@/utils/getContracts';
import { LoadingNoggles } from './LoadingNoggles';
import Image  from 'next/image'
import { getExplorerLink, getZoraLink } from '@/utils/linkFormatters';
const referralAddress = '0x6ab075abfA7cdD7B19FA83663b1f2a83e4A957e3'
var sample = require('lodash/sample');

export function MintButton({ userAddress, chain }: { userAddress: Address, chain: Chain }) {
   const possibleContracts = getContracts()
   const mintingContract = sample(possibleContracts) as Address //random contract
   const { data } = useContractRead({
      address: mintingContract,
      abi: erc721DropABI,
      functionName: "contractURI"
   })

   const json = atob(data!.substring(29));
   const result = JSON.parse(json) as { name: string, description: string, seller_fee_basis_points: number, fee_recipient: string, image: string };

   const { config: prepareConfig, error: prepareError } = usePrepareContractWrite({
      address: mintingContract,
      abi: erc721DropABI,
      functionName: 'mintWithRewards',
      args: [userAddress, BigInt(1), "", referralAddress as `0x${string}`],  
            //address recipient, uint256 quantity, string calldata comment, address mintReferral
      value: parseEther("0.000777")
   })

   const { write, data: writeData, error: writeError } = useContractWrite(prepareConfig)

   const { data: transactionData, isError, isLoading, isSuccess, status } = useWaitForTransaction({
      hash: writeData?.hash,
   })


   const txnHash = transactionData?.transactionHash
   const imageData = result.image as string
   const imageLink = imageData.includes("ipfs://") ? 
      `https://ipfs.io/ipfs/${imageData.substring(7)}`
      :
      imageData

   return(
      <div className="items-center flex flex-col">
         <button
            className="border-gray-300 border-[1px] px-5 py-4 rounded bg-white shadow text-xl hover:bg-gray-50 active:shadow-sm active:mt-[2px] active:mb-[-2px]"
            disabled={!write}
            onClick={() => write?.()}
         >
            I'M FEELING LUCKY
         </button>

         {isLoading && 
            <div className="mt-5">
            <LoadingNoggles/>
               <div className="text-center">Minting in progress</div>
            </div>}

         {isSuccess && 
            <div className="mt-5 text-center flex flex-col items-center">
               <Image
                  src={imageLink}
                  width={200}
                  height={200}
                  alt="your NFT" />
               <div className="mt-2">Minted <b>{result.name}</b>!</div>
               <div className="text-gray-500 italic">{result.description}</div>
               <div></div>
               <br></br>
               <a className="text-blue-700 underline" href={getZoraLink(chain, mintingContract)} target="_blank">
                  View on Zora
               </a>
               <a className="text-blue-700 underline" href={getExplorerLink(chain, txnHash!)} target="_blank">
                  {`${txnHash?.substring(0,6)}...${txnHash?.slice(-6)}`}
               </a>
            </div>
         }

      </div>

   )
}