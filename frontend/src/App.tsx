import React from 'react'

import { WalletKitProvider } from '@mysten/wallet-kit'
// import '@suiet/wallet-kit/style.css'

import Home from '@views/Home'

export default (): JSX.Element => (
  <WalletKitProvider>
    <Home />
  </WalletKitProvider>
)
