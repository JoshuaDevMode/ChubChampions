import React from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import LoginGate from './LoginGate';

const solanaConnectors = toSolanaWalletConnectors();

const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public:  { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MonadScan', url: 'https://testnet.monadexplorer.com' },
  },
  testnet: true,
};

const root = createRoot(document.getElementById('privy-root'));

root.render(
  <PrivyProvider
    appId={import.meta.env.VITE_PRIVY_APP_ID}
    config={{
      loginMethods: ['twitter', 'email', 'wallet'],
      appearance: {
        accentColor: '#7c3aed',
        theme: 'dark',
      },
      embeddedWallets: {
        createOnLogin: 'users-without-wallets',
      },
      supportedChains: [monadTestnet],
      defaultChain: monadTestnet,
      externalWallets: {
        solana: { connectors: solanaConnectors },
      },
      solanaClusters: [
        { name: 'mainnet-beta', rpcUrl: 'https://api.mainnet-beta.solana.com' },
        { name: 'devnet',       rpcUrl: 'https://api.devnet.solana.com' },
      ],
    }}
  >
    <LoginGate />
  </PrivyProvider>
);
