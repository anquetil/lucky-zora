import { contractInfo } from '@/utils/linkFormatters';
import { erc721DropABI } from "@zoralabs/zora-721-contracts";
import { zoraCreator1155ImplABI } from "@zoralabs/zora-1155-contracts";
const ethers =require('ethers');
import { Address, parseEther } from "viem";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

const zora_mainnet_1155minter = '0x169d9147dFc9409AfA4E558dF2C9ABeebc020182' // per https://github.com/ourzora/zora-1155-contracts/blob/main/addresses/7777777.json
const referralAddress = '0x6ab075abfA7cdD7B19FA83663b1f2a83e4A957e3'

export function useMint(mintingContract: contractInfo, userAddress: Address) {
   const coder = ethers.AbiCoder.defaultAbiCoder()

   const { config: config721 } = usePrepareContractWrite({
      address: mintingContract.address,
      abi: erc721DropABI,
      functionName: 'mintWithRewards',
      args: [
         userAddress,                     // address recipient
         BigInt(1),                       // uint256 quantity
         '',                              // string calldata comment
         referralAddress as `0x${string}` // address mintReferral
      ],  
      value: parseEther('0.000777'),
      enabled: mintingContract.address != '0x0' && mintingContract.standard == 'ERC721',
   })

   const { config: config1155 } = usePrepareContractWrite({
      address: mintingContract.address,
      abi: zoraCreator1155ImplABI,
      functionName: 'mintWithRewards',
      args: [
         zora_mainnet_1155minter,   // IMinter1155 minter
         BigInt(mintingContract.token),                  // uint256 tokenId
         BigInt(1),                                      // uint256 quantity
         coder.encode(
            ['address'],
            [userAddress]
         ) as `0x${string}`,                             // bytes calldata minterArguments
         referralAddress as `0x${string}`                // address mintReferral
      ],
      value: parseEther('0.000777'),
      enabled: mintingContract.address != '0x0' && mintingContract.standard == 'ERC1155',
   })

   const { write: write721, data: writeData721 } = useContractWrite(config721)
   const { write: write1155, data: writeData1155} = useContractWrite(config1155)

   const write = mintingContract.standard == 'ERC1155' ? write1155 : write721
   const writeData = mintingContract.standard == 'ERC1155' ? writeData1155 : writeData721

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

export default useMint