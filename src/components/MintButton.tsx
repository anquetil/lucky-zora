'use client'

import { Address } from 'viem';
import { Chain } from 'wagmi';
import { LoadingNoggles } from './LoadingNoggles';
import Image  from 'next/image'
import { contractInfo, getExplorerLink, getZoraLink } from '@/utils/linkFormatters';
import useMint from '@/hooks/useMint';
import useGetURI from '@/hooks/useGetURI';

export function MintButton({ userAddress, chain, mintingContract }: { userAddress: Address, chain: Chain, mintingContract: contractInfo }) {
   const {
      write, 
      error,
      transactionData, 
      isLoading,
      isSuccess,
      isError,
   } = useMint(mintingContract, userAddress)

   const {
      data: dataURI,
   } = useGetURI(mintingContract)

   if(dataURI) console.log(dataURI)
   let result = { name: '', description: '', seller_fee_basis_points: 0, fee_recipient: '', image: '' }
   let imageLink = ''
   
   if (dataURI) {
      result = JSON.parse(atob(dataURI!.substring(29)))
      const imageData = result.image as string
      imageLink = imageData.includes("ipfs://") ? `https://ipfs.io/ipfs/${imageData.substring(7)}` : imageData
   }

   const txnHash = transactionData?.transactionHash


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
               <a className="text-blue-700 underline" href={getZoraLink(chain, mintingContract.address)} target="_blank">
                  View on Zora
               </a>
               <a className="text-blue-700 underline" href={getExplorerLink(chain, txnHash!)} target="_blank">
                  {`${txnHash?.substring(0,6)}...${txnHash?.slice(-6)}`}
               </a>
            </div>
         }
         {
            isError &&
            <div className="mt-5 text-center bg-red-400 text-red-600 rounded-sm p-3">Transaction Failed: {error?.message}</div>
         }

      </div>

   )
}