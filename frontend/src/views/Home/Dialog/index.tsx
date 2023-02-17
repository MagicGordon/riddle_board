/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'

import { JsonRpcProvider, Network } from '@mysten/sui.js'

import { useWalletKit } from '@mysten/wallet-kit'

export default ({ open, setOpen, addRiddle }: any): JSX.Element => {
  const network = Network.DEVNET
  const provider = new JsonRpcProvider(network)

  const { currentAccount } = useWalletKit()

  const [key, setKey] = useState('')

  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const results: any[] = []
    const coins = await provider.getObjectsOwnedByAddress(currentAccount!)
    coins.forEach((coin) => results.push(provider.getObject(coin.objectId)))

    const res = await Promise.all(results)

    const consumption = res.find(
      (item, index) =>
        index > 0 && item.details.data.fields.balance === '10000000'
    )

    setLoading(false)
    addRiddle(
      key,
      consumption ? consumption.details.data.fields.id.id : undefined
    )
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth >
        <DialogTitle>Add Riddle</DialogTitle>
        <DialogContent>
          <TextField
            label="commitment"
            fullWidth
            variant="standard"
            sx={{ mb: 2 }}
            onChange={(e) => setKey(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!currentAccount || loading} onClick={handleSubmit}>
            Add Riddle
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
