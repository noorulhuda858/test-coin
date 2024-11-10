import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import { Config, useConnectorClient } from 'wagmi'

export async function clientToSigner(client: Client<Transport, Chain, Account>): Promise<JsonRpcSigner> {
    const { account, chain, transport } = client
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new BrowserProvider(transport, network)
    return provider.getSigner(account.address)
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
    const { data: client } = useConnectorClient<Config>({ chainId })
    return useMemo(() => {
        if (!client) return undefined
        return {
            getSignerAsync: async () => {
                return clientToSigner(client)
            }
        }
    }, [client])
}