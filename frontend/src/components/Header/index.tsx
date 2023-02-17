import React from 'react'

import { AppBar, Toolbar, Box } from '@mui/material'

import { ConnectButton } from '@mysten/wallet-kit'

import './index.less'

export default (): JSX.Element => {
  return (
    <AppBar>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <ConnectButton className="header_connect" />
      </Toolbar>
    </AppBar>
  )
}
