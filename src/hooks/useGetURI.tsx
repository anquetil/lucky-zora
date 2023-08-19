import { contractInfo } from "@/utils/linkFormatters";
import { erc721DropABI } from "@zoralabs/zora-721-contracts";
import { zoraCreator1155ImplABI } from "@zoralabs/zora-1155-contracts";
import axios from 'axios'

import { useContractRead } from "wagmi";
import { useQuery } from "@tanstack/react-query";

const fetchMetadata = (metadataURL: string): Promise<{ name: string, description: string, image: string }> => {
   return axios
      .get(`/api/ipfs/${encodeURIComponent(metadataURL!)}`, {method: 'GET'})
      .then(({data}) => data)
};

const formatLink = (imageData: string) : string => { 
   return imageData ? (imageData.includes("ipfs://") ? `https://gateway.pinata.cloud/ipfs/${imageData.substring(7)}` : imageData ) : ''
}

export function useGetURI(mintingContract: contractInfo) {
   const is721  = mintingContract.standard == 'ERC721' && mintingContract.address != '0x0'
   const is1155 = mintingContract.standard == 'ERC1155' && mintingContract.address != '0x0'

   const { data: ERC721Data, isLoading: isLoading721} = useContractRead({
      address: mintingContract.address,
      abi: erc721DropABI,
      functionName: "contractURI",
      enabled: is721
   })

   const { data: ERC1155Data, isLoading: isLoading1155 } = useContractRead({
      address: mintingContract.address,
      abi: zoraCreator1155ImplABI,
      functionName: "uri",
      args: [BigInt(mintingContract.token)],
      enabled: is1155
   })

   const isLoading = is721 ? isLoading721 : isLoading1155
   const data = is721 ? ERC721Data : ERC1155Data

   let metadataURL = ''
   if(data) metadataURL = formatLink(data)
   const { data: parsed1155Meta } = useQuery(['md', metadataURL], () => fetchMetadata(metadataURL), {enabled: (is1155 && data != undefined)})

   let metadata: {
      image: string,
      name: string,
      description: string
   } | undefined = undefined

   if (data){
      let result = { name: '', description: '', seller_fee_basis_points: 0, fee_recipient: '', image: '' }
      let imageData = ''

      if(is721){
         result = JSON.parse(atob(data!.substring(29)))
         imageData = result.image as string
         metadata = {
            image: formatLink(imageData),
            name: result.name,
            description: result.description
         }
      } else if(parsed1155Meta){
         metadata = {
            image: formatLink(parsed1155Meta.image),
            name: parsed1155Meta.name,
            description: parsed1155Meta.description
         }
      }
   }

   console.log(metadata)

   return {
      metadata,
      isLoading
   }
}

export default useGetURI