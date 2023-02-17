/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from '@mui/material'

import { useWalletKit } from '@mysten/wallet-kit'

export default ({ rows, submit }: any): JSX.Element => {
  const { isConnected } = useWalletKit()

  const [text, setText] = useState<any>({})

  const handleText = (event: any, key: any) => {
    const _text = { ...text }
    _text[key] = event.target.value
    setText(_text)
  }

  const handleSubmit = (key: string) => {
    submit(key, text[key])
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>commitment</TableCell>
            <TableCell>reward(SUI)</TableCell>
            <TableCell>proof</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any, index: number) => {
            const { name, value } = row.details.data.fields
            const { data } = name.fields
            let key = '0x'
            data.forEach((item: string) => {
              const str = item.toString(16)
              key += str.length === 1 ? `0${str}` : str
            })
            return (
              <TableRow
                key={index}
                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{key}</TableCell>
                <TableCell>{value}</TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    onChange={(e) => handleText(e, key)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    disabled={!isConnected}
                    onClick={() => handleSubmit(key)}
                  >
                    submit
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
