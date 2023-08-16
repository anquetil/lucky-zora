import { erc721DropABI } from "@zoralabs/zora-721-contracts";
import { Address, parseEther } from "viem";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

export function useMint721(mintingContract: Address, userAddress: Address) {
   const referralAddress = '0x6ab075abfA7cdD7B19FA83663b1f2a83e4A957e3'

   const { config: prepareConfig, error: prepareError } = usePrepareContractWrite({
      address: mintingContract,
      abi: erc721DropABI,
      functionName: 'mintWithRewards',
      args: [userAddress, BigInt(1), "", referralAddress as `0x${string}`],  
            //address recipient, uint256 quantity, string calldata comment, address mintReferral
      value: parseEther("0.000777")
   })

   const { write, data: writeData } = useContractWrite(prepareConfig)

   const { data: transactionData, isError, isLoading, isSuccess, status, error } = useWaitForTransaction({
      hash: writeData?.hash,
   })


   return {
      write,
      error,
      transactionData,
      isError,
      isLoading,
      isSuccess,
      status,
   }
}

export default useMint721