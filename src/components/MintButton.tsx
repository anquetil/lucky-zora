'use client'

import { decodeFunctionData, parseEther } from 'viem/utils';
import { erc721DropABI } from "@zoralabs/zora-721-contracts";
import { Address } from 'viem';
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite, useContractRead } from 'wagmi';
import { getContracts } from '@/utils/getContracts';
const referralAddress = '0x6ab075abfA7cdD7B19FA83663b1f2a83e4A957e3'
var sample = require('lodash/sample');

export function MintButton({ userAddress, chainId }: { userAddress: Address, chainId: number }) {
   const possibleContracts = getContracts()
   const NFT721Contract = sample(possibleContracts) as Address //random contract
   console.log('possible: ', possibleContracts, 'chosen: ', NFT721Contract)

   const { data } = useContractRead({
      address: NFT721Contract,
      abi: erc721DropABI,
      functionName: "contractURI"
   })

   const json = atob(data!.substring(29));
   const result = JSON.parse(json);
   console.log(result);


   const { config: prepareConfig, error: prepareError } = usePrepareContractWrite({
      //chainId: chainId,
      address: NFT721Contract,
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

   return(
      <div>
         <button
            className="border-gray-300 border-[1px] px-5 py-4 rounded bg-white shadow text-xl hover:bg-gray-50 active:shadow-sm active:mt-[2px]"
            disabled={!write}
            onClick={() => write?.()}
         >
            I'M FEELING LUCKY
         </button>

         {isLoading && <div>Minting in progress</div>}
         {isSuccess && <div>Completed! Transaction: {transactionData?.transactionHash}</div>}

      </div>

   )
}