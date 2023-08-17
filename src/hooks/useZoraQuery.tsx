import { Address  } from "viem";
import { useQuery, gql } from '@apollo/client'
import { contractInfo } from "@/utils/linkFormatters";

type queryFormat = {
   salesConfigFixedPriceSaleStrategies: {
      address: Address,
      contract: {
         address: Address,
         contractStandard: "ERC721" | "ERC1155",
         createdAtBlock: string,
         name: string,
         symbol: string,
      }
      saleEnd: string,
      saleStart: string,
      tokenId: string
   }[]
}

export function useZoraQuery(skip: boolean) {
   const coeff = 1000 * 60 * 5; // round to nearest 5 minutes
   const date = new Date();  //or use any other date
   const ts = (Math.round(date.getTime() / coeff) * coeff).toString()
   const openEditionsQuery = gql`query LastSales {
      salesConfigFixedPriceSaleStrategies(
         where: {
            saleStart_lt: ${ts},
            saleEnd_gt: ${ts}, 
            pricePerToken: "0"
         }
         orderBy: saleEnd
         orderDirection: asc
      ) {
         address
         saleEnd
         saleStart
         tokenId
         contract {
            address
            name
            symbol
            contractStandard
            createdAtBlock
         }
      }
   }`

   const { data, loading } = useQuery(openEditionsQuery, {
      skip: skip
   })

   const typedResult:queryFormat = data
   const formattedContractArray:contractInfo[] = []
   
   if(data){
      for (const strategy of typedResult.salesConfigFixedPriceSaleStrategies) {
         formattedContractArray.push({
            address: strategy.address,
            standard: strategy.contract.contractStandard,
            token: Number(strategy.tokenId)
         })
      }
   }

   return {
      formattedContractArray,
      loading
   }
}

export default useZoraQuery