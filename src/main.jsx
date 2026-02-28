import React from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import LoginGate from './LoginGate';

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
    }}
  >
    <LoginGate />
  </PrivyProvider>
);
