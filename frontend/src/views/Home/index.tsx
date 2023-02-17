/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'

import { Alert, AlertColor, Button, Divider, Snackbar } from '@mui/material'

import { JsonRpcProvider, Network } from '@mysten/sui.js'

import { useWalletKit } from '@mysten/wallet-kit'

import Header from '@components/Header'
import Table from './Table'
import Dialog from './Dialog'

import './index.less'

export default (): JSX.Element => {
  const { signAndExecuteTransaction } = useWalletKit()

  const network = Network.DEVNET
  const provider = new JsonRpcProvider(network)

  const [table, setTable] = useState<any>([])

  const [open, setOpen] = useState(false)

  const [severity, setSeverity] = useState<AlertColor>('success')
  const [text, setText] = useState('')

  const [openDialog, setOpenDialog] = useState(false)

  const init = async () => {
    setTable([])
    const results: any[] = []
    const objects = await provider.getObject(
      '0xdf04d8d2097409ae5f6d4d736777f66f937ba228'
    )
    if (objects.status === 'NotExists') {
      setSeverity('error')
      setText('devnet has been updated, please redeploy the contract and modify the frontend config file')
      return
    }
    const { id } = objects.details.data.fields.record.fields.id
    const { data } = await provider.getDynamicFields(id)
    data.forEach((item) => results.push(provider.getObject(item.objectId)))

    const _table = await Promise.all(results)

    setTable(_table)
  }

  const submit = async (key: any, text: any) => {
    const result = await signAndExecuteTransaction({
      kind: 'moveCall',
      data: {
        packageObjectId: '0x930c1261bb6d5f035348097f2515b03071b42b52',
        module: 'board',
        function: 'answer',
        typeArguments: [],
        arguments: ['0xdf04d8d2097409ae5f6d4d736777f66f937ba228', key, text],
        gasBudget: 10000,
      },
    })

    const { status } = result.effects.status
    if (status === 'success') {
      init()
      setSeverity('success')
    } else {
      setSeverity('error')
    }

    setText(status)

    setOpen(true)

  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const addRiddle = async (commitment: string, consumption: any) => {
    // 0x0800000000000000000000000000000000000000000000000000000000000000
    if (!consumption) {
      setText('Please confirm that there are 10000000 SUI token objects under your account')
      setSeverity('error')
      return
    }
    const result = await signAndExecuteTransaction({
      kind: 'moveCall',
      data: {
        packageObjectId: '0x930c1261bb6d5f035348097f2515b03071b42b52',
        module: 'board',
        function: 'add_riddle',
        typeArguments: [],
        arguments: [
          '0xdf04d8d2097409ae5f6d4d736777f66f937ba228',
          commitment,
          consumption,
        ],
        gasBudget: 10000,
      },
    })

    const { status } = result.effects.status
    if (status === 'success') {
      init()
      setSeverity('success')
    } else {
      setSeverity('error')
    }

    setText(status)

    setOpenDialog(false)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className="home">
      <Header />
      <div className="home_content">
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          add riddle
        </Button>
        <Divider sx={{ pt: 1, pb: 1 }} component="li" />
        <Table rows={table} submit={submit} />
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {text}
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} setOpen={setOpenDialog} addRiddle={addRiddle} />
    </div>
  )
}
