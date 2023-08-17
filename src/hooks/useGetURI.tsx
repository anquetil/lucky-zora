import { contractInfo } from "@/utils/linkFormatters";
import { erc721DropABI } from "@zoralabs/zora-721-contracts";
import { zoraCreator1155ImplABI } from "@zoralabs/zora-1155-contracts";

import { useContractRead } from "wagmi";

export function useGetURI(mintingContract: contractInfo) {

   const { data: ERC721Data, isLoading: isLoading721} = useContractRead({
      address: mintingContract.address,
      abi: erc721DropABI,
      functionName: "contractURI",
      enabled: mintingContract.standard == 'ERC721' && mintingContract.address != '0x0'
   })

   const { data: ERC1155Data, isLoading: isLoading1155 } = useContractRead({
      address: mintingContract.address,
      abi: zoraCreator1155ImplABI,
      functionName: "contractURI",
      enabled: mintingContract.standard == 'ERC1155' && mintingContract.address != '0x0'
   })

   const data = mintingContract.standard == 'ERC721' ? ERC721Data : ERC1155Data
   const isLoading = mintingContract.standard == 'ERC721' ? isLoading721 : isLoading1155

   return {
      data,
      isLoading
   }
}

export default useGetURI