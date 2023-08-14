import { Address, Chain } from "viem";


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