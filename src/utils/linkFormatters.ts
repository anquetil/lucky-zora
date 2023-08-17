import { Address, Chain } from "viem";

export type contractInfo = {
   address: Address,
   standard: 'ERC721' | 'ERC1155',
   token: number
}

//ALL FOR 721s ONLY
export function getZoraLink(chain: Chain, contract: Address): string {
   if(chain.id === 999){
      return `https://testnet.zora.co/collect/zgor:${contract}`
   } else if (chain.id = 7777777){
      return `https://zora.co/collect/zora:${contract}`
   } else {
      return `https://zora.co/collect/eth:${contract}` 
   }
}

export function getExplorerLink(chain: Chain, hash: Address): string {
   return `${chain.blockExplorers?.default.url}/tx/${hash}`
}