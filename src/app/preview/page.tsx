'use client'

import { useState } from 'react';
var sample = require('lodash/sample');
import { getZoraLink, type contractInfo } from '@/utils/linkFormatters';
import useZoraQuery from '@/hooks/useZoraQuery';
import useGetURI from '@/hooks/useGetURI';
import Image from 'next/image';
import { LoadingNoggles } from '@/components/LoadingNoggles';
import { zora } from 'viem/chains';
import Link from 'next/link';


export default function Preview() {
   const [mintingContract, setMintingContract] = useState<contractInfo>({ address: '0x0', standard: 'ERC721', token: -1 })

   const { formattedContractArray } = useZoraQuery(mintingContract.address != '0x0')

   if (formattedContractArray.length > 0 && mintingContract.address == '0x0') { // setstate
      let chosenContract = sample(formattedContractArray) as contractInfo
      setMintingContract(chosenContract)
   }

   const {
      metadata,
   } = useGetURI(mintingContract)

   return (
      <main className="flex min-h-screen flex-col items-center pt-12 mx-6 sm:mx-28 sm:pt-24 sm:px-0  bg-[fcfcfc]">
         <div className="text-3xl font-bold mb-12 text-center">PREVIEW</div>
         <div className="mt-5 text-center flex flex-col items-center">
            {metadata ?
            (
               <>
                     <Image
                        src={metadata.image}
                        width={200}
                        height={200}
                        alt="your NFT" />
                     <div className="mt-2">Minted <b>{metadata.name}</b>!</div>
                     <div className="text-gray-500 italic">{metadata.description}</div>
                     <div></div>
                     <br></br>
                     <a className="text-blue-500 hover:text-blue-700 underline" href={getZoraLink(zora, mintingContract.address)} target="_blank">
                        View on Zora
                     </a>
               </>
            )
            :
            (
               <LoadingNoggles/>
            )

            }

         </div>
         <div className="mt-32 text-center font-extralight text-md text-gray-400">Feeling Lucky? Check out the <Link className='hover:text-gray-500 underline' href="/">Mint Page</Link></div>
      </main>
   )
}
